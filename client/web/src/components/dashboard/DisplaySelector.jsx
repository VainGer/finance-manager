import ProfileBudgetDisplay from "./budget/ProfileBudgetDisplay";
import ExpensesDisplay from "./expenses/expenses_display/ExpensesDisplay";
import ExpenseSummary from "./summary/ExpenseSummary";
import InteractiveCharts from "./charts/InteractiveCharts";
import Button from "../common/Button";
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
        <div className="flex gap-2 p-4 bg-gray-100 rounded-lg mb-4 w-3/4 mx-auto">
            <Button
                onClick={showBudgetOverview}
                bg={'bg-blue-500'}
            >
                סקירת תקציב
            </Button>
            <Button
                onClick={showExpenses}
                bg={'bg-green-500'}
            >
                הוצאות
            </Button>
            <Button
                onClick={showSummary}
                bg={'bg-purple-500'}
            >
                סיכום הוצאות
            </Button>
            <Button
                onClick={showCharts}
                bg={'bg-red-400'}
            >
                גרפים
            </Button>
        </div>
    );
}