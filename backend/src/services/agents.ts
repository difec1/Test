import OpenAI from 'openai';
import { chunk } from 'lodash';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'demo' });

type ConversationMessage = { role: 'system' | 'user' | 'assistant'; content: string };

type NormalizedTransaction = {
  date: string;
  merchant: string;
  amount: number;
  rawText?: string;
};

type KaggleExample = {
  merchant: string;
  amount: number;
  category: string;
  isImpulse: boolean;
  decisionLabel: string;
  decisionExplanation: string;
};

export const normalizeIncomingTransaction = async (input: any): Promise<NormalizedTransaction> => {
  const { date, merchant, amount, rawText, justification } = input;
  const parsedDate = date ? new Date(date).toISOString() : new Date().toISOString();
  return {
    date: parsedDate,
    merchant: merchant || 'Unbekannter Händler',
    amount: Number(amount || 0),
    rawText: rawText || justification || '',
  };
};

export const classifyImpulse = async (transaction: NormalizedTransaction, kaggleExamples: KaggleExample[]) => {
  const promptExamples = kaggleExamples.slice(0, 6).map(
    (ex) =>
      `Beispiel: ${ex.merchant}, Betrag ${ex.amount} -> Kategorie ${ex.category}, Impuls ${ex.isImpulse}, Entscheid ${ex.decisionLabel}. Erklärung: ${ex.decisionExplanation}`,
  );
  const systemPrompt = `Du bist SmartBudgetAI und kategorisierst Käufe. Antworte als JSON mit Feldern category, isImpulse, decisionLabel, decisionExplanation.`;
  const userPrompt = `Transaktion: ${transaction.merchant}, Betrag ${transaction.amount}, Datum ${transaction.date}. Rohtext: ${
    transaction.rawText || 'keiner'
  }.\nBeispiele:\n${promptExamples.join('\n')}`;

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
  });

  const json = JSON.parse(completion.choices[0].message.content || '{}');

  return {
    category: json.category || 'Other',
    isImpulse: json.isImpulse ?? false,
    decisionLabel: json.decisionLabel || 'useful',
    decisionExplanation: json.decisionExplanation || 'Automatische Einstufung.',
  };
};

export const extractSavingsGoal = async (goalText: string) => {
  const systemPrompt = 'Extrahiere Sparziel aus deutschem Satz. Antworte als JSON mit title, targetAmount, targetDate, rules (Array).';
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: goalText },
    ],
    response_format: { type: 'json_object' },
  });
  const json = JSON.parse(completion.choices[0].message.content || '{}');
  return {
    title: json.title || 'Neues Sparziel',
    targetAmount: json.targetAmount || 0,
    targetDate: json.targetDate || new Date().toISOString().slice(0, 10),
    currentSavedAmount: 0,
    rules: json.rules || [],
  };
};

export const computeBudgetPlan = (user: any, transactions: any[], kaggleStats: any) => {
  const monthlyBudget = 0.6 * 3000; // simple placeholder until income is captured
  const impulseShare = transactions.filter((tx) => tx.isImpulse).length;
  const patterns = [
    `Aktuell hast du ${impulseShare} Impulskäufe im Monat.`,
    ...(kaggleStats.patterns || []),
  ];
  return { monthlyBudget, patterns };
};

type DetectIntentParams = {
  history: ConversationMessage[];
  message: string;
  goals: any[];
  summary: any;
};

export const detectIntentAndRespond = async (
  params: DetectIntentParams,
  onGoalDetected: (goalText: string) => Promise<any>,
) => {
  const { history, message, goals, summary } = params;
  const goalKeywords = ['sparen', 'ziel', 'bis', 'budget', 'CHF', 'Euro'];
  if (goalKeywords.some((word) => message?.toLowerCase().includes(word))) {
    const createdGoal = await onGoalDetected(message);
    return { reply: 'Ich habe dein Sparziel angelegt und passe dein Plan an.', createdGoal };
  }

  const context = `Budget: ${summary.usedBudget} / ${summary.monthlyBudget}. Ziele: ${goals
    .map((g) => `${g.title} (${g.targetAmount})`)
    .join(', ')}.`;

  const chatMessages: ConversationMessage[] = [
    {
      role: 'system',
      content:
        'Du bist SmartBudgetAI, ein ehrlicher Finanzcoach. Antworte auf Deutsch, kurz und konkret. Nutze Budget und Ziele, um Tipps zu geben.',
    },
    { role: 'user', content: `${context}\n${message}` },
    ...history,
  ];

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: chatMessages,
  });

  return { reply: completion.choices[0].message.content };
};

export const fewShotChunks = (transactions: KaggleExample[]) => chunk(transactions, 10);
