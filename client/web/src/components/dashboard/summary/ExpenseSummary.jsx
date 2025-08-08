import { useState } from 'react';
import { formatAmount } from '../../../utils/expensesUtils';
import LoadingSpinner from '../../common/LoadingSpinner';
import useExpensesDisplay from '../../../hooks/useExpensesDisplay';

export default function ExpenseSummary({ profile }) {
    const [breakdownView, setBreakdownView] = useState('category');

    const {
        filteredExpenses,
        loading,
        error,
        dateRange,
        setDateRange,
        showDateFilter,
        setShowDateFilter,
        resetDateFilter,
        summary,
        expenses
    } = useExpensesDisplay(profile);

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

    if (expenses.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 סיכום הוצאות</h2>

                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📊</div>
                    <div className="text-xl font-semibold text-gray-600 mb-2">אין הוצאות</div>
                    <div className="text-gray-500">לא נמצאו עסקאות להצגה</div>
                </div>
            </div>
        );
    }

    const Header = () => {
        return (
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">📊 סיכום הוצאות</h2>

                    {/* Breakdown Toggle Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setBreakdownView('category')}
                            className={`px-4 py-2 rounded transition-colors ${breakdownView === 'category'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            📈 הצגה לפי קטגוריות
                        </button>
                        <button
                            onClick={() => setBreakdownView('business')}
                            className={`px-4 py-2 rounded transition-colors ${breakdownView === 'business'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            🏪 הצגה לפי עסקים
                        </button>
                    </div>
                </div>
                <DateFilters />
            </div>
        );
    }

    const DateFilters = () => {
        return (
            <div className="w-full">
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => setShowDateFilter(!showDateFilter)}
                        className="text-blue-500 flex items-center gap-1 hover:underline mb-2"
                    >
                        {showDateFilter ? '🔽 הסתר סינון לפי תאריכים' : '🔼 הצג סינון לפי תאריכים'}
                    </button>

                    {dateRange.startDate && dateRange.endDate && (
                        <div className="text-sm text-gray-500">
                            מציג נתונים מתאריך {dateRange.startDate} עד {dateRange.endDate}
                        </div>
                    )}
                </div>

                {showDateFilter && (
                    <div className="flex flex-col md:flex-row gap-3 p-4 bg-gray-50 rounded-lg">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="startDate" className="text-sm font-medium text-gray-700">מתאריך:</label>
                            <input
                                type="date"
                                id="startDate"
                                value={dateRange.startDate || ''}
                                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="endDate" className="text-sm font-medium text-gray-700">עד תאריך:</label>
                            <input
                                type="date"
                                id="endDate"
                                value={dateRange.endDate || ''}
                                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={resetDateFilter}
                                className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded"
                            >
                                אפס סינון
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (summary.transactionCount === 0) {
        return (<>
            <Header />
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">לא נמצאו עסקאות בתאריכים שנבחרו</h2>

                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📊</div>
                    <div className="text-xl font-semibold text-gray-600 mb-2">אין הוצאות</div>
                    <div className="text-gray-500">לא נמצאו עסקאות להצגה</div>
                </div>
            </div>
        </>
        );
    }

    const MainStats = () => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-blue-600">{summary.transactionCount}</div>
                    <div className="text-gray-600">עסקאות</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-red-600">{formatAmount(summary.totalAmount)}</div>
                    <div className="text-gray-600">סה"כ הוצאות</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-600">
                        {formatAmount(summary.transactionCount ? parseInt(summary.totalAmount / summary.transactionCount) : 0)}
                    </div>
                    <div className="text-gray-600">ממוצע לעסקה</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-purple-600">
                        {Object.keys(summary.categoryTotals).length}
                    </div>
                    <div className="text-gray-600">קטגוריות</div>
                </div>
            </div>
        );
    }

    const CategoryBreakdown = () => {
        return (
            <div>
                <h3 className="text-xl font-bold mb-4">📈 הצגה לפי קטגוריות</h3>
                <div className="space-y-3">
                    {Object.entries(summary.categoryTotals)
                        .sort(([, a], [, b]) => b - a)
                        .map(([category, amount]) => {
                            const percentage = (amount / summary.totalAmount * 100).toFixed(1);
                            return (
                                <div key={category} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold">{category}</span>
                                        <span className="text-lg font-bold text-blue-600">
                                            {formatAmount(amount)}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">{percentage}%</div>
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    }

    const BusinessBreakdown = () => {
        return (
            <div>
                <h3 className="text-xl font-bold mb-4">🏪 הצגה לפי עסקים</h3>
                <div className="space-y-3">
                    {Object.entries(summary.businessTotals)
                        .sort(([, a], [, b]) => b - a)
                        .map(([business, amount]) => {
                            const percentage = (amount / summary.totalAmount * 100).toFixed(1);
                            return (
                                <div key={business} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold">{business}</span>
                                        <span className="text-lg font-bold text-green-600">
                                            {formatAmount(amount)}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">{percentage}%</div>
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Header */}

            <Header />

            {/* Summary Stats */}
            <MainStats />
            {/* Single Breakdown Display */}
            <div>
                {breakdownView === 'category' && <CategoryBreakdown />}
                {breakdownView === 'business' && <BusinessBreakdown />}
            </div>
        </div>
    );
}
