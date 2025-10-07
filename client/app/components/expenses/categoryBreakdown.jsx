import { View, Text } from "react-native";
import ProgressBar from "../../components/common/progressBar";


export default function CategoryBreakdown({ categories, totalAmount, formatAmount }) {
    return (
        <View>
            <Text className="text-xl font-bold mb-4">📈 הצגה לפי קטגוריות</Text>
            <View className="mb-4">
                {Object.entries(categories)
                    .sort(([, a], [, b]) => b - a)
                    .map(([category, amount]) => {
                        const percentage = totalAmount > 0 ? (amount / totalAmount * 100).toFixed(1) : "0.0";
                        return (
                            <View key={category} className="bg-gray-50 rounded-lg p-4 mb-3">
                                <View className="flex-row justify-between items-center mb-2">
                                    <Text className="font-semibold">{category}</Text>
                                    <Text className="text-lg font-bold text-blue-600">
                                        {formatAmount(amount)}
                                    </Text>
                                </View>
                                <ProgressBar
                                    progress={parseFloat(percentage)}
                                    color="bg-blue-500"
                                />
                                <Text className="text-sm text-gray-600 mt-1">{percentage}%</Text>
                            </View>
                        );
                    })}
            </View>
        </View>
    );
}