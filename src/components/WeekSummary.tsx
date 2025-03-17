import { useBudget } from '../context/BudgetContext';
import { format } from 'date-fns';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const WeekSummary = () => {
  const { currentWeekSummary, prevWeek, nextWeek } = useBudget();
  const { startDate, endDate, income, expenses, balance } = currentWeekSummary;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={prevWeek}
          className="p-2 rounded-full hover:bg-gray-100 transition duration-150"
          aria-label="Previous week"
        >
          <FaChevronLeft className="text-gray-600" />
        </button>
        
        <h2 className="text-xl font-bold text-center">
          {format(startDate, 'dd MMM')} - {format(endDate, 'dd MMM yyyy')}
        </h2>
        
        <button 
          onClick={nextWeek}
          className="p-2 rounded-full hover:bg-gray-100 transition duration-150"
          aria-label="Next week"
        >
          <FaChevronRight className="text-gray-600" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-3 rounded-lg">
          <h3 className="text-sm text-green-800 font-semibold uppercase">Income</h3>
          <p className="text-xl font-bold text-green-600">£{income.toFixed(2)}</p>
        </div>
        
        <div className="bg-red-50 p-3 rounded-lg">
          <h3 className="text-sm text-red-800 font-semibold uppercase">Expenses</h3>
          <p className="text-xl font-bold text-red-600">£{expenses.toFixed(2)}</p>
        </div>
        
        <div className={`${balance >= 0 ? 'bg-blue-50' : 'bg-yellow-50'} p-3 rounded-lg`}>
          <h3 className={`text-sm ${balance >= 0 ? 'text-blue-800' : 'text-yellow-800'} font-semibold uppercase`}>Balance</h3>
          <p className={`text-xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-yellow-600'}`}>
            £{balance.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeekSummary;