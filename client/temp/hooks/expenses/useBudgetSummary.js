import { useCallback, useEffect, useMemo, useState } from 'react';
import { get } from '../../utils/api';
export default function useBudgetSummary({ profile }) {
    const [profileBudgets, setProfileBudgets] = useState([]);
    const [expensesData, setExpensesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [categorySpendingByPeriod, setCategorySpendingByPeriod] = useState({});

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        const [budgetsResponse, expensesResponse] = await Promise.all([
            get(`budgets/get-budgets?username=${profile.username}&profileName=${profile.profileName}`),
            get(`expenses/profile-expenses/${profile.expenses}`)
        ]);

        if (budgetsResponse.ok && expensesResponse.ok) {
            const budgets = budgetsResponse.budgets || [];
            const expenses = expensesResponse.expenses.categories || [];

            const spendingData = calculateCategorySpending(expenses, budgets);
            setProfileBudgets(budgets);
            setExpensesData(expenses);
            setCategorySpendingByPeriod(spendingData);
        } else {
            setError('שגיאה בטעינת נתונים, נסה שנית');
        }

        setLoading(false);
    }, [profile]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    function calculateCategorySpending(categories, budgetPeriods) {
        const result = {};

        budgetPeriods.forEach(budget => {
            const periodKey = `${budget.startDate}-${budget.endDate}`;
            result[periodKey] = { categories: {} };
        });

        categories.forEach(category => {
            const transactions = category.Businesses?.flatMap(
                business => business.transactions || []
            ) || [];

            budgetPeriods.forEach(budget => {
                const periodKey = `${budget.startDate}-${budget.endDate}`;
                const startDate = new Date(budget.startDate);
                const endDate = new Date(budget.endDate);

                const categorySpent = transactions.reduce((total, transaction) => {
                    const txDate = new Date(transaction.date);
                    return (txDate >= startDate && txDate <= endDate)
                        ? total + transaction.amount
                        : total;
                }, 0);

                result[periodKey].categories[category.name] = categorySpent;
            });
        });

        return result;
    }

    const availablePeriods = useMemo(() => {
        if (!profileBudgets?.length) return [];

        return profileBudgets
            .map(budget => {
                return {
                    startDate: budget.startDate,
                    endDate: budget.endDate
                };
            })
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
        if (availablePeriods?.length) {
            const now = new Date();
            const currentPeriod = availablePeriods.find(period => {
                const startDate = new Date(period.startDate);
                const endDate = new Date(period.endDate);
                return now >= startDate && now <= endDate;
            });

            setSelectedPeriod(currentPeriod || availablePeriods[0]);
        }
    }, [availablePeriods]);

    const { currentProfileBudget, currentCategoryBudgets } = useMemo(() => {
        if (!selectedPeriod || !Object.keys(categorySpendingByPeriod).length) {
            return { currentProfileBudget: null, currentCategoryBudgets: [] };
        }

        const profileBudget = profileBudgets.find(
            budget => budget.startDate === selectedPeriod.startDate &&
                budget.endDate === selectedPeriod.endDate
        );

        const periodKey = `${selectedPeriod.startDate}-${selectedPeriod.endDate}`;
        const periodData = categorySpendingByPeriod[periodKey] || { categories: {} };

        const categoryBudgets = expensesData.map(category => {
            const categoryBudget = category.budgets?.find(
                budget => budget.startDate === selectedPeriod.startDate &&
                    budget.endDate === selectedPeriod.endDate
            );

            const spent = periodData.categories[category.name] || 0;

            return {
                name: category.name,
                budget: categoryBudget?.amount || null,
                spent
            };
        });

        return {
            currentProfileBudget: profileBudget,
            currentCategoryBudgets: categoryBudgets
        };
    }, [selectedPeriod, profileBudgets, expensesData, categorySpendingByPeriod]);

    return {
        loading,
        error,
        availablePeriods,
        selectedPeriod,
        setSelectedPeriod,
        relevantPeriod,
        currentProfileBudget,
        currentCategoryBudgets,
        refetchBudgets: fetchData
    };
}
