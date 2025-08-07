import React from 'react';
import { formatDate, formatCurrency, getProgressPercentage, getProgressBarPercentage, getProgressColor } from '../../../utils/budgetUtils';

const BudgetStatus = ({ progressPercentage }) => (
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
);

export default function CategoryBudgetDetails({ categories, selectedPeriod }) {
    return (
        <div className="space-y-4">
            {categories.map((category, index) => {
                const budgetAmount = category.budget || 0;
                const categorySpent = category.spent || 0;
                const progressPercentage = getProgressPercentage(categorySpent, budgetAmount);
                const progressBarPercentage = getProgressBarPercentage(categorySpent, budgetAmount);

                return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-lg font-semibold text-gray-800">{category.name}</h4>
                            <div className="text-sm text-gray-500">
                                {selectedPeriod && (
                                    <span>{formatDate(selectedPeriod.startDate)} - {formatDate(selectedPeriod.endDate)}</span>
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

                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className={`h-3 rounded-full ${getProgressColor(progressBarPercentage)}`}
                                style={{ width: `${progressBarPercentage}%` }}
                            ></div>
                        </div>

                        <BudgetStatus progressPercentage={progressPercentage} />
                    </div>
                );
            })}
        </div>
    );
}
