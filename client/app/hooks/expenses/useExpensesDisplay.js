import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProfileData } from '../../context/ProfileDataContext';
import { monthToHebrewName } from '../../utils/formatters';

export default function useExpensesDisplay() {
    const { profile } = useAuth();
    const {
        expenses: contextExpenses,
        expensesLoading,
        errors: contextErrors,
        categories: contextCategories,
        businesses: contextBusinesses
    } = useProfileData();

    const [allExpenses, setAllExpenses] = useState(null);
    const [monthlyExpenses, setMonthlyExpenses] = useState({});
    const [processingData, setProcessingData] = useState(false);
    const [availableDates, setAvailableDates] = useState([]);
    const [sortedExpenses, setSortedExpenses] = useState(null);
    const [filteredExpenses, setFilteredExpenses] = useState(null);
    const [stagedFilters, setStagedFilters] = useState({ month: null, category: null, business: null });
    const [appliedFilters, setAppliedFilters] = useState({ month: null, category: null, business: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [availableBusinesses, setAvailableBusinesses] = useState([]);

    const isLoading = expensesLoading || processingData;

    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading]);

    useEffect(() => {
        if (sortedExpenses) {
            applyAllFilters();
        }
    }, [sortedExpenses, applyAllFilters]);

    useEffect(() => {
        processExpensesData();
    }, [processExpensesData, contextExpenses, contextErrors, profile]);

    useEffect(() => {
        sortByDate(true, true);
    }, [allExpenses, monthlyExpenses]);

    const processExpensesData = useCallback(() => {
        setProcessingData(true);
        if (!profile) {
            setAllExpenses([]);
            setError(null);
            setProcessingData(false);
            return;
        }

        const expenseErrors = contextErrors.find(e => e.expensesErrors)?.expensesErrors;
        if (expenseErrors && expenseErrors.length > 0) {
            setError(expenseErrors[0]);
        } else {
            setError(null);
        }

        try {
            const realExpenses = [];
            const monthlyExpenses = {};
            const datesSet = new Set();
            contextExpenses?.categories?.forEach(category =>
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

                            realExpenses.push(processed);
                            (monthlyExpenses[dateYM] ??= []).push(processed);
                            datesSet.add(dateYM);
                        });
                    })
                )
            );
            sortAvailableDates(datesSet);
            setAllExpenses(realExpenses);
            setMonthlyExpenses(monthlyExpenses);
        } catch (err) {
            console.error('Error processing expenses data:', err);
            setError('שגיאה בעיבוד נתוני ההוצאות');
            setProcessingData(false);
        } finally {
            setProcessingData(false);
        }
    }, [contextExpenses, contextErrors, profile]);

    const applyAllFilters = useCallback(() => {
        if (!sortedExpenses) return;

        // Apply the staged filters
        setAppliedFilters({...stagedFilters});
        
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



    return {
        expenses: filteredExpenses || sortedExpenses,
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
    };
};

