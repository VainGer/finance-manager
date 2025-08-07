import React from 'react';
import { formatCurrency, getProgressPercentage, getProgressBarPercentage, getProgressColor } from '../../../utils/budgetUtils';

export default function OverallBudgetSummary({ budget }) {
    if (!budget) return null;

    const totalBudget = budget.amount || 0;
    const totalSpent = budget.spent || 0;

    return (
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
    );
}
