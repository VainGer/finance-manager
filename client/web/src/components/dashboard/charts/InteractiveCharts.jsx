import { useState, useEffect } from "react";
import LoadingSpinner from "../../common/LoadingSpinner";
import ErrorMessage from "../../common/ErrorMessage";
import { get } from "../../../utils/api";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

// Recharts Implementation - Clean and Simple
export default function InteractiveCharts({ profile, refreshTrigger }) {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateFilter, setDateFilter] = useState('all');
    const [chartType, setChartType] = useState('pie');
    const [selectedMonth, setSelectedMonth] = useState('');

    useEffect(() => {
        fetchExpenses();
    }, [profile, refreshTrigger]);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            setError(null);

            const expensesId = profile.expenses;
            const response = await get(`expenses/profile-expenses/${expensesId}`);

            if (response.ok && response.expenses) {
                const expensesData = response.expenses;
                const parsedExpenses = [];

                if (expensesData.categories) {
                    expensesData.categories.forEach(category => {
                        if (category.Businesses) {
                            category.Businesses.forEach(business => {
                                if (business.transactions) {
                                    business.transactions.forEach(transaction => {
                                        parsedExpenses.push({
                                            _id: transaction._id,
                                            amount: Number(transaction.amount),
                                            date: transaction.date,
                                            description: transaction.description,
                                            category: category.name,
                                            business: business.name
                                        });
                                    });
                                }
                            });
                        }
                    });
                }

                setExpenses(parsedExpenses);
            } else {
                setError(response.message || 'שגיאה בטעינת הנתונים');
            }
        } catch (err) {
            console.error('Error fetching expenses:', err);
            setError('שגיאה בחיבור למסד הנתונים');
        } finally {
            setLoading(false);
        }
    };

    const filterExpensesByDate = (expenses, filter) => {
        if (filter === 'all') return expenses;

        const now = new Date();

        if (filter === 'specific' && selectedMonth) {
            const [year, month] = selectedMonth.split('-');
            const filtered = expenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getFullYear() === parseInt(year) &&
                    expenseDate.getMonth() === parseInt(month) - 1;
            });
            return filtered;
        }

        const cutoffDate = new Date();

        switch (filter) {
            case 'week':
                cutoffDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                cutoffDate.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                cutoffDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                return expenses;
        }

        const filtered = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            const isAfterCutoff = expenseDate >= cutoffDate;
            const isBeforeNow = expenseDate <= now;
            return isAfterCutoff && isBeforeNow;
        });

        return filtered;
    };

    const getAvailableMonths = () => {
        const months = new Set();
        expenses.forEach(expense => {
            const date = new Date(expense.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            months.add(monthKey);
        });
        return Array.from(months).sort().reverse(); // Most recent first
    };

    const renderChart = () => {
        const filteredExpenses = filterExpensesByDate(expenses, dateFilter);

        if (filteredExpenses.length === 0) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="text-gray-400 text-6xl mb-4">📈</div>
                        <div className="text-xl font-semibold text-gray-600 mb-2">אין נתונים להצגה</div>
                        <div className="text-gray-500">הוסף הוצאות כדי לראות גרפים</div>
                    </div>
                </div>
            );
        }

        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

        if (chartType === 'pie') {
            // Group by category
            const categoryData = {};
            filteredExpenses.forEach(expense => {
                const category = expense.category || 'ללא קטגוריה';
                if (!categoryData[category]) {
                    categoryData[category] = 0;
                }
                categoryData[category] += expense.amount;
            });

            const chartData = Object.entries(categoryData).map(([name, value], index) => ({
                name,
                value,
                color: colors[index % colors.length]
            }));

            return (
                <div className="w-full h-96">
                    <h3 className="text-lg font-semibold text-center mb-2">התפלגות הוצאות לפי קטגוריה</h3>
                    <p className="text-center text-sm text-gray-600 mb-4">
                        מציג {filteredExpenses.length} מתוך {expenses.length} הוצאות
                    </p>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                animationBegin={0}
                                animationDuration={800}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value, name) => [`₪${value.toLocaleString()}`, name]}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    direction: 'rtl'
                                }}
                            />
                            <Legend
                                wrapperStyle={{ direction: 'rtl' }}
                                formatter={(value) => `${value}`}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            );
        }

        if (chartType === 'bar') {
            const categoryData = {};
            filteredExpenses.forEach(expense => {
                const category = expense.category || 'ללא קטגוריה';
                if (!categoryData[category]) {
                    categoryData[category] = 0;
                }
                categoryData[category] += expense.amount;
            });

            const chartData = Object.entries(categoryData).map(([name, value], index) => ({
                name,
                value,
                color: colors[index % colors.length]
            }));

            return (
                <div className="w-full h-96">
                    <h3 className="text-lg font-semibold text-center mb-2">התפלגות הוצאות לפי קטגוריה</h3>
                    <p className="text-center text-sm text-gray-600 mb-4">
                        מציג {filteredExpenses.length} מתוך {expenses.length} הוצאות
                    </p>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                fontSize={12}
                            />
                            <YAxis
                                tickFormatter={(value) => `₪${value.toLocaleString()}`}
                                fontSize={12}
                            />
                            <Tooltip
                                formatter={(value, name) => [`₪${value.toLocaleString()}`, 'סכום']}
                                labelFormatter={(label) => `קטגוריה: ${label}`}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    direction: 'rtl'
                                }}
                            />
                            <Bar
                                dataKey="value"
                                fill="#36A2EB"
                                animationDuration={800}
                                animationBegin={0}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            );
        }

        if (chartType === 'monthly') {
            // For monthly comparison, always show all months but highlight filtered period
            const monthlyData = {};

            // First, get all months from all expenses to show complete timeline
            expenses.forEach(expense => {
                const date = new Date(expense.date);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                const monthLabel = `${date.getMonth() + 1}/${date.getFullYear()}`;

                if (!monthlyData[monthKey]) {
                    monthlyData[monthKey] = { month: monthLabel, amount: 0 };
                }
                monthlyData[monthKey].amount += expense.amount;
            });

            const chartData = Object.values(monthlyData).sort((a, b) => {
                const [monthA, yearA] = a.month.split('/');
                const [monthB, yearB] = b.month.split('/');
                return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
            });

            if (chartData.length === 0) {
                return (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="text-gray-400 text-6xl mb-4">📈</div>
                            <div className="text-xl font-semibold text-gray-600 mb-2">אין נתונים להצגה</div>
                            <div className="text-gray-500">הוסף הוצאות כדי לראות השוואה חודשית</div>
                        </div>
                    </div>
                );
            }

            return (
                <div className="w-full h-96">
                    <h3 className="text-lg font-semibold text-center mb-4">
                        השוואת הוצאות חודשית
                        {dateFilter !== 'all' && (
                            <span className="text-sm text-gray-500 block">
                                (מציג את כל החודשים - הפילטר משפיע על גרפי עוגה ועמודות)
                            </span>
                        )}
                    </h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="month"
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                fontSize={12}
                            />
                            <YAxis
                                tickFormatter={(value) => `₪${value.toLocaleString()}`}
                                fontSize={12}
                            />
                            <Tooltip
                                formatter={(value, name) => [`₪${value.toLocaleString()}`, 'סכום']}
                                labelFormatter={(label) => `חודש: ${label}`}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    direction: 'rtl'
                                }}
                            />
                            <Bar
                                dataKey="amount"
                                fill="#4BC0C0"
                                animationDuration={800}
                                animationBegin={0}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            );
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    const availableMonths = getAvailableMonths();

    return (
        <div className="bg-white rounded-lg shadow-lg p-6" dir="rtl">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 גרפים אינטראקטיביים</h2>

                {/* Chart Type Selector */}
                <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">סוג גרף:</h3>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setChartType('pie')}
                            className={`px-4 py-2 rounded-lg transition-colors ${chartType === 'pie' ? 'bg-indigo-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                        >
                            🥧 עוגה
                        </button>
                        <button
                            onClick={() => setChartType('bar')}
                            className={`px-4 py-2 rounded-lg transition-colors ${chartType === 'bar' ? 'bg-indigo-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                        >
                            📊 עמודות
                        </button>
                        <button
                            onClick={() => setChartType('monthly')}
                            className={`px-4 py-2 rounded-lg transition-colors ${chartType === 'monthly' ? 'bg-indigo-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                        >
                            📈 השוואה חודשית
                        </button>
                    </div>
                </div>

                {/* Date Filter */}
                <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">מסנן תאריך:</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                        <button
                            onClick={() => {
                                setDateFilter('week');
                                setSelectedMonth('');
                            }}
                            className={`px-4 py-2 rounded-lg transition-colors ${dateFilter === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                        >
                            שבוע אחרון
                        </button>
                        <button
                            onClick={() => {
                                setDateFilter('month');
                                setSelectedMonth('');
                            }}
                            className={`px-4 py-2 rounded-lg transition-colors ${dateFilter === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                        >
                            חודש אחרון
                        </button>
                        <button
                            onClick={() => {
                                setDateFilter('year');
                                setSelectedMonth('');
                            }}
                            className={`px-4 py-2 rounded-lg transition-colors ${dateFilter === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                        >
                            שנה אחרונה
                        </button>
                        <button
                            onClick={() => {
                                setDateFilter('all');
                                setSelectedMonth('');
                            }}
                            className={`px-4 py-2 rounded-lg transition-colors ${dateFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                        >
                            הכל
                        </button>
                    </div>


                    {/* Specific Month Selector */}
                    {availableMonths.length > 0 && (
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">חודש ספציפי:</label>
                            <select
                                value={selectedMonth}
                                onChange={(e) => {
                                    setSelectedMonth(e.target.value);
                                    if (e.target.value) {
                                        setDateFilter('specific');
                                    }
                                }}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">בחר חודש...</option>
                                {availableMonths.map(month => {
                                    const [year, monthNum] = month.split('-');
                                    const monthName = new Date(year, monthNum - 1).toLocaleDateString('he-IL', {
                                        year: 'numeric',
                                        month: 'long'
                                    });
                                    return (
                                        <option key={month} value={month}>
                                            {monthName}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Chart Display */}
            <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border" style={{ minHeight: '450px' }}>
                    {expenses.length > 0 ? renderChart() : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="text-gray-400 text-6xl mb-4">📈</div>
                                <div className="text-xl font-semibold text-gray-600 mb-2">אין נתונים להצגה</div>
                                <div className="text-gray-500">הוסף הוצאות כדי לראות גרפים</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">

            </div>
        </div>
    );
}
