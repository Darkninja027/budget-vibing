import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, TransactionType, WeekSummary } from '../types';
import { startOfWeek, endOfWeek, isSameWeek, addWeeks, subWeeks } from 'date-fns';

interface BudgetContextType {
  transactions: Transaction[];
  addTransaction: (amount: number, description: string, type: TransactionType, date: Date) => void;
  deleteTransaction: (id: string) => void;
  currentWeek: Date;
  setCurrentWeek: (date: Date) => void;
  nextWeek: () => void;
  prevWeek: () => void;
  currentWeekSummary: WeekSummary;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};

interface BudgetProviderProps {
  children: ReactNode;
}

export const BudgetProvider = ({ children }: BudgetProviderProps) => {
  // Load from localStorage or initialize empty array
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('budget-transactions');
    if (savedTransactions) {
      return JSON.parse(savedTransactions).map((t: any) => ({
        ...t,
        date: new Date(t.date)
      }));
    }
    return [];
  });
  
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());

  // Save to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('budget-transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (amount: number, description: string, type: TransactionType, date: Date) => {
    const newTransaction: Transaction = {
      id: uuidv4(),
      amount,
      description,
      type,
      date
    };
    
    setTransactions([...transactions, newTransaction]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const nextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const prevWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  // Calculate current week summary
  const getCurrentWeekSummary = (): WeekSummary => {
    const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 }); // 0 = Sunday
    const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 0 });
    
    const weekTransactions = transactions.filter(t => 
      isSameWeek(new Date(t.date), currentWeek, { weekStartsOn: 0 })
    );
    
    const income = weekTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = weekTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      startDate: weekStart,
      endDate: weekEnd,
      income,
      expenses,
      balance: income - expenses,
      transactions: weekTransactions
    };
  };

  const currentWeekSummary = getCurrentWeekSummary();

  return (
    <BudgetContext.Provider 
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        currentWeek,
        setCurrentWeek,
        nextWeek,
        prevWeek,
        currentWeekSummary
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};