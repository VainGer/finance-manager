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

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    if (!currentProfileBudget) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <p className="text-gray-600">לא נמצאו תקציבים לפרופיל זה.</p>
            </div>
        );
    }


    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">💰 תקציב מול הוצאות - {profile.profileName}</h2>
            </div>

            {availablePeriods.length > 1 && (
                <BudgetPeriodSelector
                    periods={availablePeriods}
                    selectedPeriod={selectedPeriod}
                    onSelectPeriod={setSelectedPeriod}
                />
            )}

            {!relevantPeriod && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 my-3" role="alert">
                    <p className="font-bold">לתשומת לבך:</p>
                    <p>התקציב המוצג אינו פעיל לתקופה הנוכחית.</p>
                </div>
            )}

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 my-6">
                <OverallBudgetSummary budget={currentProfileBudget} />
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">📋 פירוט לפי קטגוריות</h3>
                <CategoryBudgetDetails
                    categories={currentCategoryBudgets}
                    selectedPeriod={selectedPeriod}
                />
            </div>
        </div>
    );
}