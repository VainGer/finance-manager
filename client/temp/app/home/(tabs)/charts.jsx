import { Picker } from '@react-native-picker/picker';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, Text, View } from 'react-native';
import LineChartComparison from '../../../components/charts/lineChartComparison';
import PieChartComponent from '../../../components/charts/pieChart';
import Button from '../../../components/common/button';
import LoadingSpinner from '../../../components/common/loadingSpinner';
import { useAuth } from '../../../context/AuthContext';
import useExpensesCharts from '../../../hooks/expenses/useExpensesCharts';
import { formatAmount } from '../../../utils/formatters';

const ExpensesDetails = ({ data }) => {
    return (<View className="mt-8">
        <Text className="text-md font-semibold mb-2">פירוט הוצאות:</Text>
        <View className="border-t border-gray-200">
            {data.map((item, index) => (
                <View key={index} className="flex-row justify-between py-2 border-b border-gray-100">
                    <View className="flex-row items-center">
                        <View className="w-8 h-8 rounded-full mr-2"
                            style={{ backgroundColor: item.color, }}
                        />
                        <Text className="ml-2">{item.name}</Text>
                    </View>
                    <Text className="font-medium">{formatAmount(item.population)}</Text>
                </View>
            ))}
        </View>
    </View>)
}

const DateFilterButtons = ({ dateFilter, setDateFilter, selectedMonth, setSelectedMonth, availableMonths }) => {
    return (
        <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">מסנן תאריך:</Text>
            <View className="flex-row flex-wrap">
                <Button
                    onPress={() => {
                        setDateFilter('week');
                        setSelectedMonth('');
                    }}
                    style={dateFilter === 'week' ? 'primary' : 'secondary'}
                    size="small"
                    className="mr-2 w-auto"
                    textSize="sm"
                >
                    שבוע אחרון
                </Button>
                <Button
                    onPress={() => {
                        setDateFilter('month');
                        setSelectedMonth('');
                    }}
                    style={dateFilter === 'month' ? 'primary' : 'secondary'}
                    size="small"
                    className="mr-2 w-auto"
                    textSize="sm"
                >
                    חודש אחרון
                </Button>
                <Button
                    onPress={() => {
                        setDateFilter('year');
                        setSelectedMonth('');
                    }}
                    style={dateFilter === 'year' ? 'primary' : 'secondary'}
                    size="small"
                    className="mr-2 w-auto"
                    textSize="sm"
                >
                    שנה אחרונה
                </Button>
                <Button
                    onPress={() => {
                        setDateFilter('all');
                        setSelectedMonth('');
                    }}
                    style={dateFilter === 'all' ? 'primary' : 'secondary'}
                    size="small"
                    className="mr-2 w-auto"
                    textSize="sm"
                >
                    הכל
                </Button>
            </View>

            {availableMonths && availableMonths.length > 0 && (
                <View className="mt-3 flex-row items-center">
                    <Text className="text-sm font-medium text-gray-700 mr-2">חודש ספציפי:</Text>
                    <View className="flex-1 border border-gray-300 rounded">
                        <Picker
                            selectedValue={selectedMonth}
                            onValueChange={(value) => {
                                setSelectedMonth(value);
                                if (value) {
                                    setDateFilter('specific');
                                }
                            }}
                        >
                            <Picker.Item label="בחר חודש..." value="" />
                            {availableMonths.map(month => {
                                const [year, monthNum] = month.split('-');
                                const monthDate = new Date(year, parseInt(monthNum) - 1);
                                const monthName = monthDate.toLocaleDateString('he-IL', {
                                    year: 'numeric',
                                    month: 'long'
                                });

                                return (
                                    <Picker.Item
                                        key={month}
                                        label={monthName}
                                        value={month}
                                    />
                                );
                            })}
                        </Picker>
                    </View>
                </View>
            )}
        </View>
    );
};

const ChartTypeSelector = ({ chartType, setChartType }) => {
    return (
        <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">סוג גרף:</Text>
            <View className="flex-row flex-wrap">
                <Button
                    onPress={() => setChartType('pie')}
                    style={chartType === 'pie' ? 'info' : 'secondary'}
                    size="small"
                    className="mr-2 mb-2 w-auto"
                    textSize="sm"
                >
                    🥧 עוגה
                </Button>
                <Button
                    onPress={() => setChartType('line')}
                    style={chartType === 'line' ? 'info' : 'secondary'}
                    size="small"
                    className="mr-2 mb-2 w-auto"
                    textSize="sm"
                >
                    📈 מגמות חודשיות
                </Button>
            </View>
        </View>
    );
};

export default function Graphs() {
    const { profile } = useAuth();
    const [chartType, setChartType] = useState('pie');

    const {
        expenses,
        loading,
        error,
        chartData,
        totalAmount,
        monthlyChartData,
        dateFilter,
        setDateFilter,
        selectedMonth,
        setSelectedMonth,
        availableMonths,
        refetchExpenses
    } = useExpensesCharts({ profile });

    useFocusEffect(
        useCallback(() => {
            refetchExpenses();
            return () => {
            };
        }, [])
    );

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <View className="bg-white rounded-lg p-4 m-2">
                <Text className="text-red-500 text-center">שגיאה בטעינת נתונים</Text>
                <Text className="text-gray-500 text-center">{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView key={expenses.length} className="flex-1">
            <View className="bg-white rounded-lg p-4 m-2">
                <Text className="text-2xl font-bold text-gray-800 mb-4">📊 גרפים</Text>

                <ChartTypeSelector
                    chartType={chartType}
                    setChartType={setChartType}
                />

                {chartType !== 'line' && (
                    <DateFilterButtons
                        dateFilter={dateFilter}
                        setDateFilter={setDateFilter}
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                        availableMonths={availableMonths || []}
                    />
                )}

                {chartType === 'pie' ? (
                    <PieChartComponent data={chartData} totalAmount={totalAmount} />
                ) : chartType === 'line' ? (
                    <LineChartComparison monthlyData={monthlyChartData} />
                ) : null}

                {chartType === 'pie' && <ExpensesDetails data={chartData} />}
            </View>
        </ScrollView>
    );
}