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
                <View className="bg-white rounded-xl p-4 py-5 flex-1 mx-1 shadow-sm">
                    <Text className="text-xs text-slate-500 mb-3 text-right">תקציב</Text>
                    <View className="flex-row justify-between items-center">
                        <Ionicons name="wallet-outline" size={20} color="#334155" />
                        <View style={{ width: '80%' }}>
                            <Text 
                                className="font-bold text-slate-800 text-right"
                                style={{ fontSize: 14 }}
                                adjustsFontSizeToFit
                            >
                                {totalBudget}
                            </Text>
                        </View>
                    </View>
                </View>
                
                <View className="bg-white rounded-xl p-4 py-5 flex-1 mx-1 shadow-sm">
                    <Text className="text-xs text-slate-500 mb-3 text-right">הוצאות</Text>
                    <View className="flex-row justify-between items-center">
                        <Ionicons name="card-outline" size={20} color="#334155" />
                        <View style={{ width: '80%' }}>
                            <Text 
                                className="font-bold text-slate-800 text-right"
                                style={{ fontSize: 14 }}
                                adjustsFontSizeToFit
                            >
                                {totalSpent}
                            </Text>
                        </View>
                    </View>
                </View>
                
                <View className="bg-white rounded-xl p-4 py-5 flex-1 mx-1 shadow-sm">
                    <Text className="text-xs text-slate-500 mb-3 text-right">יתרה</Text>
                    <View className="flex-row justify-between items-center">
                        <Ionicons name="cash-outline" size={20} color="#334155" />
                        <View style={{ width: '80%' }}>
                            <Text 
                                className="font-bold text-right"
                                style={{ 
                                    color: spendingPercentage > 100 ? "#EF4444" : "#10B981",
                                    fontSize: 14
                                }}
                                adjustsFontSizeToFit
                            >
                                {remaining}
                            </Text>
                        </View>
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