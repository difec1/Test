import { computeBudgetPlan } from '../../../services/agents';

export const buildBudgetSummary = async (strapi, userId: number) => {
  const transactions = await strapi.entityService.findMany('api::transaction.transaction', {
    filters: { user: userId },
    sort: { date: 'desc' },
  });

  const month = new Date().toISOString().slice(0, 7);
  const currentMonthTx = transactions.filter((tx) => tx.date?.startsWith(month));
  const kaggleStats = await strapi.plugin?.('kaggle-stats')?.service?.('stats')?.get?.();

  const plan = computeBudgetPlan({ id: userId }, currentMonthTx, kaggleStats || { patterns: [], averages: {} });

  const byCategory = currentMonthTx.reduce((acc, tx) => {
    const existing = acc.find((c) => c.category === tx.category);
    if (existing) {
      existing.amount += Number(tx.amount || 0);
    } else {
      acc.push({ category: tx.category, amount: Number(tx.amount || 0) });
    }
    return acc;
  }, [] as { category: string; amount: number }[]);

  const usedBudget = currentMonthTx.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
  const impulseTransactions = currentMonthTx.filter((tx) => tx.isImpulse);

  return {
    userId,
    month,
    monthlyBudget: plan.monthlyBudget,
    usedBudget,
    byCategory,
    impulseTransactions,
    patterns: plan.patterns,
  };
};
