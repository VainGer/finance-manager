import useExpensesDisplay from '../../../../hooks/useExpensesDisplay';
import LoadingSpinner from '../../../common/LoadingSpinner';
import ErrorMessage from '../../../common/ErrorMessage';
import ExpensesTable from './ExpensesTable';
import Filters from './Filters';
import ExpensesSummary from './ExpensesSummary';

export default function ExpensesDisplay({ profile }) {

    const { expenses, filteredExpenses, loading, error, filters,
        setFilters, categories, businesses, refetchExpenses } = useExpensesDisplay(profile);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-center py-8">
                    <div className="text-red-500 text-lg mb-2">❌ שגיאה</div>
                    <div className="text-gray-600">{error}</div>
                </div>
            </div>
        );
    }

    if (expenses && expenses.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">💰 הוצאות</h2>
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">💰</div>
                    <div className="text-xl font-semibold text-gray-600 mb-2">אין הוצאות</div>
                    <div className="text-gray-500">לא נמצאו עסקאות להצגה</div>
                </div>
            </div>
        );
    }



    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">💰 הוצאות</h2>
            </div>
            <Filters filters={filters} setFilters={setFilters} categories={categories} businesses={businesses} />
            <ExpensesSummary filteredExpenses={filteredExpenses} />
            <ExpensesTable filteredExpenses={filteredExpenses} expensesId={profile.expenses} onTransactionDeleted={refetchExpenses} />
        </div>
    );
}
