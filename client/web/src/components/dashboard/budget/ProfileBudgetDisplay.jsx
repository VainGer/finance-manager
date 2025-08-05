

import { useState, useEffect } from 'react';
import { get } from '../../../utils/api';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorMessage from '../../common/ErrorMessage';

export default function ProfileBudgetDisplay({ profile }) {
    const [budgetData, setBudgetData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBudgetData();
    }, [profile]);

    const fetchBudgetData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const expensesId = profile?.expenses || profile?.profileId || '6888fada86dcf136e4141d5d';
            const response = await get(`expenses/profile-expenses/${expensesId}`);
            
            if (response.ok && response.expenses) {
                setBudgetData(response.expenses);
            } else {
                setError(response.message || 'שגיאה בטעינת נתוני התקציב');
            }
        } catch (err) {
            console.error('Error fetching budget data:', err);
            setError('שגיאה בחיבור למסד הנתונים');
        } finally {
            setLoading(false);
        }
    };

    const calculateCategorySpent = (category) => {
        let totalSpent = 0;
        if (category.Businesses) {
            category.Businesses.forEach(business => {
                if (business.transactions) {
                    business.transactions.forEach(transaction => {
                        totalSpent += Number(transaction.amount);
                    });
                }
            });
        }
        return totalSpent;
    };

    const getCurrentBudget = (budgets) => {
        const now = new Date();
        return budgets.find(budget => {
            const startDate = new Date(budget.startDate);
            const endDate = new Date(budget.endDate);
            return now >= startDate && now <= endDate;
        });
    };

    const getBudgetAmount = (budget) => {
        // Handle both 'amount' and 'budgetAmount' field names
        return budget?.amount || budget?.budgetAmount || 0;
    };

    const formatCurrency = (amount) => {
        return `₪${Number(amount).toLocaleString()}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('he-IL');
    };

    const getProgressPercentage = (spent, budget) => {
        if (!budget || budget === 0) return 0;
        return (spent / budget) * 100; // Remove Math.min to allow over 100%
    };

    const getProgressBarPercentage = (spent, budget) => {
        if (!budget || budget === 0) return 0;
        return Math.min((spent / budget) * 100, 100); // Cap at 100% for visual display only
    };

    const getProgressColor = (percentage) => {
        if (percentage <= 50) return 'bg-green-500';
        if (percentage <= 75) return 'bg-yellow-500';
        if (percentage <= 90) return 'bg-orange-500';
        return 'bg-red-500';
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    if (!budgetData || !budgetData.categories) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">תקציב מול הוצאות - {profile.profileName}</h2>
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">💰</div>
                    <div className="text-xl font-semibold text-gray-600 mb-2">אין נתוני תקציב</div>
                    <div className="text-gray-500">לא נמצאו קטגוריות עם תקציבים</div>
                </div>
            </div>
        );
    }

    const categoriesWithBudgets = budgetData.categories.filter(category => 
        category.budgets && category.budgets.length > 0
    );

    const totalBudget = categoriesWithBudgets.reduce((sum, category) => {
        const currentBudget = getCurrentBudget(category.budgets);
        return sum + (currentBudget ? Number(getBudgetAmount(currentBudget)) : 0);
    }, 0);

    const totalSpent = categoriesWithBudgets.reduce((sum, category) => {
        return sum + calculateCategorySpent(category);
    }, 0);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">💰 תקציב מול הוצאות - {profile.profileName}</h2>
            </div>

            {/* Overall Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">📊 סיכום כללי</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{formatCurrency(totalBudget)}</div>
                        <div className="text-sm text-gray-600">סך התקציב</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-red-600">{formatCurrency(totalSpent)}</div>
                        <div className="text-sm text-gray-600">סך ההוצאות</div>
                    </div>
                    <div className="text-center">
                        <div className={`text-3xl font-bold ${totalSpent <= totalBudget ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(totalBudget - totalSpent)}
                        </div>
                        <div className="text-sm text-gray-600">יתרה</div>
                    </div>
                </div>
                
                {/* Overall Progress Bar */}
                <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                            className={`h-4 rounded-full ${getProgressColor(getProgressBarPercentage(totalSpent, totalBudget))}`}
                            style={{ width: `${getProgressBarPercentage(totalSpent, totalBudget)}%` }}
                        ></div>
                    </div>
                    <div className="text-center mt-1 text-sm text-gray-600">
                        {Math.min(getProgressPercentage(totalSpent, totalBudget), 100).toFixed(1)}% מהתקציב הכללי
                    </div>
                </div>
            </div>

            {/* Categories Budget Details */}
            <div>
                <h3 className="text-lg font-semibold mb-4">📋 פירוט לפי קטגוריות</h3>
                
                {categoriesWithBudgets.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-gray-400 text-4xl mb-2">📊</div>
                        <div className="text-gray-600">אין קטגוריות עם תקציבים פעילים</div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {categoriesWithBudgets.map((category, index) => {
                            const categorySpent = calculateCategorySpent(category);
                            const currentBudget = getCurrentBudget(category.budgets);
                            const budgetAmount = currentBudget ? Number(getBudgetAmount(currentBudget)) : 0;
                            const progressPercentage = getProgressPercentage(categorySpent, budgetAmount);
                            const progressBarPercentage = getProgressBarPercentage(categorySpent, budgetAmount);
                            
                            return (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-lg font-semibold text-gray-800">{category.name}</h4>
                                        <div className="text-sm text-gray-500">
                                            {currentBudget && (
                                                <>
                                                    {formatDate(currentBudget.startDate)} - {formatDate(currentBudget.endDate)}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-blue-600">{formatCurrency(budgetAmount)}</div>
                                            <div className="text-xs text-gray-600">תקציב</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-red-600">{formatCurrency(categorySpent)}</div>
                                            <div className="text-xs text-gray-600">הוצאות</div>
                                        </div>
                                        <div className="text-center">
                                            <div className={`text-xl font-bold ${categorySpent <= budgetAmount ? 'text-green-600' : 'text-red-600'}`}>
                                                {formatCurrency(budgetAmount - categorySpent)}
                                            </div>
                                            <div className="text-xs text-gray-600">יתרה</div>
                                        </div>
                                        <div className="text-center">
                                            <div className={`text-xl font-bold ${progressPercentage <= 90 ? 'text-green-600' : 'text-red-600'}`}>
                                                {Math.min(progressPercentage, 100).toFixed(1)}%
                                            </div>
                                            <div className="text-xs text-gray-600">אחוז ניצול</div>
                                        </div>
                                    </div>
                                    
                                    {/* Category Progress Bar */}
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div 
                                            className={`h-3 rounded-full ${getProgressColor(progressBarPercentage)}`}
                                            style={{ width: `${progressBarPercentage}%` }}
                                        ></div>
                                    </div>
                                    
                                    {/* Budget Status Message */}
                                    <div className="mt-2 text-sm">
                                        {progressPercentage > 100 ? (
                                            <span className="text-red-600 font-semibold">⚠️ חריגה מהתקציב!</span>
                                        ) : progressPercentage > 90 ? (
                                            <span className="text-orange-600 font-semibold">⚡ קרוב לחריגה</span>
                                        ) : progressPercentage > 75 ? (
                                            <span className="text-yellow-600 font-semibold">⚡ ניצול גבוה</span>
                                        ) : (
                                            <span className="text-green-600 font-semibold">✅ במסגרת התקציב</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
