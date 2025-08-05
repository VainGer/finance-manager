import { useState, useEffect } from "react";
import LoadingSpinner from "../../common/LoadingSpinner";
import ErrorMessage from "../../common/ErrorMessage";
import { get } from "../../../utils/api";

export default function InteractiveCharts({ profile }) {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateFilter, setDateFilter] = useState('all');
    const [displayMode, setDisplayMode] = useState('summary');

    useEffect(() => {
        fetchExpenses();
    }, [profile]);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const expensesId = profile?.expenses || profile?.profileId || '6888fada86dcf136e4141d5d';
            const response = await get(`expenses/profile-expenses/${expensesId}`);
            
            if (response.ok && response.expenses) {
                const expensesData = response.expenses;
                const parsedExpenses = [];
                
                for (const month in expensesData) {
                    const monthData = expensesData[month];
                    Object.entries(monthData).forEach(([category, transactions]) => {
                        if (Array.isArray(transactions)) {
                            transactions.forEach(transaction => {
                                parsedExpenses.push({
                                    ...transaction,
                                    category,
                                    month,
                                    date: transaction.date || new Date().toISOString()
                                });
                            });
                        }
                    });
                }
                
                setExpenses(parsedExpenses);
            } else {
                setError('לא ניתן לטעון נתוני הוצאות');
            }
        } catch (err) {
            console.error('Error fetching expenses:', err);
            setError('שגיאה בטעינת נתוני הוצאות');
        } finally {
            setLoading(false);
        }
    };

    const filterExpensesByDate = (expenses, filter) => {
        if (filter === 'all') return expenses;
        
        const now = new Date();
        const cutoffDate = new Date();
        
        switch (filter) {
            case 'week':
                cutoffDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                cutoffDate.setMonth(now.getMonth() - 1);
                break;
            case 'quarter':
                cutoffDate.setMonth(now.getMonth() - 3);
                break;
            case 'year':
                cutoffDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                return expenses;
        }
        
        return expenses.filter(expense => new Date(expense.date) >= cutoffDate);
    };

    const getExpenseData = () => {
        const filteredExpenses = filterExpensesByDate(expenses, dateFilter);
        
        // Group by category
        const categoryData = {};
        filteredExpenses.forEach(expense => {
            const category = expense.category || 'ללא קטגוריה';
            if (!categoryData[category]) {
                categoryData[category] = 0;
            }
            categoryData[category] += expense.amount;
        });

        return categoryData;
    };

    const getSummaryStats = () => {
        const filteredExpenses = filterExpensesByDate(expenses, dateFilter);
        const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const average = filteredExpenses.length > 0 ? total / filteredExpenses.length : 0;
        const categoryCount = new Set(filteredExpenses.map(e => e.category)).size;

        return { total, average, categoryCount, transactionCount: filteredExpenses.length };
    };

    const getMonthlyTrends = () => {
        const filteredExpenses = filterExpensesByDate(expenses, dateFilter);
        const monthlyData = {};
        
        filteredExpenses.forEach(expense => {
            const date = new Date(expense.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = 0;
            }
            monthlyData[monthKey] += expense.amount;
        });

        return monthlyData;
    };

    const renderPieChart = () => {
        const categoryData = getExpenseData();
        const total = Object.values(categoryData).reduce((sum, val) => sum + val, 0);
        
        if (total === 0) {
            return (
                <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">📊</div>
                    <div className="text-gray-600">אין נתונים להצגה</div>
                </div>
            );
        }

        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
        
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center mb-4">התפלגות הוצאות לפי קטגוריה</h3>
                
                {/* Simple visual representation */}
                <div className="space-y-3">
                    {Object.entries(categoryData).map(([category, amount], index) => {
                        const percentage = ((amount / total) * 100).toFixed(1);
                        const color = colors[index % colors.length];
                        
                        return (
                            <div key={category} className="flex items-center space-x-3 rtl:space-x-reverse">
                                <div 
                                    className="w-4 h-4 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: color }}
                                ></div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-900 truncate">
                                            {category}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {percentage}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="h-2 rounded-full"
                                            style={{ 
                                                width: `${percentage}%`, 
                                                backgroundColor: color 
                                            }}
                                        ></div>
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">
                                        ₪{amount.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderBarChart = () => {
        const monthlyData = getMonthlyTrends();
        const maxAmount = Math.max(...Object.values(monthlyData));
        
        if (maxAmount === 0) {
            return (
                <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">📈</div>
                    <div className="text-gray-600">אין נתונים להצגה</div>
                </div>
            );
        }

        const colors = ['#36A2EB', '#4BC0C0', '#FFCE56', '#FF6384', '#9966FF', '#FF9F40'];
        
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center mb-4">מגמות הוצאות חודשיות</h3>
                
                <div className="flex items-end justify-center space-x-2 rtl:space-x-reverse h-48">
                    {Object.entries(monthlyData).map(([month, amount], index) => {
                        const height = (amount / maxAmount) * 100;
                        const color = colors[index % colors.length];
                        
                        return (
                            <div key={month} className="flex flex-col items-center">
                                <div 
                                    className="w-12 rounded-t transition-all duration-300 hover:opacity-80"
                                    style={{ 
                                        height: `${height}%`, 
                                        backgroundColor: color,
                                        minHeight: '8px'
                                    }}
                                    title={`${month}: ₪${amount.toLocaleString()}`}
                                ></div>
                                <div className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-left">
                                    {month}
                                </div>
                                <div className="text-xs text-gray-800 font-medium mt-1">
                                    ₪{amount.toLocaleString()}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderTableView = () => {
        const categoryData = getExpenseData();
        const total = Object.values(categoryData).reduce((sum, val) => sum + val, 0);
        
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center mb-4">נתוני הוצאות מפורטים</h3>
                
                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    קטגוריה
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    סכום (₪)
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    אחוז
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {Object.entries(categoryData).map(([category, amount]) => {
                                const percentage = total > 0 ? ((amount / total) * 100).toFixed(1) : '0.0';
                                
                                return (
                                    <tr key={category} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ₪{amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {percentage}%
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    const summaryStats = getSummaryStats();

    return (
        <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800">דוחות ותצוגות אינטראקטיביות</h2>
                
                {/* Display Mode Selector */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setDisplayMode('summary')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            displayMode === 'summary' ? 'bg-indigo-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                        📊 תצוגת עמודות
                    </button>
                    <button
                        onClick={() => setDisplayMode('pie')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            displayMode === 'pie' ? 'bg-indigo-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                        🥧 התפלגות
                    </button>
                    <button
                        onClick={() => setDisplayMode('table')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            displayMode === 'table' ? 'bg-indigo-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                        📋 טבלה
                    </button>
                </div>
            </div>
            
            {/* Date Filter */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setDateFilter('week')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                        dateFilter === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                >
                    שבוע אחרון
                </button>
                <button
                    onClick={() => setDateFilter('month')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                        dateFilter === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                >
                    חודש אחרון
                </button>
                <button
                    onClick={() => setDateFilter('quarter')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                        dateFilter === 'quarter' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                >
                    רבעון אחרון
                </button>
                <button
                    onClick={() => setDateFilter('year')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                        dateFilter === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                >
                    שנה אחרונה
                </button>
                <button
                    onClick={() => setDateFilter('all')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                        dateFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                >
                    הכל
                </button>
            </div>

            {/* Chart Display */}
            <div className="mb-6">
                <div className="bg-gray-50 p-6 rounded-lg min-h-96">
                    {expenses.length > 0 ? (
                        displayMode === 'summary' ? renderBarChart() :
                        displayMode === 'pie' ? renderPieChart() :
                        renderTableView()
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="text-gray-400 text-6xl mb-4">📈</div>
                                <div className="text-xl font-semibold text-gray-600 mb-2">אין נתונים להצגה</div>
                                <div className="text-gray-500">הוסף הוצאות כדי לראות דוחות</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-600">סך הכל הוצאות</h3>
                    <p className="text-2xl font-bold text-blue-800">₪{summaryStats.total.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-green-600">ממוצע לעסקה</h3>
                    <p className="text-2xl font-bold text-green-800">₪{Math.round(summaryStats.average).toLocaleString()}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-purple-600">מספר קטגוריות</h3>
                    <p className="text-2xl font-bold text-purple-800">{summaryStats.categoryCount}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-orange-600">מספר עסקאות</h3>
                    <p className="text-2xl font-bold text-orange-800">{summaryStats.transactionCount}</p>
                </div>
            </div>
        </div>
    );
}
