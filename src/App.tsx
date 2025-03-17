import { BudgetProvider } from './context/BudgetContext';
import WeekSummary from './components/WeekSummary';
import AddTransaction from './components/AddTransaction';
import TransactionsList from './components/TransactionsList';
import './App.css';

function App() {
  return (
    <BudgetProvider>
      <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Budget Vibing</h1>
          
          <WeekSummary />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <AddTransaction />
            </div>
            <div>
              <TransactionsList />
            </div>
          </div>
        </div>
      </div>
    </BudgetProvider>
  );
}

export default App;
