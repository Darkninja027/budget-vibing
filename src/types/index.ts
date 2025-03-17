export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: TransactionType;
  date: Date;
}

export interface WeekSummary {
  startDate: Date;
  endDate: Date;
  income: number;
  expenses: number;
  balance: number;
  transactions: Transaction[];
}