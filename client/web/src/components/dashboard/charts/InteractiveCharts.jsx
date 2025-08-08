import { useState, useMemo, useEffect } from 'react';
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
import LoadingSpinner from "../../common/LoadingSpinner";
import ErrorMessage from "../../common/ErrorMessage";
import useExpensesDisplay from '../../../hooks/useExpensesDisplay';



export default function InteractiveCharts({ profile, refreshTrigger }) {
    const [dateFilter, setDateFilter] = useState('all');
    const [chartType, setChartType] = useState('pie');
    const [selectedMonth, setSelectedMonth] = useState('');


    const {
        expenses,
        filteredExpenses,
        loading,
        error,
        refetchExpenses
    } = useExpensesDisplay(profile);
    

    useEffect(() => {
        if (refreshTrigger) {
            refetchExpenses();
        }
    }, [refreshTrigger, refetchExpenses]);


    const filteredByDateExpenses = useMemo(() => {
        if (!filteredExpenses) return [];
        if (dateFilter === 'all') return filteredExpenses;

        const now = new Date();

        if (dateFilter === 'specific' && selectedMonth) {
            const [year, month] = selectedMonth.split('-');
            return filteredExpenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getFullYear() === parseInt(year) &&
                    expenseDate.getMonth() === parseInt(month) - 1;
            });
        }

        const cutoffDate = new Date();

        switch (dateFilter) {
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
                return filteredExpenses;
        }

        return filteredExpenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= cutoffDate && expenseDate <= now;
        });
    }, [filteredExpenses, dateFilter, selectedMonth]);

    const renderChart = () => {
        if (!filteredByDateExpenses || filteredByDateExpenses.length === 0) {
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

        if (chartType === 'pie') {
            return (
                <div className="w-full h-96">
                    <h3 className="text-lg font-semibold text-center mb-2">התפלגות הוצאות לפי קטגוריה</h3>
                    <p className="text-center text-sm text-gray-600 mb-4">
                        מציג {filteredByDateExpenses.length} מתוך {expenses?.length || 0} הוצאות
                    </p>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                animationBegin={0}
                                animationDuration={800}
                            >
                                {pieChartData.map((entry, index) => (
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
            return (
                <div className="w-full h-96">
                    <h3 className="text-lg font-semibold text-center mb-2">התפלגות הוצאות לפי קטגוריה</h3>
                    <p className="text-center text-sm text-gray-600 mb-4">
                        מציג {filteredByDateExpenses.length} מתוך {expenses?.length || 0} הוצאות
                    </p>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={pieChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                                {pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            );
        }

        if (chartType === 'monthly') {
            if (monthlyChartData.length === 0) {
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
                        <BarChart data={monthlyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
        
        return null;
    };

    const availableMonths = useMemo(() => {
        if (!expenses || expenses.length === 0) return [];
        const months = new Set();
        expenses.forEach(expense => {
            const date = new Date(expense.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            months.add(monthKey);
        });
        return Array.from(months).sort().reverse();
    }, [expenses]);
    
    const pieChartData = useMemo(() => {
        if (!filteredByDateExpenses || filteredByDateExpenses.length === 0) return [];
        
        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
        const categoryData = {};
        filteredByDateExpenses.forEach(expense => {
            const category = expense.category || 'ללא קטגוריה';
            if (!categoryData[category]) {
                categoryData[category] = 0;
            }
            categoryData[category] += expense.amount;
        });

        return Object.entries(categoryData).map(([name, value], index) => ({
            name,
            value,
            color: colors[index % colors.length]
        }));
    }, [filteredByDateExpenses]);
    

    const monthlyChartData = useMemo(() => {
        if (!expenses || expenses.length === 0) return [];
        
        const monthlyData = {};
        expenses.forEach(expense => {
            const date = new Date(expense.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthLabel = `${date.getMonth() + 1}/${date.getFullYear()}`;

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { month: monthLabel, amount: 0 };
            }
            monthlyData[monthKey].amount += expense.amount;
        });

        return Object.values(monthlyData).sort((a, b) => {
            const [monthA, yearA] = a.month.split('/');
            const [monthB, yearB] = b.month.split('/');
            return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
        });
    }, [expenses]);
    
    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

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
                    {renderChart()}
                </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">

            </div>
        </div>
    );
}
