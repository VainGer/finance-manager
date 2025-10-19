import { useCallback, useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProfileData } from '../../context/ProfileDataContext';
import { monthToHebrewName } from '../../utils/formatters';
import useChildrenData from './useChildrenData';

export default function useExpensesDisplay() {
    const { profile } = useAuth();
    const { expenses: contextExpenses, expensesLoading, errors: contextErrors } = useProfileData();
    const {
        children,
        loading: childrenLoading,
        error: childrenError,
        childrenExpenses,
        selectedChild,
        setSelectedChild,
        childrenCategories,
        childrenBusinesses,
    } = useChildrenData();

    const [allExpenses, setAllExpenses] = useState([]);
    const [monthlyExpenses, setMonthlyExpenses] = useState({});
    const [availableDates, setAvailableDates] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [stagedFilters, setStagedFilters] = useState({ month: null, category: null, business: null });
    const [appliedFilters, setAppliedFilters] = useState({ month: null, category: null, business: null });
    const [availableBusinesses, setAvailableBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [firstLoad, setFirstLoad] = useState(true);

    const processExpensesData = useCallback(async () => {
        setLoading(true);
        if (!profile || !contextExpenses) {
            setAllExpenses([]);
            setLoading(false);
            return;
        }

        try {
            const { expensesFlat, monthlyMap, dates } = flattenExpenses(contextExpenses);
            sortAvailableDates(dates);
            setAllExpenses(expensesFlat);
            setMonthlyExpenses(monthlyMap);
        } catch (err) {
            console.error('Error processing expenses data:', err);
        } finally {
            setLoading(false);
        }
    }, [contextExpenses, profile]);

    useEffect(() => {
        if (!selectedChild && !expensesLoading) processExpensesData();
    }, [selectedChild, contextExpenses, expensesLoading, processExpensesData]);

    useEffect(() => {
        const isReady =
            (!selectedChild && !expensesLoading && Object.keys(monthlyExpenses).length > 0) ||
            (selectedChild && !childrenLoading && Object.keys(monthlyExpenses).length > 0);

        if (!isReady) return;

        if (firstLoad) {
            setFirstLoad(false);
            const all = Object.values(monthlyExpenses).flat();
            setFilteredExpenses(all);
            return;
        }

        const latestMonth = availableDates[0]?.dateYM;
        if (latestMonth) {
            setStagedFilters({ month: latestMonth, category: null, business: null });
            setAppliedFilters({ month: latestMonth, category: null, business: null });
            applyAllFilters('date', true);
        }
    }, [
        selectedChild,
        expensesLoading,
        childrenLoading,
        monthlyExpenses,
        availableDates,
        applyAllFilters,
    ]);

    useEffect(() => {
        if (!selectedChild) return;
        if (!childrenLoading && childrenExpenses?.length > 0) {
            const { expensesFlat, monthlyMap, dates } = flattenExpenses(childrenExpenses);
            sortAvailableDates(dates);
            setAllExpenses(expensesFlat);
            setMonthlyExpenses(monthlyMap);
            setLoading(false);
        } else setLoading(true);
    }, [selectedChild, childrenLoading, childrenExpenses]);

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

    const applyAllFilters = useCallback(
        (sortType = null, descending = true) => {
            const { month, category, business } = stagedFilters;
            if (!month || !monthlyExpenses[month]) return setFilteredExpenses([]);

            let result = [...monthlyExpenses[month]];
            if (category) result = result.filter((exp) => exp.category === category);
            if (business) result = result.filter((exp) => exp.business === business);

            if (sortType === 'amount') {
                result.sort((a, b) => (descending ? b.amount - a.amount : a.amount - b.amount));
            } else if (sortType === 'date' || !sortType) {
                result.sort((a, b) =>
                    descending ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)
                );
            }

            setAppliedFilters({ ...stagedFilters });
            setFilteredExpenses(result);

            const allBusinesses = [...new Set(result.map((exp) => exp.business))].filter(Boolean);
            setAvailableBusinesses(allBusinesses);
        },
        [stagedFilters, monthlyExpenses]
    );

    const sortByDate = (descending = true) => {
        const month = stagedFilters.month || appliedFilters.month;
        if (!month || !monthlyExpenses[month]) return;
        applyAllFilters('date', descending);
    };

    const sortByAmount = (descending = true) => {
        const month = stagedFilters.month || appliedFilters.month;
        if (!month || !monthlyExpenses[month]) return;
        applyAllFilters('amount', descending);
    };

    const filterByMonth = (month) => setStagedFilters((prev) => ({ ...prev, month }));
    const filterByCategory = (category) =>
        setStagedFilters((prev) => ({ ...prev, category, business: null }));
    const filterByBusiness = (business) => setStagedFilters((prev) => ({ ...prev, business }));

    const clearFilters = () => {
        const latestMonth = availableDates.length > 0 ? availableDates[0].dateYM : null;
        setStagedFilters({ month: latestMonth, category: null, business: null });
        setAppliedFilters({ month: latestMonth, category: null, business: null });

        if (latestMonth && monthlyExpenses[latestMonth]) {
            const sorted = [...monthlyExpenses[latestMonth]].sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );
            setFilteredExpenses(sorted);
        } else setFilteredExpenses([]);
    };

    const sortAvailableDates = (datesSet) => {
        const sortedDates = Array.from(datesSet)
            .map((dateYM) => {
                const [year, month] = dateYM.split('-');
                return {
                    year: parseInt(year),
                    monthNum: parseInt(month),
                    month: monthToHebrewName(month),
                    dateYM,
                };
            })
            .sort((a, b) => (a.year !== b.year ? b.year - a.year : b.monthNum - a.monthNum))
            .map(({ year, month, dateYM }) => ({ year: year.toString(), month, dateYM }));
        setAvailableDates(sortedDates);
    };

    const error = useMemo(() => {
        const expenseErrors = contextErrors.find((e) => e.expensesErrors)?.expensesErrors;
        return expenseErrors && expenseErrors.length > 0 ? expenseErrors[0] : null;
    }, [contextErrors]);

    return {
        expenses: filteredExpenses,
        allExpenses,
        monthlyExpenses,
        isLoading: loading,
        error,
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
        childrenProps: {
            children,
            loading: childrenLoading,
            error: childrenError,
            childrenExpenses,
            selectedChild,
            setSelectedChild,
            childrenCategories,
            childrenBusinesses,
        },
    };
}
