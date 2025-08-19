import { Text, View } from "react-native";
import { getProgressColor, getProgressPercentage } from '../../utils/budgetUtils';
import { formatCurrency } from "../../utils/formatters";
import ProgressBar from "../common/progressBar";

export default function OverallBudgetSummary({ budget }) {
    const spendingPercentage = getProgressPercentage(budget.spent, budget.amount);

    const totalBudget = formatCurrency(budget.amount || 0);
    const totalSpent = formatCurrency(budget.spent || 0);
    const remaining = formatCurrency(budget.amount - budget.spent);
    const barColor = getProgressColor(spendingPercentage);

    return (
        <View className="w-5/6 mx-auto my-4 p-4">
            <Text>סך התקציב: {totalBudget}</Text>
            <Text>סך ההוצאות: {totalSpent}</Text>
            <Text>יתרה: {remaining}</Text>
            <ProgressBar
                progress={spendingPercentage}
                color={barColor}
            />
            <Text>אחוז הוצאת התקציב: {spendingPercentage}%</Text>
        </View>
    )
}