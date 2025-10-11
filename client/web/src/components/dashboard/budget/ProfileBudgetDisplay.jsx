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
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6">
                <ErrorMessage message={displayData.error} />
            </div>
        );
    }

    if (displayData.loading) {
        return (
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-8">
                <LoadingSpinner />
            </div>
        );
    }

    if (!displayData.currentProfileBudget) {
        return (
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">תקציב מול הוצאות</h2>
                                <p className="text-white/80 text-sm">{profile.profileName}</p>
                            </div>
                        </div>
                        
                        {/* Profile Selector - only show for parent profiles */}
                        {(authProfile?.parentProfile || profile?.parentProfile) && children && children.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-white/80 text-sm">צפה בפרופיל:</span>
                                <select
                                    value={selectedChild || ''}
                                    onChange={(e) => setSelectedChild(e.target.value || null)}
                                    className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
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



                {/* Empty State */}
                <div className="p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                    </div>
                    <div className="text-xl font-bold text-slate-600 mb-3">
                        {selectedChild ? 'אין תקציבים לפרופיל זה' : 'עדיין אין תקציבים'}
                    </div>
                    <div className="text-slate-500 mb-6">
                        {selectedChild ? 'הפרופיל הנבחר עדיין לא יצר תקציבים' : 'צור תקציב ראשון כדי להתחיל לעקוב אחר ההוצאות'}
                    </div>
                    {!selectedChild && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-600">
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
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">תקציב מול הוצאות</h2>
                            <p className="text-white/80 text-sm">{profile.profileName}</p>
                        </div>
                    </div>
                    
                    {/* Profile Selector - only show for parent profiles */}
                    {(authProfile?.parentProfile || profile?.parentProfile) && children && children.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-white/80 text-sm">צפה בפרופיל:</span>
                            <select
                                value={selectedChild || ''}
                                onChange={(e) => setSelectedChild(e.target.value || null)}
                                className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
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