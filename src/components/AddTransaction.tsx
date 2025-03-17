import { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { TransactionType } from '../types';

const AddTransaction = () => {
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [type, setType] = useState<TransactionType>('expense');
  const { addTransaction } = useBudget();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description) return;
    
    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) return;
    
    addTransaction(amountNumber, description, type, new Date());
    
    // Reset form
    setAmount('');
    setDescription('');
    setType('expense');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="description">
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter description"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="amount">
            Amount (£)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            step="0.01"
            min="0.01"
            required
          />
        </div>
        
        <div className="mb-4">
          <span className="block text-gray-700 mb-2">Transaction Type</span>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="expense"
                checked={type === 'expense'}
                onChange={() => setType('expense')}
                className="form-radio h-5 w-5 text-red-600"
              />
              <span className="ml-2 text-red-600 font-medium">Expense</span>
            </label>
            
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="income"
                checked={type === 'income'}
                onChange={() => setType('income')}
                className="form-radio h-5 w-5 text-green-600"
              />
              <span className="ml-2 text-green-600 font-medium">Income</span>
            </label>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;