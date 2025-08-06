import { useState, useEffect } from 'react';
import { get } from '../../../utils/api';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorMessage from '../../common/ErrorMessage';

export default function ProfileBudgetDisplay({ profile }) {
    const [budgetData, setBudgetData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [availablePeriods, setAvailablePeriods] = useState([]);

    useEffect(() => {
        fetchBudgetData();
    }, [profile]);

    useEffect(() => {
        if (profile && profile.budgets) {
            const uniquePeriods = [];
            const periodSet = new Set();

            profile.budgets.forEach(budget => {
                const periodKey = `${budget.startDate}-${budget.endDate}`;
                if (!periodSet.has(periodKey)) {
                    periodSet.add(periodKey);
                    uniquePeriods.push({ startDate: budget.startDate, endDate: budget.endDate });
                }
            });

            uniquePeriods.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
            setAvailablePeriods(uniquePeriods);

            if (uniquePeriods.length > 0) {
                const now = new Date();
                const activePeriod = uniquePeriods.find(p => {
                    const startDate = new Date(p.startDate);
                    const endDate = new Date(p.endDate);
                    return now >= startDate && now <= endDate;
                });
                setSelectedPeriod(activePeriod || uniquePeriods[0]);
            }
        }
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

    const calculateCategorySpent = (budget) => {
        return Number(budget?.spent) || 0;
    };

    const getDisplayBudget = (budgets) => {
        if (!budgets || budgets.length === 0 || !selectedPeriod) {
            return null;
        }
        
        return budgets.find(budget => 
            budget.startDate === selectedPeriod.startDate && 
            budget.endDate === selectedPeriod.endDate
        );
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
        const displayBudget = getDisplayBudget(category.budgets);
        return sum + (displayBudget ? Number(getBudgetAmount(displayBudget)) : 0);
    }, 0);

    const totalSpent = categoriesWithBudgets.reduce((sum, category) => {
        const displayBudget = getDisplayBudget(category.budgets);
        return sum + calculateCategorySpent(displayBudget);
    }, 0);

    const isBudgetActive = (budget) => {
        if (!budget) return false;
        const now = new Date();
        const startDate = new Date(budget.startDate);
        const endDate = new Date(budget.endDate);
        return now >= startDate && now <= endDate;
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">💰 תקציב מול הוצאות - {profile.profileName}</h2>
                {availablePeriods.length > 1 && (
                    <div className="relative">
                        <select
                            value={selectedPeriod ? `${selectedPeriod.startDate}|${selectedPeriod.endDate}` : ''}
                            onChange={(e) => {
                                const [startDate, endDate] = e.target.value.split('|');
                                setSelectedPeriod({ startDate, endDate });
                            }}
                            className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        >
                            {availablePeriods.map((period, index) => (
                                <option key={index} value={`${period.startDate}|${period.endDate}`}>
                                    תקופה: {formatDate(period.startDate)} - {formatDate(period.endDate)}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                )}
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
                            const displayBudget = getDisplayBudget(category.budgets);
                            const categorySpent = calculateCategorySpent(displayBudget);
                            const budgetAmount = displayBudget ? Number(getBudgetAmount(displayBudget)) : 0;
                            const progressPercentage = getProgressPercentage(categorySpent, budgetAmount);
                            const progressBarPercentage = getProgressBarPercentage(categorySpent, budgetAmount);
                            
                            return (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-lg font-semibold text-gray-800">{category.name}</h4>
                                        <div className="text-sm text-gray-500">
                                            {displayBudget && (
                                                <>
                                                    {formatDate(displayBudget.startDate)} - {formatDate(displayBudget.endDate)}
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {!isBudgetActive(displayBudget) && (
                                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 mb-3" role="alert">
                                            <p className="font-bold">לתשומת לבך:</p>
                                            <p>התקציב המוצג אינו פעיל לתקופה הנוכחית.</p>
                                        </div>
                                    )}
                                    
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
