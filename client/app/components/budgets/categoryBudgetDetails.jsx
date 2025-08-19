import { Text, View } from 'react-native';
import { getProgressBarPercentage, getProgressColor, getProgressPercentage } from '../../utils/budgetUtils.js';
import { formatCurrency } from '../../utils/formatters.js';
import ProgressBar from '../common/progressBar.jsx';

export default function CategoryBudgetDetails({ categories }) {


    return (
        <View className="p-2">
            {categories.map((category, index) => {
                const budgetAmount = category.budget || 0;
                const categorySpent = category.spent || 0;
                const progressPercentage = getProgressPercentage(categorySpent, budgetAmount);
                const progressBarPercentage = getProgressBarPercentage(categorySpent, budgetAmount);

                const getStatusText = () => {
                    if (progressPercentage > 100) return "⚠️ חריגה מהתקציב!";
                    if (progressPercentage > 90) return "⚡ קרוב לחריגה";
                    if (progressPercentage > 75) return "⚡ ניצול גבוה";
                    return "✅ במסגרת התקציב";
                };

                const getStatusColor = () => {
                    if (progressPercentage > 100) return "text-red-600";
                    if (progressPercentage > 90) return "text-orange-600";
                    if (progressPercentage > 75) return "text-yellow-600";
                    return "text-green-600";
                };

                return (
                    <View key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-5">
                        <View className="mb-3 items-center">
                            <Text className="text-xl font-bold text-gray-800">{category.name}</Text>
                        </View>

                        <View className="flex-row justify-between mb-4">
                            <View className="items-center flex-1">
                                <Text className="text-lg font-bold text-blue-600">{formatCurrency(budgetAmount)}</Text>
                                <Text className="text-xs text-gray-600">תקציב</Text>
                            </View>
                            <View className="items-center flex-1">
                                <Text className="text-lg font-bold text-red-600">{formatCurrency(categorySpent)}</Text>
                                <Text className="text-xs text-gray-600">הוצאות</Text>
                            </View>
                            <View className="items-center flex-1">
                                <Text className={`text-lg font-bold ${categorySpent <= budgetAmount ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(budgetAmount - categorySpent)}
                                </Text>
                                <Text className="text-xs text-gray-600">יתרה</Text>
                            </View>
                        </View>

                        <View className="flex-row justify-between items-center mb-3">
                            <Text className={`font-bold ${getStatusColor()}`}>{getStatusText()}</Text>
                            <Text className={`text-lg font-bold ${progressPercentage <= 90 ? 'text-green-600' : 'text-red-600'}`}>
                                {Math.min(progressPercentage, 100).toFixed(1)}%
                            </Text>
                        </View>

                        <ProgressBar
                            progress={progressBarPercentage}
                            color={getProgressColor(progressPercentage)}
                        />
                    </View>
                );
            })}
        </View>
    );
}
