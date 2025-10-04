import { useCallback, useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProfileData } from '../../context/ProfileDataContext';
import { monthToHebrewName } from '../../utils/formatters';
import useChildrenData from './useChildrenData';

export default function useExpensesDisplay() {
    const { profile } = useAuth();
    const {
        expenses: contextExpenses,
        expensesLoading,
        errors: contextErrors,
    } = useProfileData();

    const { children,
        loading: childrenLoading,
        error: childrenError,
        childrenExpenses,
        selectedChild,
        setSelectedChild,
        childrenCategories,
        childrenBusinesses, } = useChildrenData();

    const [allExpenses, setAllExpenses] = useState(null);
    const [monthlyExpenses, setMonthlyExpenses] = useState({});
    const [availableDates, setAvailableDates] = useState([]);
    const [sortedExpenses, setSortedExpenses] = useState(null);
    const [filteredExpenses, setFilteredExpenses] = useState(null);
    const [stagedFilters, setStagedFilters] = useState({ month: null, category: null, business: null });
    const [appliedFilters, setAppliedFilters] = useState({ month: null, category: null, business: null });
    const [loading, setLoading] = useState(true);
    const [availableBusinesses, setAvailableBusinesses] = useState([]);

    useEffect(() => {
        if (sortedExpenses) {
            applyAllFilters();
        }
    }, [sortedExpenses, applyAllFilters]);

    useEffect(() => {
        if (!expensesLoading) {
            processExpensesData();
        } else {
            setLoading(true);
        }
    }, [processExpensesData, contextExpenses, expensesLoading, profile]);

    useEffect(() => {
        sortByDate(true, true);
    }, [allExpenses, monthlyExpenses]);

    const processExpensesData = useCallback(() => {
        setLoading(true);
        if (!profile || !contextExpenses) {
            setAllExpenses([]);
            setLoading(false);
            return;
        }

        try {
            const {
                expensesFlat: realExpenses,
                monthlyMap: monthlyExpenses,
                dates: datesSet
            } = flattenExpenses(contextExpenses);
            sortAvailableDates(datesSet);
            setAllExpenses(realExpenses);
            setMonthlyExpenses(monthlyExpenses);
        } catch (err) {
            console.error('Error processing expenses data:', err);
        } finally {
            setLoading(false);
        }
    }, [contextExpenses, profile]);

    const flattenExpenses = (expenses) => {
        const expensesFlat = [];
        const monthlyMap = {};
        const dates = new Set();
        expenses.forEach((category) =>
            category.Businesses?.forEach((business) =>
                business.transactionsArray?.forEach(({ dateYM, transactions }) => {
                    transactions?.forEach((transaction) => {
                        const processed = {
                            _id: transaction._id,
                            amount: Number(transaction.amount),
                            date: new Date(transaction.date),
                            description: transaction.description,
                            category: category.name,
                            business: business.name,
                            dateYM,
                        };
                        expensesFlat.push(processed);
                        (monthlyMap[dateYM] ??= []).push(processed);
                        dates.add(dateYM);
                    });
                })
            )
        );
        return { expensesFlat, monthlyMap, dates };
    };

    const applyAllFilters = useCallback(() => {
        if (!sortedExpenses) return;

        setAppliedFilters({ ...stagedFilters });

        const { month, category, business } = stagedFilters;
        let result;
        if (month && monthlyExpenses[month]) {
            result = [...monthlyExpenses[month]];
        } else {
            result = sortedExpenses;
        }

        if (category) {
            result = result.filter(exp => exp.category === category);

            const businessesInCategory = [...new Set(
                result.map(exp => exp.business)
            )].filter(Boolean);

            setAvailableBusinesses(businessesInCategory);
        } else {
            const allBusinesses = [...new Set(
                sortedExpenses.map(exp => exp.business)
            )].filter(Boolean);

            setAvailableBusinesses(allBusinesses);
        }

        if (business) {
            result = result.filter(exp => exp.business === business);
        }

        setFilteredExpenses(result);
    }, [stagedFilters, sortedExpenses, monthlyExpenses]);

    const sortByDate = (descending = true, all = true) => {
        if (all) {
            if (!allExpenses || allExpenses.length === 0) { setSortedExpenses([]); return; }
            const sorted = [...allExpenses].sort((a, b) => descending ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date));
            setSortedExpenses(sorted);
        } else {
            if (!monthlyExpenses || Object.keys(monthlyExpenses).length === 0) { setSortedExpenses([]); return; }
            const monthKeys = Object.keys(monthlyExpenses);
            const sorted = [];
            monthKeys.forEach(monthKey => {
                const monthExpenses = monthlyExpenses[monthKey];
                const monthSorted = [...monthExpenses].sort((a, b) => descending ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date));
                sorted.push(...monthSorted);
            });
            setSortedExpenses(sorted);
        }

        if (appliedFilters.month || appliedFilters.category || appliedFilters.business) {
            applyAllFilters();
        }
    };

    const sortByAmount = (descending = true, all = true) => {
        if (all) {
            if (!allExpenses || allExpenses.length === 0) { setSortedExpenses([]); return; }
            const sorted = [...allExpenses].sort((a, b) => descending ? b.amount - a.amount : a.amount - b.amount);
            setSortedExpenses(sorted);
        } else {
            if (!monthlyExpenses || Object.keys(monthlyExpenses).length === 0) { setSortedExpenses([]); return; }
            const monthKeys = Object.keys(monthlyExpenses);
            const sorted = [];
            monthKeys.forEach(monthKey => {
                const monthExpenses = monthlyExpenses[monthKey];
                const monthSorted = [...monthExpenses].sort((a, b) => descending ? b.amount - a.amount : a.amount - b.amount);
                sorted.push(...monthSorted);
            });
            setSortedExpenses(sorted);
        }

        if (appliedFilters.month || appliedFilters.category || appliedFilters.business) {
            applyAllFilters();
        }
    };

    const filterByMonth = (month) => {
        setStagedFilters(prev => {
            const newFilters = { ...prev, month };
            return newFilters;
        });
    };

    const filterByCategory = (category) => {
        setStagedFilters(prev => ({ ...prev, category, business: null }));
    };

    const filterByBusiness = (business) => {
        setStagedFilters(prev => ({ ...prev, business }));
    };

    const clearFilters = () => {
        setStagedFilters({ month: null, category: null, business: null });
        setAppliedFilters({ month: null, category: null, business: null });
        sortByDate(true, true);
    };

    const sortAvailableDates = (datesSet) => {
        const sortedDates = Array.from(datesSet)
            .map(dateYM => {
                const [year, month] = dateYM.split('-');
                return {
                    year: parseInt(year),
                    yearStr: year,
                    monthNum: parseInt(month),
                    monthStr: month,
                    month: monthToHebrewName(month),
                    dateYM: dateYM // Include the original dateYM for filtering
                };
            }).sort((a, b) => {
                if (a.year !== b.year) {
                    return b.year - a.year;
                }
                return b.monthNum - a.monthNum;
            }).map(({ year, month, dateYM }) => ({
                year: year.toString(),
                month,
                dateYM
            }))
        setAvailableDates(sortedDates);
    }

    const error = useMemo(() => {
        const expenseErrors = contextErrors.find(e => e.expensesErrors)?.expensesErrors;
        if (expenseErrors && expenseErrors.length > 0) {
            return expenseErrors[0];
        }
        return null;
    }, [contextErrors]);


    return {
        expenses: filteredExpenses || sortedExpenses,
        allExpenses,
        monthlyExpenses,
        isLoading: loading,
        error: error,
        availableDates,
        availableBusinesses,
        sortByDate,
        sortByAmount,
        filterByMonth,
        filterByCategory,
        filterByBusiness,
        clearFilters,
        applyFilters: applyAllFilters,
        stagedFilters,
        appliedFilters,
    };
};
