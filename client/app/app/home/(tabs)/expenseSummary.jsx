import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import LoadingSpinner from '../../../components/common/loadingSpinner';
import ProgressBar from '../../../components/common/progressBar';
import Select from '../../../components/common/Select';
import useExpensesDisplay from '../../../hooks/expenses/useExpensesDisplay';
import { formatAmount } from '../../../utils/formatters';


const MainStats = ({ summary, formatAmount }) => (
    <View className="flex-row flex-wrap mb-8">
        <View className="bg-blue-50 rounded-lg p-4 w-[48%] mr-[4%] mb-4">
            <Text className="text-3xl font-bold text-blue-600 text-center">{summary.transactionCount}</Text>
            <Text className="text-gray-600 text-center">עסקאות</Text>
        </View>
        <View className="bg-red-50 rounded-lg p-4 w-[48%] mb-4">
            <Text className="text-3xl font-bold text-red-600 text-center">{formatAmount(summary.totalAmount)}</Text>
            <Text className="text-gray-600 text-center">סה"כ הוצאות</Text>
        </View>
        <View className="bg-green-50 rounded-lg p-4 w-[48%] mr-[4%]">
            <Text className="text-3xl font-bold text-green-600 text-center">
                {formatAmount(summary.totalAmount / (summary.transactionCount || 1))}
            </Text>
            <Text className="text-gray-600 text-center">ממוצע לעסקה</Text>
        </View>
        <View className="bg-purple-50 rounded-lg p-4 w-[48%]">
            <Text className="text-3xl font-bold text-purple-600 text-center">
                {Object.keys(summary.categoryTotals).length}
            </Text>
            <Text className="text-gray-600 text-center">קטגוריות</Text>
        </View>
    </View>
);


const CategoryBreakdown = ({ categories, totalAmount, formatAmount }) => (
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


const BusinessBreakdown = ({ businesses, totalAmount, formatAmount }) => (
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

export default function ExpenseSummary() {
    const [breakdownView, setBreakdownView] = useState('category');
    const [selectedMonth, setSelectedMonth] = useState('all');

    const {
        isLoading: loading,
        error,
        allExpenses,
        monthlyExpenses,
        availableDates,
    } = useExpensesDisplay();

    const displayedExpenses = useMemo(() => {
        if (selectedMonth === 'all') {
            return allExpenses;
        }
        return monthlyExpenses[selectedMonth] || [];
    }, [selectedMonth, allExpenses, monthlyExpenses]);

    const summary = useMemo(() => {
        const summaryData = {
            transactionCount: displayedExpenses?.length || 0,
            totalAmount: displayedExpenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0,
            categoryTotals: {},
            businessTotals: {}
        };

        if (displayedExpenses?.length) {
            displayedExpenses.forEach(expense => {
                const category = expense.category || 'ללא קטגוריה';
                const business = expense.business || 'ללא עסק';

                if (!summaryData.categoryTotals[category]) {
                    summaryData.categoryTotals[category] = 0;
                }
                summaryData.categoryTotals[category] += expense.amount;

                if (!summaryData.businessTotals[business]) {
                    summaryData.businessTotals[business] = 0;
                }
                summaryData.businessTotals[business] += expense.amount;
            });
        }
        return summaryData;
    }, [displayedExpenses]);

    const formattedMonths = useMemo(() => {
        return availableDates ? availableDates.map(({ year, month, dateYM }) => ({
            value: dateYM,
            label: `${month} ${year}`
        })) : [];
    }, [availableDates]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <View className="bg-white rounded-lg shadow p-6 m-4">
                <View className="items-center py-8">
                    <Text className="text-red-500 text-lg mb-2">❌ שגיאה</Text>
                    <Text className="text-gray-600">{error}</Text>
                </View>
            </View>
        );
    }

    if (!allExpenses || allExpenses.length === 0) {
        return (
            <View className="bg-white rounded-lg shadow p-6 m-4">
                <Text className="text-2xl font-bold text-gray-800 mb-6">📊 סיכום הוצאות</Text>
                <View className="items-center py-12">
                    <Text className="text-gray-400 text-5xl mb-4">📊</Text>
                    <Text className="text-xl font-semibold text-gray-600 mb-2">אין הוצאות</Text>
                    <Text className="text-gray-500">לא נמצאו עסקאות להצגה</Text>
                </View>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1">
            <View pointerEvents="none" className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-300/20" />
            <View pointerEvents="none" className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/20" />
            <Text className="text-2xl font-bold text-gray-800 my-8 text-center">📊 סיכום הוצאות</Text>
            <View className="bg-white rounded-lg shadow p-6 m-4">
                <View className="mb-6">

                    <View className="mb-4">
                        <Text className="text-sm font-medium text-gray-700 mb-2 text-right">
                            חודש
                        </Text>
                        <Select
                            items={[
                                { value: "all", label: "כל החודשים" },
                                ...formattedMonths
                            ]}
                            selectedValue={selectedMonth}
                            onSelect={setSelectedMonth}
                            placeholder="בחר חודש"
                            title="בחירת חודש"
                            iconName="calendar-outline"
                        />
                    </View>

                    <View className="flex-row mx-auto">
                        <Pressable
                            onPress={() => setBreakdownView('category')}
                            className={`px-4 py-2 rounded mr-2 ${breakdownView === 'category'
                                ? 'bg-blue-500'
                                : 'bg-gray-200'
                                }`}
                        >
                            <Text className={breakdownView === 'category' ? 'text-white' : 'text-gray-700'}>
                                📈 לפי קטגוריות
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setBreakdownView('business')}
                            className={`px-4 py-2 rounded ${breakdownView === 'business'
                                ? 'bg-green-500'
                                : 'bg-gray-200'
                                }`}
                        >
                            <Text className={breakdownView === 'business' ? 'text-white' : 'text-gray-700'}>
                                🏪 לפי עסקים
                            </Text>
                        </Pressable>
                    </View>
                </View>
                <MainStats summary={summary} formatAmount={formatAmount} />
                {breakdownView === 'category' ? (
                    <CategoryBreakdown
                        categories={summary.categoryTotals}
                        totalAmount={summary.totalAmount}
                        formatAmount={formatAmount}
                    />
                ) : (
                    <BusinessBreakdown
                        businesses={summary.businessTotals}
                        totalAmount={summary.totalAmount}
                        formatAmount={formatAmount}
                    />
                )}
            </View>
        </ScrollView>
    );
}