import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import useChildrenData from '../../../hooks/expenses/useChildrenData';
import { useProfileBudgetData } from '../../../hooks/useProfileBudgetData';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorMessage from '../../common/ErrorMessage';
import BudgetPeriodSelector from './BudgetPeriodSelector';
import OverallBudgetSummary from './OverallBudgetSummary';
import CategoryBudgetDetails from './CategoryBudgetDetails';

export default function ProfileBudgetDisplay({ profile }) {
    const { profile: authProfile } = useAuth();
    
    // Get children data - has everything we need!
    const { children, selectedChild, setSelectedChild, 
           childrenProfileBudgets, childrenCategoryBudgets, childrenExpenses, loading: childLoading } = useChildrenData();

    // Parent profile budget data
    const {
        loading,
        error,
        availablePeriods,
        selectedPeriod,
        setSelectedPeriod,
        currentProfileBudget,
        currentCategoryBudgets,
        relevantPeriod
    } = useProfileBudgetData(profile);

    // Child selected period state
    const [childSelectedPeriod, setChildSelectedPeriod] = useState(null);

    // Reset child selected period when switching children
    useEffect(() => {
        setChildSelectedPeriod(null);
    }, [selectedChild]);

    // Child budget data - with proper period selection
    const childBudgetData = useMemo(() => {
        if (!selectedChild || !childrenProfileBudgets || childrenProfileBudgets.length === 0) {
            return {
                loading: false,
                error: null,
                availablePeriods: [],
                selectedPeriod: null,
                setSelectedPeriod: () => {},
                currentProfileBudget: null,
                currentCategoryBudgets: [],
                relevantPeriod: false
            };
        }

        // Available periods - same logic as parent
        const availablePeriods = childrenProfileBudgets.map(budget => ({
            startDate: budget.startDate,
            endDate: budget.endDate,
            ...budget
        })).sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

        // Use selected period or default to most recent
        const currentPeriod = childSelectedPeriod || availablePeriods[0];

        // Check if period is relevant (current)
        const now = new Date();
        const startDate = new Date(currentPeriod?.startDate);
        const endDate = new Date(currentPeriod?.endDate);
        const relevantPeriod = startDate <= now && now <= endDate;

        // Current profile budget - find the actual budget data
        const currentProfileBudget = childrenProfileBudgets.find(budget =>
            budget.startDate === currentPeriod?.startDate && budget.endDate === currentPeriod?.endDate
        );
        


        // Current category budgets - same logic as parent profile
        const currentCategoryBudgets = childrenExpenses.map(cat => {
            // Find the category budget for this period
            let categoryBudgetForPeriod = null;
            const categoryBudgetData = childrenCategoryBudgets.find(cb => cb.name === cat.name);
            
            if (categoryBudgetData && categoryBudgetData.budgets) {
                categoryBudgetForPeriod = categoryBudgetData.budgets.find(b => 
                    b.startDate === currentPeriod?.startDate && b.endDate === currentPeriod?.endDate
                );
            }

            // Calculate spent from transactions in the period
            let spentInPeriod = 0;
            if (cat.Businesses && Array.isArray(cat.Businesses)) {
                cat.Businesses.forEach(business => {
                    if (business.transactionsArray && Array.isArray(business.transactionsArray)) {
                        business.transactionsArray.forEach(transactionGroup => {
                            if (transactionGroup.transactions && Array.isArray(transactionGroup.transactions)) {
                                transactionGroup.transactions.forEach(transaction => {
                                    const tDate = new Date(transaction.date || transaction.createdAt);
                                    const periodStart = new Date(currentPeriod.startDate);
                                    const periodEnd = new Date(currentPeriod.endDate);
                                    
                                    if (tDate >= periodStart && tDate <= periodEnd) {
                                        spentInPeriod += transaction.amount || 0;
                                    }
                                });
                            }
                        });
                    }
                });
            }

            return {
                name: cat.name,
                budget: categoryBudgetForPeriod ? categoryBudgetForPeriod.amount : null,
                spent: spentInPeriod
            };
        });

        return {
            loading: false,
            error: null,
            availablePeriods,
            selectedPeriod: currentPeriod,
            setSelectedPeriod: setChildSelectedPeriod,
            currentProfileBudget,
            currentCategoryBudgets,
            relevantPeriod
        };
    }, [selectedChild, childrenProfileBudgets, childrenExpenses, childrenCategoryBudgets, childSelectedPeriod]);
    


    // Simple data selection - use child data if child selected, otherwise parent data
    const displayData = selectedChild ? {
        loading: childLoading,
        error: null,
        availablePeriods: childBudgetData.availablePeriods,
        selectedPeriod: childBudgetData.selectedPeriod,
        setSelectedPeriod: childBudgetData.setSelectedPeriod,
        currentProfileBudget: childBudgetData.currentProfileBudget,
        currentCategoryBudgets: childBudgetData.currentCategoryBudgets,
        relevantPeriod: childBudgetData.relevantPeriod
    } : {
        loading,
        error,
        availablePeriods,
        selectedPeriod,
        setSelectedPeriod,
        currentProfileBudget,
        currentCategoryBudgets,
        relevantPeriod
    };

    if (displayData.error) {
        return (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg overflow-hidden relative">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-indigo-100/20 rounded-full"></div>
                    <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-cyan-100/25 to-teal-100/15 rounded-full"></div>
                </div>
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-5 text-white relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-white/30 to-white/10 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white drop-shadow-sm">💰 תקציב מול הוצאות</h2>
                            <p className="text-white/80 text-sm">שגיאה בטעינת הנתונים</p>
                        </div>
                    </div>
                </div>
                <div className="p-6 relative z-10">
                    <ErrorMessage message={displayData.error} />
                </div>
            </div>
        );
    }

    if (displayData.loading) {
        return (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg overflow-hidden relative">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-indigo-100/20 rounded-full"></div>
                    <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-cyan-100/25 to-teal-100/15 rounded-full"></div>
                </div>
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-5 text-white relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-white/30 to-white/10 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white drop-shadow-sm">💰 תקציב מול הוצאות</h2>
                            <p className="text-white/80 text-sm">טוען נתונים...</p>
                        </div>
                    </div>
                </div>
                <div className="p-8 relative z-10">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (!displayData.currentProfileBudget) {
        return (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg overflow-hidden relative">
                {/* Enhanced Background circles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-indigo-100/20 rounded-full"></div>
                    <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-cyan-100/25 to-teal-100/15 rounded-full"></div>
                    <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-br from-purple-100/20 to-pink-100/10 rounded-full"></div>
                </div>

                {/* Enhanced Header */}
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-5 text-white relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-white/30 to-white/10 rounded-xl flex items-center justify-center shadow-lg">
                                <svg className="w-5 h-5 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white drop-shadow-sm">💰 תקציב מול הוצאות</h2>
                                <p className="text-white/80 text-sm">{profile.profileName}</p>
                            </div>
                        </div>
                        
                        {/* Enhanced Profile Selector */}
                        {(authProfile?.parentProfile || profile?.parentProfile) && children && children.length > 0 && (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                <span className="text-white/90 text-sm font-medium">👥 צפה בפרופיל:</span>
                                <select
                                    value={selectedChild || ''}
                                    onChange={(e) => setSelectedChild(e.target.value || null)}
                                    className="bg-gradient-to-r from-white/25 to-white/15 border border-white/40 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/60 backdrop-blur-sm shadow-sm font-medium"
                                >
                                    <option value="">שלי</option>
                                    {children.map((child) => (
                                        <option key={child.id} value={child.id} className="text-black">
                                            {child.profileName || child.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Child Profile Viewing Indicator */}
                {selectedChild && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mx-6 mb-4 mt-4">
                        <div className="flex items-center gap-2 text-blue-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium">
                                צופה בתקציב של: {children.find(c => c.id === selectedChild)?.profileName || children.find(c => c.id === selectedChild)?.name}
                            </span>
                        </div>
                    </div>
                )}



                {/* Enhanced Empty State */}
                <div className="p-8 text-center relative z-10">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100/80 to-indigo-100/60 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                    </div>
                    <div className="text-lg font-bold text-slate-700 mb-2">
                        {selectedChild ? '📊 אין תקציבים לפרופיל זה' : '💰 בואו ניצור תקציב ראשון!'}
                    </div>
                    <div className="text-slate-500 mb-4 text-sm max-w-sm mx-auto">
                        {selectedChild ? 'הפרופיל הנבחר עדיין לא יצר תקציבים לתקופה זו' : 'צור תקציב ראשון כדי להתחיל לעקוב אחר ההוצאות ולנהל את הכספים בחכמה'}
                    </div>
                    {!selectedChild && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100/80 to-indigo-100/60 rounded-xl text-sm text-blue-700 font-medium shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            השתמש בכפתור הפעולות המהירות
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg overflow-hidden relative">
            {/* Background circles for consistency */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-100/20 rounded-full"></div>
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-cyan-100/15 rounded-full"></div>
            </div>

            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-5 text-white relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-white/30 to-white/10 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white drop-shadow-sm">💰 תקציב מול הוצאות</h2>
                            <p className="text-white/80 text-sm">{profile.profileName}</p>
                        </div>
                    </div>
                    
                    {/* Enhanced Profile Selector */}
                    {(authProfile?.parentProfile || profile?.parentProfile) && children && children.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <span className="text-white/90 text-sm font-medium">👥 צפה בפרופיל:</span>
                            <select
                                value={selectedChild || ''}
                                onChange={(e) => setSelectedChild(e.target.value || null)}
                                className="bg-gradient-to-r from-white/25 to-white/15 border border-white/40 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/60 backdrop-blur-sm shadow-sm font-medium"
                            >
                                <option value="">שלי</option>
                                {children.map((child) => (
                                    <option key={child.id} value={child.id} className="text-black">
                                        {child.profileName || child.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">

                
                {/* Period Selector */}
                {displayData.availablePeriods && displayData.availablePeriods.length > 0 && (
                    <BudgetPeriodSelector
                        periods={displayData.availablePeriods}
                        selectedPeriod={displayData.selectedPeriod}
                        onSelectPeriod={displayData.setSelectedPeriod}
                    />
                )}



                {/* Not relevant period warning */}
                {!displayData.relevantPeriod && displayData.selectedPeriod && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4" role="alert">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-amber-800">לתשומת לבך</p>
                                <p className="text-amber-700 text-sm">התקציב המוצג אינו פעיל לתקופה הנוכחית</p>
                            </div>
                        </div>
                    </div>
                )}



                {/* Child Profile Viewing Indicator */}
                {selectedChild && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-blue-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium">
                                צופה בתקציב של: {children.find(c => c.id === selectedChild)?.profileName || children.find(c => c.id === selectedChild)?.name}
                            </span>
                        </div>
                    </div>
                )}

                {/* Check if we have budget data to show */}
                {selectedChild && !displayData.currentProfileBudget ? (
                    /* Empty State for Child */
                    <div className="p-12 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                        <div className="text-xl font-bold text-slate-600 mb-3">אין תקציבים לפרופיל זה</div>
                        <div className="text-slate-500 mb-6">הפרופיל הנבחר עדיין לא יצר תקציבים</div>
                    </div>
                ) : (
                    /* Show Budget Data */
                    <>
    
                        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                            <OverallBudgetSummary budget={displayData.currentProfileBudget} />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-slate-700 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">פירוט לפי קטגוריות</h3>
                            </div>
                            <CategoryBudgetDetails
                                categories={displayData.currentCategoryBudgets}
                                selectedPeriod={displayData.selectedPeriod}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}