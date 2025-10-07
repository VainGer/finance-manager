import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import LoadingSpinner from '../../../components/common/loadingSpinner';
import BusinessBreakdown from '../../../components/expenses/businessBreakdown';
import CategoryBreakdown from '../../../components/expenses/categoryBreakdown';
import Select from '../../../components/common/Select';
import useExpensesDisplay from '../../../hooks/expenses/useExpensesDisplay';
import ViewSelector from '../../../components/expenses/viewSelector';
import AIInsight from '../../../components/expenses/aiInsight';
import { formatAmount } from '../../../utils/formatters';

const MainStats = ({ summary }) => (
    <View className="flex-row flex-wrap mb-8">
        <View className="bg-blue-50 rounded-lg p-4 w-[48%] mr-[4%] mb-4">
            <Text className="text-3xl font-bold text-blue-600 text-center">
                {summary.transactionCount}
            </Text>
            <Text className="text-gray-600 text-center">עסקאות</Text>
        </View>

        <View className="bg-red-50 rounded-lg p-4 w-[48%] mb-4">
            <Text className="text-3xl font-bold text-red-600 text-center">
                {formatAmount(summary.totalAmount)}
            </Text>
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

export default function ExpenseSummary() {
    const [viewMode, setViewMode] = useState('category');
    const [selectedMonth, setSelectedMonth] = useState('all');

    const {
        isLoading: loading,
        error,
        allExpenses,
        monthlyExpenses,
        availableDates,
    } = useExpensesDisplay();


    const displayedExpenses = useMemo(() => {
        return selectedMonth === 'all'
            ? allExpenses
            : monthlyExpenses[selectedMonth] || [];
    }, [selectedMonth, allExpenses, monthlyExpenses]);

    const summary = useMemo(() => {
        const data = {
            transactionCount: displayedExpenses?.length || 0,
            totalAmount:
                displayedExpenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0,
            categoryTotals: {},
            businessTotals: {},
        };

        if (displayedExpenses?.length) {
            displayedExpenses.forEach((expense) => {
                const category = expense.category || 'ללא קטגוריה';
                const business = expense.business || 'ללא עסק';

                data.categoryTotals[category] =
                    (data.categoryTotals[category] || 0) + expense.amount;
                data.businessTotals[business] =
                    (data.businessTotals[business] || 0) + expense.amount;
            });
        }
        return data;
    }, [displayedExpenses]);

    const formattedMonths = useMemo(() => {
        return availableDates
            ? availableDates.map(({ year, month, dateYM }) => ({
                value: dateYM,
                label: `${month} ${year}`,
            }))
            : [];
    }, [availableDates]);


    if (loading) return <LoadingSpinner />;

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
                <Text className="text-2xl font-bold text-gray-800 mb-6">
                    📊 סיכום הוצאות
                </Text>
                <View className="items-center py-12">
                    <Text className="text-gray-400 text-5xl mb-4">📊</Text>
                    <Text className="text-xl font-semibold text-gray-600 mb-2">
                        אין הוצאות
                    </Text>
                    <Text className="text-gray-500">לא נמצאו עסקאות להצגה</Text>
                </View>
            </View>
        );
    }

    const viewOptions = [
        { value: 'category', label: '📈 לפי קטגוריות', activeStyle: 'primary' },
        { value: 'business', label: '🏪 לפי עסקים', activeStyle: 'success' },
        { value: 'ai', label: '🤖 תובנות AI', activeStyle: 'warning' },
    ];

    const ComponentToRender = (viewMode) => {
        switch (viewMode) {
            case 'category':
                return <CategoryBreakdown
                    categories={summary.categoryTotals}
                    totalAmount={summary.totalAmount}
                    formatAmount={formatAmount}
                />;
            case 'business':
                return <BusinessBreakdown
                    businesses={summary.businessTotals}
                    totalAmount={summary.totalAmount}
                    formatAmount={formatAmount}
                />;
            case 'ai':
                return <AIInsight />;
            default:
                return null;
        }
    }

    return (
        <ScrollView className="flex-1">
            {/* background shapes */}
            <View
                pointerEvents="none"
                className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-300/20"
            />
            <View
                pointerEvents="none"
                className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/20"
            />

            <Text className="text-2xl font-bold text-gray-800 my-8 text-center">
                📊 סיכום הוצאות
            </Text>

            <View className="bg-white rounded-lg shadow p-6 m-4">
                {/* Month selector */}
                {viewMode !== 'ai' &&
                    <View className="mb-4">
                        <Text className="text-sm font-medium text-gray-700 mb-2 text-right">
                            חודש
                        </Text>
                        <Select
                            items={[{ value: 'all', label: 'כל החודשים' }, ...formattedMonths]}
                            selectedValue={selectedMonth}
                            onSelect={setSelectedMonth}
                            placeholder="בחר חודש"
                            title="בחירת חודש"
                            iconName="calendar-outline"
                        />
                    </View>
                }
                {/* View Selector */}
                <ViewSelector
                    options={viewOptions}
                    selected={viewMode}
                    onSelect={setViewMode}
                />

                {/* Summary + breakdown */}
                {viewMode !== 'ai' && <MainStats summary={summary} />}
                {ComponentToRender(viewMode)}
            </View>
        </ScrollView>
    );
}
