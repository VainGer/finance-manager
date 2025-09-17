import { Dimensions, ScrollView, Text, View } from 'react-native';
import { PieChart } from "react-native-chart-kit";
import { formatAmount } from '../../utils/formatters';

export default function PieChartComponent({ data, totalAmount }) {

    const screenWidth = Dimensions.get('window').width - 60;

    if (!data || data.length === 0) {
        return (
            <View className="bg-white rounded-lg p-4 m-2">
                <View className="items-center py-8">
                    <Text className="text-gray-400 text-5xl mb-4">📊</Text>
                    <Text className="text-xl font-semibold text-gray-600 mb-2">אין נתונים להצגה</Text>
                    <Text className="text-gray-500">הוסף הוצאות כדי לראות גרפים</Text>
                </View>
            </View>
        );
    }

    const chartConfig = {
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    };

    return (
        <ScrollView>
            <View className="bg-white rounded-lg p-4 m-2">
                <Text className="text-lg font-bold text-center mb-4">
                    התפלגות הוצאות לפי קטגוריה
                </Text>
                <Text className="text-center text-sm text-gray-600 mb-4">
                    סה"כ: {formatAmount(totalAmount)}
                </Text>
                <PieChart
                    data={data}
                    width={screenWidth}
                    height={220}
                    chartConfig={chartConfig}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                />
            </View>
        </ScrollView>
    );
}