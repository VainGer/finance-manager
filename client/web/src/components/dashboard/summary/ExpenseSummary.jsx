import { useState, useEffect } from 'react';
import { get } from '../../../utils/api';
import LoadingSpinner from '../../common/LoadingSpinner';

export default function ExpenseSummary({ profile }) {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [breakdownView, setBreakdownView] = useState('category'); 

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

    const calculateSummary = () => {
        const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        // Group by category
        const categoryTotals = expenses.reduce((acc, expense) => {
            if (!acc[expense.category]) {
                acc[expense.category] = 0;
            }
            acc[expense.category] += expense.amount;
            return acc;
        }, {});

        // Group by business
        const businessTotals = expenses.reduce((acc, expense) => {
            if (!acc[expense.business]) {
                acc[expense.business] = 0;
            }
            acc[expense.business] += expense.amount;
            return acc;
        }, {});

        return {
            totalAmount,
            categoryTotals,
            businessTotals,
            transactionCount: expenses.length
        };
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
                <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 סיכום הוצאות</h2>
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📊</div>
                    <div className="text-xl font-semibold text-gray-600 mb-2">אין הוצאות</div>
                    <div className="text-gray-500">לא נמצאו עסקאות להצגה</div>
                </div>
            </div>
        );
    }

    const summary = calculateSummary();
    const formatAmount = (amount) => `₪${amount.toLocaleString()}`;

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">📊 סיכום הוצאות</h2>
                
                {/* Breakdown Toggle Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setBreakdownView('category')}
                        className={`px-4 py-2 rounded transition-colors ${
                            breakdownView === 'category'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        📈 פילוח לפי קטגוריות
                    </button>
                    <button
                        onClick={() => setBreakdownView('business')}
                        className={`px-4 py-2 rounded transition-colors ${
                            breakdownView === 'business'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        🏪 פילוח לפי עסקים
                    </button>
                </div>
            </div>

            {/* Main Stats */}
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
                        {formatAmount(summary.totalAmount / summary.transactionCount)}
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

            {/* Single Breakdown Display */}
            <div>
                {breakdownView === 'category' ? (
                    /* Category Breakdown */
                    <div>
                        <h3 className="text-xl font-bold mb-4">📈 הצגה לפי קטגוריות</h3>
                        <div className="space-y-3">
                            {Object.entries(summary.categoryTotals)
                                .sort(([,a], [,b]) => b - a)
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
                ) : (
                    /* Business Breakdown */
                    <div>
                        <h3 className="text-xl font-bold mb-4">🏪 הצגה לפי עסקים</h3>
                        <div className="space-y-3">
                            {Object.entries(summary.businessTotals)
                                .sort(([,a], [,b]) => b - a)
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
                )}
            </div>
        </div>
    );
}
