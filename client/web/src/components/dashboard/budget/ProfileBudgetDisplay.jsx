import React from 'react';
import { useProfileBudgetData } from '../../../hooks/useProfileBudgetData';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorMessage from '../../common/ErrorMessage';
import BudgetPeriodSelector from './BudgetPeriodSelector';
import OverallBudgetSummary from './OverallBudgetSummary';
import CategoryBudgetDetails from './CategoryBudgetDetails';

export default function ProfileBudgetDisplay({ profile }) {
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

    if (error) {
        return (
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6">
                <ErrorMessage message={error} />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-8">
                <LoadingSpinner />
            </div>
        );
    }

    if (!currentProfileBudget) {
        return (
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
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
                </div>
                
                {/* Empty State */}
                <div className="p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                    </div>
                    <div className="text-xl font-bold text-slate-600 mb-3">עדיין אין תקציבים</div>
                    <div className="text-slate-500 mb-6">צור תקציב ראשון כדי להתחיל לעקוב אחר ההוצאות</div>
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

    return (
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
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
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {availablePeriods.length > 1 && (
                    <BudgetPeriodSelector
                        periods={availablePeriods}
                        selectedPeriod={selectedPeriod}
                        onSelectPeriod={setSelectedPeriod}
                    />
                )}

            {!relevantPeriod && (
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

            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                <OverallBudgetSummary budget={currentProfileBudget} />
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
                    categories={currentCategoryBudgets}
                    selectedPeriod={selectedPeriod}
                />
            </div>
            </div>
        </div>
    );
}