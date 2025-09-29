import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProfileData } from '../../context/ProfileDataContext';

export default function useBudgetSummary() {
    const { profile } = useAuth();
    const { profileBudgets, categoryBudgets, budgetLoading: contextLoading, errors, fetchBudgets } = useProfileData();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [categorySpendingByPeriod, setCategorySpendingByPeriod] = useState({});


    useEffect(() => {
        setLoading(true);
        if (!profile) {
            setLoading(false);
            return;
        }

        if (errors.length > 0) {
            const budgetErrors = errors.find(e => e.budgetErrors)?.budgetErrors;
            if (budgetErrors && budgetErrors.length > 0) {
                setError(budgetErrors[0]);
            }
        }

        try {
            if (profileBudgets?.length > 0 && categoryBudgets?.length > 0) {
                const budgets = profileBudgets;
                const spendingData = {};
                budgets.forEach(budget => {
                    const periodKey = `${budget.startDate}-${budget.endDate}`;
                    spendingData[periodKey] = {
                        categories: {},
                        totalSpent: budget.spent || 0
                    };
                    categoryBudgets.forEach(category => {
                        const matchingBudget = category.budgets.find(
                            b => b._id === budget._id
                        );
                        if (matchingBudget) {
                            spendingData[periodKey].categories[category.name] = matchingBudget.spent || 0;
                        } else {
                            spendingData[periodKey].categories[category.name] = 0;
                        }
                    });
                });
                setCategorySpendingByPeriod(spendingData);
            }
        } catch (err) {
            console.error('Error processing budget data:', err);
            setError('שגיאה בעיבוד נתוני תקציב');
        } finally {
            setLoading(false);
        }
    }, [profile, profileBudgets, categoryBudgets, errors]);

    const availablePeriods = useMemo(() => {
        if (!profileBudgets?.length) return [];
        return profileBudgets
            .map(budget => ({
                startDate: budget.startDate,
                endDate: budget.endDate
            }))
            .sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
    }, [profileBudgets]);

    const relevantPeriod = useMemo(() => {
        if (!selectedPeriod) return false;

        const now = new Date();
        const startDate = new Date(selectedPeriod.startDate);
        const endDate = new Date(selectedPeriod.endDate);
        return startDate <= now && now <= endDate;
    }, [selectedPeriod]);

    useEffect(() => {
        if (availablePeriods?.length && !selectedPeriod) {
            const now = new Date();
            const currentPeriod = availablePeriods.find(period => {
                const startDate = new Date(period.startDate);
                const endDate = new Date(period.endDate);
                return now >= startDate && now <= endDate;
            });

            setSelectedPeriod(currentPeriod || availablePeriods[0]);
        }
    }, [availablePeriods, selectedPeriod]);

    const { currentProfileBudget, currentCategoryBudgets } = useMemo(() => {
        if (!selectedPeriod || !profileBudgets?.length || !Object.keys(categorySpendingByPeriod).length) {
            return { currentProfileBudget: null, currentCategoryBudgets: [] };
        }

        const profileBudget = profileBudgets.find(
            budget => budget.startDate === selectedPeriod.startDate &&
                budget.endDate === selectedPeriod.endDate
        );

        const periodKey = `${selectedPeriod.startDate}-${selectedPeriod.endDate}`;
        const periodData = categorySpendingByPeriod[periodKey] || { categories: {} };

        const categoryBudgetData = categoryBudgets.map(category => {
            const categoryBudget = category.budgets.find(
                budget => budget.startDate === selectedPeriod.startDate &&
                    budget.endDate === selectedPeriod.endDate
            );
            const spent = periodData.categories[category.name] || 0;
            return {
                name: category.name,
                budget: categoryBudget?.amount || null,
                spent: spent
            };
        });

        return {
            currentProfileBudget: profileBudget,
            currentCategoryBudgets: categoryBudgetData
        };
    }, [selectedPeriod, profileBudgets, categoryBudgets, categorySpendingByPeriod]);

    const isLoading = contextLoading || loading;

    return {
        loading: isLoading,
        error,
        availablePeriods,
        selectedPeriod,
        setSelectedPeriod,
        relevantPeriod,
        currentProfileBudget,
        currentCategoryBudgets,
        refetchBudgets: fetchBudgets
    };
}
