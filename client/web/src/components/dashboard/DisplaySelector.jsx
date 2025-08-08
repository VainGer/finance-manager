import ProfileBudgetDisplay from "./budget/ProfileBudgetDisplay";
import ExpensesDisplay from "./expenses/expenses_display/ExpensesDisplay";
import ExpenseSummary from "./summary/ExpenseSummary";
import InteractiveCharts from "./charts/InteractiveCharts";

export default function DisplaySelector({ setDisplay, setCurrentDisplayType, profile, refreshTrigger }) {

    const showBudgetOverview = () => {
        setCurrentDisplayType('budget');
        setDisplay(<ProfileBudgetDisplay profile={profile} key={`budget-${refreshTrigger}`} />);
    };

    const showExpenses = () => {
        setCurrentDisplayType('expenses');
        setDisplay(<ExpensesDisplay profile={profile} key={`expenses-${refreshTrigger}`} />);
    };

    const showSummary = () => {
        setCurrentDisplayType('summary');
        setDisplay(<ExpenseSummary profile={profile} key={`summary-${refreshTrigger}`} />);
    };

    const showCharts = () => {
        setCurrentDisplayType('charts');
        setDisplay(<InteractiveCharts profile={profile} key={`charts-${refreshTrigger}`} />);
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
            <button 
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors" 
                onClick={showCharts}
            >
                גרפים
            </button>
        </div>
    );
}