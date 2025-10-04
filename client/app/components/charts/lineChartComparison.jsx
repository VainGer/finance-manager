import { Dimensions, ScrollView, Text, View } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import { formatAmount } from '../../utils/formatters';

export default function LineChartComparison({ monthlyData }) {
    const screenWidth = Dimensions.get('window').width - 40;

    if (!monthlyData || monthlyData.length === 0) {
        return (
            <View className="bg-white rounded-lg p-4 m-2">
                <View className="items-center py-8">
                    <Text className="text-gray-400 text-5xl mb-4">📈</Text>
                    <Text className="text-xl font-semibold text-gray-600 mb-2">אין נתונים להשוואה</Text>
                    <Text className="text-gray-500">הוסף הוצאות במספר חודשים כדי לראות השוואה</Text>
                </View>
            </View>
        );
    }

    const sortedData = Array.isArray(monthlyData) ? 
        [...monthlyData]
            .filter(item => item && item.month && item.month.includes('/'))
            .sort((a, b) => {
                try {
                    const [monthA, yearA] = a.month.split('/');
                    const [monthB, yearB] = b.month.split('/');
                    
                    if (!monthA || !yearA || !monthB || !yearB) {
                        return 0;
                    }
                    
                    return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
                } catch (err) {
                    console.error('Error sorting chart data:', err);
                    return 0;
                }
            }) : [];


    const recentMonths = sortedData.length > 0 ? sortedData.slice(-Math.min(6, sortedData.length)) : [];

    const formatMonthLabel = (monthStr) => {
        if (!monthStr || typeof monthStr !== 'string') {
            return ''; 
        }
        
        try {
            const [month, year] = monthStr.split('/');
            if (!month || !year || year.length < 2) {
                return monthStr;
            }
            return `${month}/${year.slice(2)}`;
        } catch (err) {
            console.error('Error formatting month label:', err);
            return monthStr || '';
        }
    };

    const chartData = {
        labels: recentMonths.map(item => formatMonthLabel(item?.month || '')),
        datasets: [
            {
                data: recentMonths.map(item => 
                    item && typeof item.amount === 'number' ? 
                    item.amount : 0
                ),
                color: (opacity = 1) => `rgba(65, 105, 225, ${opacity})`, // Royal blue
                strokeWidth: 2
            }
        ],
        legend: ["הוצאות חודשיות"]
    };

    const chartConfig = {
        backgroundColor: "#fff",
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: "#4169E1"
        },
        propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: "rgba(180, 180, 180, 0.3)"
        },
        formatYLabel: (value) => `₪${Math.round(Number(value) / 100)}k`
    };

    const maxMonth = recentMonths.length > 0 ?
        recentMonths.reduce(
            (max, item) => 
                (item && typeof item.amount === 'number' && item.amount > max.amount) ? 
                item : max,
            recentMonths[0] || { month: '', amount: 0 }
        ) : { month: '', amount: 0 };

    const minMonth = recentMonths.length > 0 ?
        recentMonths.reduce(
            (min, item) => 
                (item && typeof item.amount === 'number' && item.amount < min.amount) ? 
                item : min,
            recentMonths[0] || { month: '', amount: 0 }
        ) : { month: '', amount: 0 };

    return (
        <ScrollView>
            <View className="bg-white rounded-lg p-4">
                <Text className="text-lg font-bold text-center mb-2">
                    השוואת הוצאות חודשית
                </Text>
                <Text className="text-center text-sm text-gray-600 mb-6">
                    מציג {recentMonths.length} חודשים אחרונים
                </Text>

                <LineChart
                    data={chartData}
                    width={screenWidth}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />

                <View className="flex-row justify-between mt-4 mb-2">
                    <View className="bg-blue-50 rounded-lg p-3 flex-1 mr-2">
                        <Text className="text-sm text-gray-600 mb-1">חודש עם הוצאה מקסימלית</Text>
                        <Text className="text-md font-bold text-blue-600">
                            {formatMonthLabel(maxMonth.month)}
                        </Text>
                        <Text className="text-md font-bold text-blue-600">
                            {formatAmount(maxMonth.amount)}
                        </Text>
                    </View>

                    <View className="bg-blue-50 rounded-lg p-3 flex-1 ml-2">
                        <Text className="text-sm text-gray-600 mb-1">חודש עם הוצאה מינימלית</Text>
                        <Text className="text-md font-bold text-blue-600">
                            {formatMonthLabel(minMonth.month)}
                        </Text>
                        <Text className="text-md font-bold text-blue-600">
                            {formatAmount(minMonth.amount)}
                        </Text>
                    </View>
                </View>

                <View className="mt-6">
                    <Text className="font-semibold mb-2">פירוט חודשי:</Text>
                    <View className="border border-gray-200 rounded-lg">
                        <View className="flex-row bg-gray-100 p-3">
                            <Text className="font-bold flex-1">חודש</Text>
                            <Text className="font-bold">סכום</Text>
                        </View>
                        {recentMonths.map((item, index) => (
                            <View
                                key={index}
                                className={`flex-row justify-between p-3 items-center ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                    }`}
                            >
                                <Text>{item.month}</Text>
                                <Text className="font-medium">{formatAmount(item.amount)}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}