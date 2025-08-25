import { Text, View } from "react-native";
import { getProgressColor, getProgressPercentage } from '../../utils/budgetUtils';
import { formatCurrency } from "../../utils/formatters";
import { Ionicons } from "@expo/vector-icons";
import ProgressBar from "../common/progressBar";

export default function OverallBudgetSummary({ budget }) {
    const spendingPercentage = getProgressPercentage(budget.spent, budget.amount);

    const totalBudget = formatCurrency(budget.amount || 0);
    const totalSpent = formatCurrency(budget.spent || 0);
    const remaining = formatCurrency(budget.amount - budget.spent);
    const barColor = getProgressColor(spendingPercentage);

    // Get the status color based on the percentage
    const getStatusColor = () => {
        if (spendingPercentage > 100) return "#EF4444"; // red-500
        if (spendingPercentage > 90) return "#F59E0B"; // amber-500
        if (spendingPercentage > 75) return "#FBBF24"; // yellow-400
        return "#10B981"; // emerald-500
    };

    const statusColor = getStatusColor();

    return (
        <View className="w-full mx-auto px-4 pb-6">
            {/* Budget Stats Cards */}
            <View className="flex-row justify-between mb-6">
                <View className="bg-white rounded-xl p-3 flex-1 mx-1 shadow-sm">
                    <Text className="text-xs text-slate-500 mb-1 text-right">תקציב</Text>
                    <View className="flex-row justify-between items-center">
                        <Ionicons name="wallet-outline" size={18} color="#334155" />
                        <Text className="text-lg font-bold text-slate-800">{totalBudget}</Text>
                    </View>
                </View>
                
                <View className="bg-white rounded-xl p-3 flex-1 mx-1 shadow-sm">
                    <Text className="text-xs text-slate-500 mb-1 text-right">הוצאות</Text>
                    <View className="flex-row justify-between items-center">
                        <Ionicons name="card-outline" size={18} color="#334155" />
                        <Text className="text-lg font-bold text-slate-800">{totalSpent}</Text>
                    </View>
                </View>
                
                <View className="bg-white rounded-xl p-3 flex-1 mx-1 shadow-sm">
                    <Text className="text-xs text-slate-500 mb-1 text-right">יתרה</Text>
                    <View className="flex-row justify-between items-center">
                        <Ionicons name="cash-outline" size={18} color="#334155" />
                        <Text className="text-lg font-bold" style={{ color: spendingPercentage > 100 ? "#EF4444" : "#10B981" }}>{remaining}</Text>
                    </View>
                </View>
            </View>
            
            {/* Progress Section */}
            <View className="mb-1">
                <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-sm font-medium" style={{ color: statusColor }}>
                        {spendingPercentage}%
                    </Text>
                    <Text className="text-sm font-medium text-slate-700">ניצול תקציב</Text>
                </View>
                <ProgressBar
                    progress={spendingPercentage}
                    color={barColor}
                    height={10}
                />
            </View>
            
            {/* Status Message */}
            <View className="mt-2 items-end">
                <View className="flex-row items-center">
                    <Text className="text-sm mr-1" style={{ color: statusColor }}>
                        {spendingPercentage > 100 ? "חריגה מהתקציב" : 
                         spendingPercentage > 90 ? "קרוב לחריגה" :
                         spendingPercentage > 75 ? "ניצול גבוה" : "במסגרת התקציב"}
                    </Text>
                    <Ionicons 
                        name={spendingPercentage > 90 ? "alert-circle-outline" : "checkmark-circle-outline"} 
                        size={16} 
                        color={statusColor} 
                    />
                </View>
            </View>
        </View>
    )
}