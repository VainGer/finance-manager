import { useState, useEffect, useMemo } from 'react';
import { get } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export function useProfileBudgetData(profile) {
    const { account } = useAuth();
    const [profileBudgets, setProfileBudgets] = useState([]);
    const [expensesData, setExpensesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState(null);

    useEffect(() => {
        if (!profile || !account) {
            setLoading(false);
            return;
        }
        
        setLoading(true);
        setError(null);
        const fetchData = async () => {
            // זהות נכונה מבסיס הנתונים
                        // Use expenses field if available, otherwise fall back to profile ID
            const expensesId = profile?.expenses || profile?._id;
            const [budgetsResponse, expensesResponse] = await Promise.all([
                get(`budgets/get-profile-budgets?username=${account?.username}&profileName=${profile.profileName}`),
                get(`expenses/profile-expenses/${expensesId}`)
            ]);
            
            // Handle budgets
            if (budgetsResponse.ok) {
                const budgets = budgetsResponse.budgets.budgets || [];
                setProfileBudgets(budgets);
            } else {
                console.error('Failed to fetch budgets:', budgetsResponse);
                setProfileBudgets([]);
            }
            
            // Handle expenses - might not exist for new profiles
            if (expensesResponse.ok) {
                const expenses = expensesResponse.expenses.categories || [];
                setExpensesData(expenses);
            } else if (expensesResponse.status === 404) {
                // New profile - no expenses yet
                console.log('No expenses found for new profile - this is normal');
                setExpensesData([]);
            } else {
                console.error('Failed to fetch expenses:', expensesResponse);
                setExpensesData([]);
            }
            setLoading(false);
        };
        fetchData();
    }, [profile, account]);

    const availablePeriods = useMemo(() => {
        if (!profileBudgets || !Array.isArray(profileBudgets) || profileBudgets.length === 0) return [];
        return profileBudgets.map(budget => ({
            startDate: budget.startDate,
            endDate: budget.endDate
        })).sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
    }, [profileBudgets]);

    const relevantPeriod = useMemo(() => {
        const now = new Date();
        const startDate = new Date(selectedPeriod?.startDate);
        const endDate = new Date(selectedPeriod?.endDate);
        return startDate <= now && now <= endDate;
    }, [selectedPeriod]);

    useEffect(() => {
        if (availablePeriods && availablePeriods.length > 0) {
            const now = new Date();
            const activePeriod = availablePeriods.find(period => {
                const startDate = new Date(period.startDate);
                const endDate = new Date(period.endDate);
                return now >= startDate && now <= endDate;
            });
            setSelectedPeriod(activePeriod || availablePeriods[0]);
        }
    }, [availablePeriods]);

    const { currentProfileBudget, currentCategoryBudgets } = useMemo(() => {
        if (!selectedPeriod) {
            return { currentProfileBudget: null, currentCategoryBudgets: [] };
        }

        const profBudget = profileBudgets.find(budget =>
            budget.startDate === selectedPeriod.startDate && budget.endDate === selectedPeriod.endDate);

        const catBudgets = expensesData.map(cat => {
            const categoryBudgetForPeriod = cat.budgets ? cat.budgets.find(b => b.startDate === selectedPeriod.startDate && b.endDate === selectedPeriod.endDate) : null;

            let spentInPeriod = 0;
            if (categoryBudgetForPeriod) {
                spentInPeriod = categoryBudgetForPeriod.spent;
            } else if (cat.Businesses) {
                cat.Businesses.forEach(business => {
                    if (business.transactions) {
                        business.transactions.forEach(transaction => {
                            const tDate = new Date(transaction.date);
                            if (tDate >= new Date(selectedPeriod.startDate) && tDate <= new Date(selectedPeriod.endDate)) {
                                spentInPeriod += transaction.amount;
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

        return { currentProfileBudget: profBudget, currentCategoryBudgets: catBudgets };

    }, [selectedPeriod, profileBudgets, expensesData]);

    return {
        loading,
        error,
        availablePeriods,
        selectedPeriod,
        setSelectedPeriod,
        relevantPeriod,
        currentProfileBudget,
        currentCategoryBudgets
    };
}
