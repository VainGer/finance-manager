import { View, Text } from "react-native";
import ProgressBar from "../../components/common/progressBar";


export default function BusinessBreakdown({ businesses, totalAmount, formatAmount }) {
    return (
        <View>
            <Text className="text-xl font-bold mb-4">🏪 הצגה לפי עסקים</Text>
            <View className="mb-4">
                {Object.entries(businesses)
                    .sort(([, a], [, b]) => b - a)
                    .map(([business, amount]) => {
                        const percentage = totalAmount > 0 ? (amount / totalAmount * 100).toFixed(1) : "0.0";
                        return (
                            <View key={business} className="bg-gray-50 rounded-lg p-4 mb-3">
                                <View className="flex-row justify-between items-center mb-2">
                                    <Text className="font-semibold">{business}</Text>
                                    <Text className="text-lg font-bold text-green-600">
                                        {formatAmount(amount)}
                                    </Text>
                                </View>
                                <ProgressBar
                                    progress={parseFloat(percentage)}
                                    color="bg-green-500"
                                />
                                <Text className="text-sm text-gray-600 mt-1">{percentage}%</Text>
                            </View>
                        );
                    })}
            </View>
        </View>
    );
}