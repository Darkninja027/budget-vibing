import { format } from 'date-fns';
import { FaTrash } from 'react-icons/fa';
import { useGetTransactions, useDeleteTransaction } from '../api/budgetComponents';
import type { Transaction } from '../api/budgetSchemas';

const TransactionsList = () => {  
  const { data: transactions = [], isLoading, error } = useGetTransactions({});
  const { mutate: deleteTransaction } = useDeleteTransaction();

  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Transactions</h2>
        <p className="text-gray-500 italic">Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    const errorMessage = 'status' in error ? error.payload : 'Unknown error';
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Transactions</h2>
        <p className="text-red-500">Error: {errorMessage}</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Transactions</h2>
        <p className="text-gray-500 italic">No transactions recorded.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Transactions</h2>
      <div className="overflow-auto max-h-80">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction: Transaction) => (
              <tr key={transaction.id} className="border-t border-gray-200">
                <td className="py-3 px-3 text-sm text-gray-600">
                  {format(new Date(transaction.date || new Date()), 'dd MMM')}
                </td>
                <td className="py-3 px-3 text-sm">
                  {transaction.description}
                </td>
                <td className={`py-3 px-3 text-sm text-right font-medium ${
                  (transaction.amount ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(transaction.amount ?? 0) >= 0 ? '+' : '-'}£{Math.abs(transaction.amount ?? 0).toFixed(2)}
                </td>
                <td className="py-3 px-3 text-sm text-right">
                  <button
                    onClick={() => transaction.id && deleteTransaction({ pathParams: { id: transaction.id } })}
                    className="text-gray-500 hover:text-red-600 transition duration-150"
                    aria-label="Delete transaction"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsList;