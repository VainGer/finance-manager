import { Ionicons } from "@expo/vector-icons";
import { Text, View } from 'react-native';
import { getProgressBarPercentage, getProgressColor, getProgressPercentage } from '../../utils/budgetUtils.js';
import { formatCurrency } from '../../utils/formatters.js';
import ProgressBar from '../common/progressBar.jsx';

export default function CategoryBudgetDetails({ categories }) {
    return (
        <View className="px-4 pb-20">

            
            {categories.length === 0 ? (
                <View className="bg-white rounded-xl p-6 items-center justify-center border border-slate-100">
                    <Ionicons name="folder-open-outline" size={40} color="#94A3B8" />
                    <Text className="text-center text-slate-500 mt-2">
                        לא נמצאו תקציבים לקטגוריות
                    </Text>
                    <Text className="text-center text-slate-400 text-xs mt-1">
                        הגדר תקציבים לקטגוריות כדי לראות את הפירוט כאן
                    </Text>
                </View>
            ) : (
                categories.map((category, index) => {
                    const budgetAmount = category.budget || 0;
                    const categorySpent = category.spent || 0;
                    const progressPercentage = getProgressPercentage(categorySpent, budgetAmount);
                    const progressBarPercentage = getProgressBarPercentage(categorySpent, budgetAmount);

                    const getStatusIcon = () => {
                        if (progressPercentage > 100) return { name: "alert-circle", color: "#EF4444" }; // Over budget
                        if (progressPercentage > 90) return { name: "warning", color: "#F59E0B" }; // Near limit
                        if (progressPercentage > 75) return { name: "alert", color: "#FBBF24" }; // High usage
                        return { name: "checkmark-circle", color: "#10B981" }; // Good
                    };

                    const statusIcon = getStatusIcon();

                    return (
                        <View key={index} className="bg-white rounded-xl p-4 mb-3 border border-slate-100 shadow-sm">
                            <View className="flex-row justify-between items-center mb-3">
                                <View className="flex-row items-center">
                                    <Ionicons name={statusIcon.name} size={18} color={statusIcon.color} className="mr-2" />
                                    <Text className="text-base font-medium" style={{ color: statusIcon.color }}>
                                        {progressPercentage > 100 ? "חריגה מהתקציב" : 
                                         progressPercentage > 90 ? "קרוב לחריגה" :
                                         progressPercentage > 75 ? "ניצול גבוה" : "במסגרת התקציב"}
                                    </Text>
                                </View>
                                <Text className="text-lg font-bold text-slate-800">{category.name}</Text>
                            </View>
                            
                            <View className="mb-3">
                                <ProgressBar
                                    progress={progressBarPercentage}
                                    color={getProgressColor(progressPercentage)}
                                />
                                <View className="flex-row justify-between mt-1">
                                    <Text className="text-slate-500" style={{ fontSize: 12, width: '30%', textAlign: 'left' }}>
                                        {formatCurrency(categorySpent)}
                                    </Text>
                                    <View className="bg-slate-100 px-2 py-0.5 rounded-full">
                                        <Text 
                                            className="font-medium" 
                                            style={{ 
                                                color: getProgressColor(progressPercentage),
                                                fontSize: 12
                                            }}
                                        >
                                            {Math.min(progressPercentage, 100).toFixed(0)}%
                                        </Text>
                                    </View>
                                    <Text className="text-slate-500" style={{ fontSize: 12, width: '30%', textAlign: 'right' }}>
                                        {formatCurrency(budgetAmount)}
                                    </Text>
                                </View>
                            </View>
                            
                            <View className="mb-1">
                                {/* Budget Card */}
                                <View className="bg-slate-50 rounded-lg p-3 mb-2">
                                    <View className="flex-row justify-between items-center">
                                        <View className="flex-row items-center">
                                            <Ionicons name="wallet-outline" size={20} color="#334155" className="mr-2" />
                                            <Text className="text-sm font-medium text-slate-700">תקציב</Text>
                                        </View>
                                        <Text 
                                            className="font-bold text-slate-800"
                                            style={{ fontSize: 15 }}
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >
                                            {formatCurrency(budgetAmount)}
                                        </Text>
                                    </View>
                                </View>
                                
                                {/* Expenses Card */}
                                <View className="bg-slate-50 rounded-lg p-3 mb-2">
                                    <View className="flex-row justify-between items-center">
                                        <View className="flex-row items-center">
                                            <Ionicons name="card-outline" size={20} color="#334155" className="mr-2" />
                                            <Text className="text-sm font-medium text-slate-700">הוצאות</Text>
                                        </View>
                                        <Text 
                                            className="font-bold text-slate-800"
                                            style={{ fontSize: 15 }}
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >
                                            {formatCurrency(categorySpent)}
                                        </Text>
                                    </View>
                                </View>
                                
                                {/* Remaining Card */}
                                <View className="bg-slate-50 rounded-lg p-3">
                                    <View className="flex-row justify-between items-center">
                                        <View className="flex-row items-center">
                                            <Ionicons name="cash-outline" size={20} color="#334155" className="mr-2" />
                                            <Text className="text-sm font-medium text-slate-700">יתרה</Text>
                                        </View>
                                        <Text 
                                            className="font-bold"
                                            style={{ 
                                                color: categorySpent <= budgetAmount ? "#10B981" : "#EF4444",
                                                fontSize: 15
                                            }}
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >
                                            {formatCurrency(budgetAmount - categorySpent)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            
                            {/* Status message moved to the header */}
                        </View>
                    );
                })
            )}
        </View>
    );
}
