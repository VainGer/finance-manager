import ProfileBudgetDisplay from "./budget/ProfileBudgetDisplay";
import ExpensesDisplay from "./expenses/ExpensesDisplay";
import ExpenseSummary from "./summary/ExpenseSummary";
import { useAuth } from '../../context/AuthContext';

export default function DisplaySelector({ setDisplay }) {
    const { profile } = useAuth();

    const showBudgetOverview = () => {
        setDisplay(<ProfileBudgetDisplay profile={profile} />);
    };

    const showExpenses = () => {
        setDisplay(<ExpensesDisplay profile={profile} />);
    };

    const showSummary = () => {
        setDisplay(<ExpenseSummary profile={profile} />);
    };

    return (
        <div className="flex gap-2 p-4 bg-gray-100 rounded-lg mb-4">
            <button 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors" 
                onClick={showBudgetOverview}
            >
                סקירת תקציב
            </button>
            <button 
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors" 
                onClick={showExpenses}
            >
                הוצאות
            </button>
            <button 
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors" 
                onClick={showSummary}
            >
                סיכום הוצאות
            </button>
        </div>
    );
}