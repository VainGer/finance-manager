import { ScrollView, Text, View } from 'react-native';
import LoadingSpinner from '../../../components/common/loadingSpinner';
import ExpensesTable from '../../../components/expenses/expensesTable';
import Filter from '../../../components/expenses/filter';
import { useAuth } from '../../../context/AuthContext';
import useExpensesDisplay from '../../../hooks/expenses/useExpensesDisplay';
import { formatAmount } from '../../../utils/formatters';

const TransactionsSummary = ({ filteredExpenses }) => {

    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return (
        <View className="bg-blue-50 rounded-lg p-4 mb-6">
            <View className="flex-row">

                <View className="flex-1 items-center border-r-2 border-gray-300">
                    <Text className="text-2xl font-bold text-blue-600">{filteredExpenses.length}</Text>
                    <Text className="text-sm text-gray-600">עסקאות מוצגות</Text>
                </View>

                <View className="flex-1 items-center border-r-2 border-gray-300">
                    <Text className="text-2xl font-bold text-red-600">{formatAmount(totalAmount)}</Text>
                    <Text className="text-sm text-gray-600">סה"כ הוצאות</Text>
                </View>

                <View className="flex-1 items-center">
                    <Text className="text-2xl font-bold text-green-600">
                        {filteredExpenses.length > 0 ? formatAmount(totalAmount / filteredExpenses.length) : formatAmount(0)}
                    </Text>
                    <Text className="text-sm text-gray-600">ממוצע לעסקה</Text>
                </View>
            </View>
        </View>
    );
};

export default function ExpensesDisplay() {
    const { profile } = useAuth();
    const {
        expenses,
        filteredExpenses,
        loading,
        error,
        filters,
        setFilters,
        categories,
        businesses,
        refetchExpenses
    } = useExpensesDisplay(profile);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <View className="bg-white rounded-lg shadow-lg p-6 m-4">
                <View className="items-center py-8">
                    <Text className="text-red-500 text-lg mb-2">❌ שגיאה</Text>
                    <Text className="text-gray-600">{error}</Text>
                </View>
            </View>
        );
    }

    if (expenses && expenses.length === 0) {
        return (
            <View className="bg-white rounded-lg shadow-lg p-6 m-4">
                <Text className="text-2xl font-bold text-gray-800 mb-6">💰 הוצאות</Text>
                <View className="items-center py-12">
                    <Text className="text-gray-400 text-5xl mb-4">💰</Text>
                    <Text className="text-xl font-semibold text-gray-600 mb-2">אין הוצאות</Text>
                    <Text className="text-gray-500">לא נמצאו עסקאות להצגה</Text>
                </View>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1">
            <View className="bg-white rounded-lg shadow-lg p-6 m-4">
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-2xl font-bold text-gray-800">💰 הוצאות</Text>
                </View>

                <Filter
                    filters={filters}
                    setFilters={setFilters}
                    categories={categories}
                    businesses={businesses}
                />

                <TransactionsSummary
                    filteredExpenses={filteredExpenses}
                />

                <ExpensesTable
                    filteredExpenses={filteredExpenses}
                    refetchExpenses={refetchExpenses}
                    profile={profile}
                />
            </View>
        </ScrollView>
    );
}
