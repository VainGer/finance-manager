import { useState, useEffect } from 'react';
import { get } from '../../../utils/api';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorMessage from '../../common/ErrorMessage';

export default function ExpensesDisplay({ profile }) {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        category: 'all',
        business: 'all',
        sortBy: 'date',
        sortOrder: 'desc'
    });

    useEffect(() => {
        fetchExpenses();
    }, [profile]);

    useEffect(() => {
        applyFilters();
    }, [expenses, filters]);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const expensesId = profile?.expenses || profile?.profileId || '6888fada86dcf136e4141d5d';
            const response = await get(`expenses/profile-expenses/${expensesId}`);
            
            if (response.ok && response.expenses) {
                // Parse the real data from your API
                const realExpenses = [];
                const expensesData = response.expenses;
                
                if (expensesData.categories) {
                    expensesData.categories.forEach(category => {
                        if (category.Businesses) {
                            category.Businesses.forEach(business => {
                                if (business.transactions) {
                                    business.transactions.forEach(transaction => {
                                        realExpenses.push({
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
                
                setExpenses(realExpenses);
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

    const applyFilters = () => {
        let filtered = [...expenses];

        // Filter by category
        if (filters.category !== 'all') {
            filtered = filtered.filter(expense => expense.category === filters.category);
        }

        // Filter by business
        if (filters.business !== 'all') {
            filtered = filtered.filter(expense => expense.business === filters.business);
        }

        // Sort
        filtered.sort((a, b) => {
            let aValue, bValue;
            
            switch (filters.sortBy) {
                case 'amount':
                    aValue = a.amount;
                    bValue = b.amount;
                    break;
                case 'date':
                    aValue = new Date(a.date);
                    bValue = new Date(b.date);
                    break;
                case 'description':
                    aValue = a.description;
                    bValue = b.description;
                    break;
                default:
                    aValue = new Date(a.date);
                    bValue = new Date(b.date);
            }

            if (filters.sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

        setFilteredExpenses(filtered);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('he-IL');
    };

    const formatAmount = (amount) => {
        return `₪${amount.toLocaleString()}`;
    };

    const getUniqueCategories = () => {
        return [...new Set(expenses.map(expense => expense.category))];
    };

    const getUniqueBusinesses = () => {
        return [...new Set(expenses.map(expense => expense.business))];
    };

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
                <h2 className="text-2xl font-bold text-gray-800 mb-6">💰 הוצאות</h2>
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">💰</div>
                    <div className="text-xl font-semibold text-gray-600 mb-2">אין הוצאות</div>
                    <div className="text-gray-500">לא נמצאו עסקאות להצגה</div>
                </div>
            </div>
        );
    }

    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">💰 הוצאות</h2>
            </div>

            {/* Filters */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold mb-4">🔍 סינון וחיפוש</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            קטגוריה
                        </label>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters({...filters, category: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">כל הקטגוריות</option>
                            {getUniqueCategories().map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    {/* Business Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            עסק
                        </label>
                        <select
                            value={filters.business}
                            onChange={(e) => setFilters({...filters, business: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">כל העסקים</option>
                            {getUniqueBusinesses().map(business => (
                                <option key={business} value={business}>{business}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sort By */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            מיון לפי
                        </label>
                        <select
                            value={filters.sortBy}
                            onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="date">תאריך</option>
                            <option value="amount">סכום</option>
                            <option value="description">תיאור</option>
                        </select>
                    </div>

                    {/* Sort Order */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            סדר מיון
                        </label>
                        <select
                            value={filters.sortOrder}
                            onChange={(e) => setFilters({...filters, sortOrder: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="desc">יורד (חדש לישן)</option>
                            <option value="asc">עולה (ישן לחדש)</option>
                        </select>
                    </div>
                </div>

                {/* Clear Filters Button */}
                <div className="mt-4">
                    <button
                        onClick={() => setFilters({
                            category: 'all',
                            business: 'all',
                            sortBy: 'date',
                            sortOrder: 'desc'
                        })}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                        נקה סינונים
                    </button>
                </div>
            </div>

            {/* Summary */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{filteredExpenses.length}</div>
                        <div className="text-sm text-gray-600">עסקאות מוצגות</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{formatAmount(totalAmount)}</div>
                        <div className="text-sm text-gray-600">סה"כ הוצאות</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {filteredExpenses.length > 0 ? formatAmount(totalAmount / filteredExpenses.length) : formatAmount(0)}
                        </div>
                        <div className="text-sm text-gray-600">ממוצע לעסקה</div>
                    </div>
                </div>
            </div>

            {/* Expenses Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-right p-3 font-semibold">תאריך</th>
                            <th className="text-right p-3 font-semibold">תיאור</th>
                            <th className="text-right p-3 font-semibold">קטגוריה</th>
                            <th className="text-right p-3 font-semibold">עסק</th>
                            <th className="text-right p-3 font-semibold">סכום</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.length > 0 ? (
                            filteredExpenses.map((expense) => (
                                <tr key={expense._id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{formatDate(expense.date)}</td>
                                    <td className="p-3">{expense.description}</td>
                                    <td className="p-3">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="p-3">{expense.business}</td>
                                    <td className="p-3 font-bold text-red-600">{formatAmount(expense.amount)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">
                                    אין עסקאות להצגה עם הסינון הנוכחי
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
