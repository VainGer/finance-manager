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
            
            // Use expenses field if available, otherwise fall back to profile ID
            const expensesId = profile?.expenses || profile?._id;
            const response = await get(`expenses/profile-expenses/${expensesId}`);
            
            if (response.ok && response.expenses) {
                // Parse the real data from your API
                const realExpenses = [];
                const expensesData = response.expenses;
            } else if (response.status === 404) {
                // New profile - no expenses yet
                console.log('No expenses found for new profile');
                setExpenses([]);
                setLoading(false);
                return;
            } else {
                console.error('Failed to fetch expenses:', response);
                setError('לא ניתן לטעון הוצאות');
                setLoading(false);
                return;
            }
            
            if (response.ok && response.expenses) {
                // Parse the real data from your API
                const realExpenses = [];
                const expensesData = response.expenses;
                
                if (expensesData.categories) {
                    expensesData.categories.forEach(category => {
                        if (category.Businesses) {
                            category.Businesses.forEach(business => {
                                if (business.transactionsArray) {
                                    business.transactionsArray.forEach(transactionGroup => {
                                        if (transactionGroup.transactions) {
                                            transactionGroup.transactions.forEach(transaction => {
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
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">סיכום הוצאות</h2>
                            <p className="text-white/80 text-sm">ניתוח מפורט של דפוסי ההוצאה</p>
                        </div>
                    </div>
                </div>
                
                {/* Empty State */}
                <div className="p-16 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div className="text-xl font-bold text-slate-600 mb-3">עדיין אין הוצאות לניתוח</div>
                    <div className="text-slate-500 mb-6">הוסף הוצאות כדי לראות סיכום ופירוט מפורט</div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        השתמש בכפתור הפעולות המהירות
                    </div>
                </div>
            </div>
        );
    }

    const summary = calculateSummary();
    const formatAmount = (amount) => `₪${amount.toLocaleString()}`;

    return (
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">סיכום הוצאות</h2>
                            <p className="text-white/80 text-sm">ניתוח מפורט של דפוסי ההוצאה</p>
                        </div>
                    </div>
                    
                    {/* Breakdown Toggle Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setBreakdownView('category')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                                breakdownView === 'category'
                                    ? 'bg-white text-slate-700 shadow-lg'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            קטגוריות
                        </button>
                        <button
                            onClick={() => setBreakdownView('business')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                                breakdownView === 'business'
                                    ? 'bg-white text-slate-700 shadow-lg'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4m9 0v-2.5A2.5 2.5 0 0018.5 16h-13A2.5 2.5 0 003 18.5V21" />
                            </svg>
                            עסקים
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Main Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center border border-blue-200">
                        <div className="text-3xl font-bold text-blue-600">{summary.transactionCount}</div>
                        <div className="text-sm text-blue-700 font-medium">עסקאות</div>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 text-center border border-red-200">
                        <div className="text-3xl font-bold text-red-600">{formatAmount(summary.totalAmount)}</div>
                        <div className="text-sm text-red-700 font-medium">סה"כ הוצאות</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center border border-green-200">
                        <div className="text-3xl font-bold text-green-600">{formatAmount(summary.totalAmount / summary.transactionCount)}</div>
                        <div className="text-sm text-green-700 font-medium">ממוצע לעסקה</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center border border-purple-200">
                        <div className="text-3xl font-bold text-purple-600">
                            {breakdownView === 'category' ? Object.keys(summary.categoryTotals).length : Object.keys(summary.businessTotals).length}
                        </div>
                        <div className="text-sm text-purple-700 font-medium">
                            {breakdownView === 'category' ? 'קטגוריות' : 'עסקים'}
                        </div>
                    </div>
                </div>

                {/* Breakdown */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    {breakdownView === 'category' ? (
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">פירוט לפי קטגוריות</h3>
                            </div>
                            <div className="space-y-4">
                                {Object.entries(summary.categoryTotals)
                                    .sort(([,a], [,b]) => b - a)
                                    .map(([category, amount]) => {
                                        const percentage = (amount / summary.totalAmount * 100).toFixed(1);
                                        return (
                                            <div key={category} className="bg-slate-50 rounded-lg p-4">
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="font-semibold text-slate-800">{category}</span>
                                                    <span className="text-lg font-bold text-blue-600">
                                                        {formatAmount(amount)}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-3">
                                                    <div 
                                                        className="bg-blue-500 h-3 rounded-full transition-all duration-500" 
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-sm text-slate-600 mt-2 text-right">{percentage}%</div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    ) : (
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4m9 0v-2.5A2.5 2.5 0 0018.5 16h-13A2.5 2.5 0 003 18.5V21" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">פירוט לפי עסקים</h3>
                            </div>
                            <div className="space-y-4">
                                {Object.entries(summary.businessTotals)
                                    .sort(([,a], [,b]) => b - a)
                                    .map(([business, amount]) => {
                                        const percentage = (amount / summary.totalAmount * 100).toFixed(1);
                                        return (
                                            <div key={business} className="bg-slate-50 rounded-lg p-4">
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="font-semibold text-slate-800">{business}</span>
                                                    <span className="text-lg font-bold text-green-600">
                                                        {formatAmount(amount)}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-3">
                                                    <div 
                                                        className="bg-green-500 h-3 rounded-full transition-all duration-500" 
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-sm text-slate-600 mt-2 text-right">{percentage}%</div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
