import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { normalizeIncomingTransaction } from '../services/agents';

const DATA_DIR = path.join(__dirname, '..', 'data', 'kaggle');

export const loadKaggleFiles = () => {
  const files = fs.readdirSync(DATA_DIR).filter((file) => file.endsWith('.csv') || file.endsWith('.json'));
  const rows: any[] = [];
  files.forEach((file) => {
    const filePath = path.join(DATA_DIR, file);
    if (file.endsWith('.csv')) {
      const csv = fs.readFileSync(filePath, 'utf-8');
      const parsed = parse(csv, { columns: true, skip_empty_lines: true });
      rows.push(...parsed);
    } else {
      rows.push(...JSON.parse(fs.readFileSync(filePath, 'utf-8')));
    }
  });
  return rows;
};

export const mapKaggleRow = (row: any) => ({
  date: row.date || row.timestamp || row.datetime,
  merchant: row.merchant || row.description || row.vendor,
  amount: row.amount || row.price || row.value,
  rawText: row.rawText || row.notes || row.category,
  category: row.category || row.label || 'Other',
});

export const importKaggleData = async (strapi) => {
  const rows = loadKaggleFiles();
  const normalizedTransactions = await Promise.all(
    rows.map(async (row) => {
      const mapped = mapKaggleRow(row);
      const normalized = await normalizeIncomingTransaction(mapped);
      return {
        ...normalized,
        category: mapped.category,
        isImpulse: false,
        decisionLabel: 'useful',
        decisionExplanation: 'Historische Referenz',
        source: 'kaggle',
      };
    }),
  );

  await Promise.all(
    normalizedTransactions.map((data) =>
      strapi.entityService.create('api::transaction.transaction', {
        data,
      }),
    ),
  );

  const stats = normalizedTransactions.reduce(
    (acc, tx) => {
      acc.count += 1;
      acc.total += Number(tx.amount);
      acc.byCategory[tx.category] = (acc.byCategory[tx.category] || 0) + Number(tx.amount);
      return acc;
    },
    { count: 0, total: 0, byCategory: {} as Record<string, number> },
  );

  fs.writeFileSync(path.join(DATA_DIR, 'stats.json'), JSON.stringify(stats, null, 2));

  return stats;
};
