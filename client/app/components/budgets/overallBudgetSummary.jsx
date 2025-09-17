import { Ionicons } from "@expo/vector-icons";
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
            {/* Budget Stats Cards - Vertical Layout */}
            <View className="mb-6">
                {/* Budget Card */}
                <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                            <Ionicons name="wallet-outline" size={24} color="#334155" className="mr-3" />
                            <Text className="text-base font-medium text-slate-700">תקציב</Text>
                        </View>
                        <Text 
                            className="font-bold text-slate-800"
                            style={{ fontSize: 16 }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {totalBudget}
                        </Text>
                    </View>
                </View>
                
                {/* Expenses Card */}
                <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                            <Ionicons name="card-outline" size={24} color="#334155" className="mr-3" />
                            <Text className="text-base font-medium text-slate-700">הוצאות</Text>
                        </View>
                        <Text 
                            className="font-bold text-slate-800"
                            style={{ fontSize: 16 }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {totalSpent}
                        </Text>
                    </View>
                </View>
                
                {/* Remaining Card */}
                <View className="bg-white rounded-xl p-4 shadow-sm">
                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                            <Ionicons name="cash-outline" size={24} color="#334155" className="mr-3" />
                            <Text className="text-base font-medium text-slate-700">יתרה</Text>
                        </View>
                        <Text 
                            className="font-bold"
                            style={{ 
                                color: spendingPercentage > 100 ? "#EF4444" : "#10B981",
                                fontSize: 16
                            }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {remaining}
                        </Text>
                    </View>
                </View>
            </View>
            
            {/* Progress Section */}
            <View className="mb-1">
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="font-medium" style={{ color: statusColor, fontSize: 14 }}>
                        {spendingPercentage}%
                    </Text>
                    <Text className="font-medium text-slate-700" style={{ fontSize: 14 }}>ניצול תקציב</Text>
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
                    <Text style={{ color: statusColor, fontSize: 13, fontWeight: '500' }} className="mr-1">
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