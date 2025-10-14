import { useCallback, useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProfileData } from '../../context/ProfileDataContext';
import useChildrenData from './useChildrenData';


const monthToHebrewName = (month) => {
    const monthNames = {
        '01': 'ינואר', '02': 'פברואר', '03': 'מרץ', '04': 'אפריל',
        '05': 'מאי', '06': 'יוני', '07': 'יולי', '08': 'אוגוסט',
        '09': 'ספטמבר', '10': 'אוקטובר', '11': 'נובמבר', '12': 'דצמבר'
    };
    return monthNames[month] || month;
};

export default function useExpensesDisplay() {
    const { profile } = useAuth();
    const {
        expenses: contextExpenses,
        expensesLoading,
        errors: contextErrors,
        fetchExpenses,
        categories,
        businesses
    } = useProfileData();

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
    const [sortedExpenses, setSortedExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [stagedFilters, setStagedFilters] = useState({ month: null, category: null, business: null });
    const [appliedFilters, setAppliedFilters] = useState({ month: null, category: null, business: null });
    const [availableBusinesses, setAvailableBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);

    const error = useMemo(() => {
        const expenseErrors = contextErrors.find(e => e.expensesErrors)?.expensesErrors;
        return expenseErrors?.[0] || null;
    }, [contextErrors]);


    const flattenExpenses = (expenses) => {
        const flat = [];
        const monthlyMap = {};
        const dates = new Set();

        expenses.forEach(category =>
            category.Businesses?.forEach(business =>
                business.transactionsArray?.forEach(({ dateYM, transactions }) => {
                    transactions?.forEach(transaction => {
                        const processed = {
                            _id: transaction._id,
                            amount: Number(transaction.amount),
                            date: new Date(transaction.date),
                            description: transaction.description,
                            category: category.name,
                            business: business.name,
                            dateYM,
                        };
                        flat.push(processed);
                        (monthlyMap[dateYM] ??= []).push(processed);
                        dates.add(dateYM);
                    });
                })
            )
        );

        return { flat, monthlyMap, dates };
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
                    dateYM
                };
            })
            .sort((a, b) => (a.year !== b.year ? b.year - a.year : b.monthNum - a.monthNum))
            .map(({ year, month, dateYM }) => ({
                year: year.toString(),
                month,
                dateYM
            }));

        setAvailableDates(sortedDates);
    };

    const processExpensesData = useCallback((sourceExpenses) => {
        if (!profile || !sourceExpenses) {
            setAllExpenses([]);
            setMonthlyExpenses({});
            setAvailableDates([]);
            setSortedExpenses([]);
            setFilteredExpenses([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const { flat, monthlyMap, dates } = flattenExpenses(sourceExpenses);
        sortAvailableDates(dates);
        setAllExpenses(flat);
        setMonthlyExpenses(monthlyMap);
        setLoading(false);
    }, [profile]);


    useEffect(() => {
        if (selectedChild) {
            if (!childrenLoading && childrenExpenses?.length > 0) {
                processExpensesData(childrenExpenses);
            } else if (childrenLoading) {
                setLoading(true);
            }
        } else {
            if (!expensesLoading) {
                processExpensesData(contextExpenses);
            } else if (expensesLoading) {
                setLoading(true);
            }
        }
    }, [selectedChild, childrenLoading, childrenExpenses, contextExpenses, expensesLoading, processExpensesData]);


    useEffect(() => {
        sortByDate(true, true);
    }, [allExpenses, monthlyExpenses]);


    const sortByDate = (descending = true, all = true) => {
        let sorted = [];

        if (all) {
            sorted = [...allExpenses].sort((a, b) =>
                descending ? b.date - a.date : a.date - b.date
            );
        } else {
            Object.keys(monthlyExpenses).forEach(monthKey => {
                const monthSorted = [...monthlyExpenses[monthKey]].sort((a, b) =>
                    descending ? b.date - a.date : a.date - b.date
                );
                sorted.push(...monthSorted);
            });
        }

        setSortedExpenses(sorted);
        if (appliedFilters.month || appliedFilters.category || appliedFilters.business) {
            applyAllFilters();
        }
    };

    const sortByAmount = (descending = true, all = true) => {
        let sorted = [];

        if (all) {
            sorted = [...allExpenses].sort((a, b) =>
                descending ? b.amount - a.amount : a.amount - b.amount
            );
        } else {
            Object.keys(monthlyExpenses).forEach(monthKey => {
                const monthSorted = [...monthlyExpenses[monthKey]].sort((a, b) =>
                    descending ? b.amount - a.amount : a.amount - b.amount
                );
                sorted.push(...monthSorted);
            });
        }

        setSortedExpenses(sorted);
        if (appliedFilters.month || appliedFilters.category || appliedFilters.business) {
            applyAllFilters();
        }
    };


    const applyAllFilters = useCallback(() => {
        if (!sortedExpenses) return;

        const { month, category, business } = stagedFilters;
        setAppliedFilters({ ...stagedFilters });

        let result = month && monthlyExpenses[month]
            ? [...monthlyExpenses[month]]
            : [...sortedExpenses];

        if (category) {
            result = result.filter(exp => exp.category === category);
            setAvailableBusinesses([...new Set(result.map(exp => exp.business))].filter(Boolean));
        } else {
            setAvailableBusinesses([...new Set(sortedExpenses.map(exp => exp.business))].filter(Boolean));
        }

        if (business) {
            result = result.filter(exp => exp.business === business);
        }

        setFilteredExpenses(result);
    }, [stagedFilters, sortedExpenses, monthlyExpenses]);

    const filterByMonth = (month) => setStagedFilters(prev => ({ ...prev, month }));
    const filterByCategory = (category) => setStagedFilters(prev => ({ ...prev, category, business: null }));
    const filterByBusiness = (business) => setStagedFilters(prev => ({ ...prev, business }));

    const clearFilters = () => {
        setStagedFilters({ month: null, category: null, business: null });
        setAppliedFilters({ month: null, category: null, business: null });
        sortByDate(true, true);
    };


    return {
        expenses: filteredExpenses.length > 0 ? filteredExpenses : sortedExpenses,
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
        refetchExpenses: fetchExpenses,
        categories,
        businesses,
        childrenProps: {
            children,
            loading: childrenLoading,
            error: childrenError,
            childrenExpenses,
            selectedChild,
            setSelectedChild,
            childrenCategories,
            childrenBusinesses,
        }
    };
}
