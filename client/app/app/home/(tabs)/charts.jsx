
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import LineChartComparison from '../../../components/charts/lineChartComparison';
import PieChartComponent from '../../../components/charts/pieChart';
import Button from '../../../components/common/button';
import LoadingSpinner from '../../../components/common/loadingSpinner';
import useExpensesCharts from '../../../hooks/expenses/useExpensesCharts';
import { formatAmount, formatYearMonth } from '../../../utils/formatters';
import Select from '../../../components/common/Select';
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
            <Text className="text-xl font-medium text-gray-700 mb-4 text-center">מסנן תאריך</Text>

            <View className="flex-row flex-wrap justify-center">
                {/* First row */}
                <View className="flex-row w-full justify-center mb-2">
                    <Button
                        onPress={() => {
                            setDateFilter('week');
                            setSelectedMonth('');
                        }}
                        style={dateFilter === 'week' ? 'primary' : 'secondary'}
                        className="flex-1 mx-1"
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
                        className="flex-1 mx-1"
                        textSize="sm"
                    >
                        חודש אחרון
                    </Button>
                </View>

                {/* Second row */}
                <View className="flex-row w-full justify-center">
                    <Button
                        onPress={() => {
                            setDateFilter('year');
                            setSelectedMonth('');
                        }}
                        style={dateFilter === 'year' ? 'primary' : 'secondary'}
                        className="flex-1 mx-1"
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
                        className="flex-1 mx-1"
                        textSize="sm"
                    >
                        הכל
                    </Button>
                </View>
            </View>

            {
                availableMonths && availableMonths.length > 0 && (
                    <View className="my-4">
                        <Text className="text-xl font-medium text-gray-700 mb-8 text-center">
                            לפי חודש
                        </Text>
                        <Select
                            items={availableMonths.map(month => {
                                const [year, monthNum] = month.split("-");
                                return {
                                    label: formatYearMonth(month),
                                    value: month
                                };
                            })}
                            selectedValue={selectedMonth}
                            onSelect={(value) => {
                                setSelectedMonth(value);
                                if (value) {
                                    setDateFilter("specific");
                                }
                            }}
                            placeholder="בחר חודש..."
                            title="בחר חודש"
                            iconName="calendar-outline"
                        />
                    </View>
                )
            }

        </View >
    );
};

const ChartTypeSelector = ({ chartType, setChartType }) => {
    return (
        <View className="mb-4">
            <Text className="text-xl font-medium text-gray-700 mb-4 text-center">סוג גרף</Text>
            <View className="flex-row flex-wrap mx-auto">
                <Button
                    onPress={() => setChartType('pie')}
                    style={chartType === 'pie' ? 'info' : 'secondary'}
                    className="mr-2 mb-2 w-auto"
                    size='small'
                >
                    🥧 פילוח לפי קטגוריות
                </Button>
                <Button
                    onPress={() => setChartType('line')}
                    style={chartType === 'line' ? 'info' : 'secondary'}
                    className="mr-2 mb-2 w-auto"
                    size='small'
                >
                    📈 מגמות חודשיות
                </Button>
            </View>
        </View>
    );
};

export default function Charts() {

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
        availableMonths
    } = useExpensesCharts();


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
        <ScrollView key={expenses ? expenses.length : 'no-expenses'} className="flex-1">
            <View pointerEvents="none" className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-300/20" />
            <View pointerEvents="none" className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/20" />
            <Text className="text-xl font-bold text-gray-800 my-8 text-center">📊 גרפים</Text>
            <View className="bg-white rounded-lg p-4 m-2">

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