import { useState, useEffect, useMemo, useCallback } from 'react';
import { useProfileData } from '../context/ProfileDataContext';

export default function useExpensesDisplay(profile) {
    const { 
        expenses: expensesFromContext, 
        expensesLoading, 
        errors 
    } = useProfileData();
    
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [dateFilteredExpenses, setDateFilteredExpenses] = useState([]);
    const loading = expensesLoading;
    const error = errors.find(e => e.expensesErrors)?.expensesErrors?.[0];
    const [filters, setFilters] = useState({
        category: 'all',
        business: 'all',
        sortBy: 'date',
        sortOrder: 'desc'
    });
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
    const [showDateFilter, setShowDateFilter] = useState(false);

    // Process expenses from context
    useEffect(() => {
        if (expensesFromContext && expensesFromContext.length > 0) {
            const realExpenses = [];
            expensesFromContext.forEach(category => {
                if (category.Businesses) {
                    category.Businesses.forEach(business => {
                        if (business.transactionsArray) {
                            business.transactionsArray.forEach(transactionGroup => {
                                if (transactionGroup.transactions) {
                                    transactionGroup.transactions.forEach(transaction => {
                                        realExpenses.push({
                                            _id: transaction._id,
                                            amount: Number(transaction.amount),
                                            date: transaction.date,
                                            description: transaction.description,
                                            category: category.name,
                                            business: business.name
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            });
            setExpenses(realExpenses);
        } else {
            setExpenses([]);
        }
    }, [expensesFromContext]);

    useEffect(() => {
        let filtered = [...expenses];

        // Filter by category
        if (filters.category !== 'all') {
            filtered = filtered.filter(expense => expense.category === filters.category);
        }

        // Filter by business
        if (filters.business !== 'all') {
            filtered = filtered.filter(expense => expense.business === filters.business);
        }

        // Sort
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (filters.sortBy) {
                case 'amount':
                    aValue = a.amount;
                    bValue = b.amount;
                    break;
                case 'date':
                    aValue = new Date(a.date);
                    bValue = new Date(b.date);
                    break;
                case 'description':
                    // Ensure description is a string for sorting
                    aValue = a.description?.toLowerCase() || '';
                    bValue = b.description?.toLowerCase() || '';
                    break;
                default:
                    aValue = new Date(a.date);
                    bValue = new Date(b.date);
            }

            if (filters.sortOrder === 'asc') {
                if (aValue < bValue) return -1;
                if (aValue > bValue) return 1;
                return 0;
            } else {
                if (aValue > bValue) return -1;
                if (aValue < bValue) return 1;
                return 0;
            }
        });
        setFilteredExpenses(filtered);
    }, [expenses, filters]);

    const categories = useMemo(() => {
        const allCategories = expenses.map(e => e.category);
        return ['all', ...new Set(allCategories)];
    }, [expenses]);

    const businesses = useMemo(() => {
        const allBusinesses = expenses.map(e => e.business);
        return ['all', ...new Set(allBusinesses)];
    }, [expenses]);


    useEffect(() => {
        if (!dateRange.startDate || !dateRange.endDate) {
            setDateFilteredExpenses(filteredExpenses);
            return;
        }

        const start = new Date(dateRange.startDate);
        const end = new Date(dateRange.endDate);
        end.setHours(23, 59, 59, 999); // Include the entire end date

        const filtered = filteredExpenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= start && expenseDate <= end;
        });

        setDateFilteredExpenses(filtered);
    }, [filteredExpenses, dateRange]);


    useEffect(() => {
        if (expenses.length > 0 && (!dateRange.startDate || !dateRange.endDate)) {
            let earliest = new Date();
            let latest = new Date(0);

            expenses.forEach(expense => {
                const expenseDate = new Date(expense.date);
                if (expenseDate < earliest) earliest = expenseDate;
                if (expenseDate > latest) latest = expenseDate;
            });

            setDateRange({
                startDate: earliest.toISOString().split('T')[0],
                endDate: latest.toISOString().split('T')[0]
            });
        }
    }, [expenses]);

    const calculateSummary = useCallback(() => {
        const expensesToUse = dateFilteredExpenses;
        const totalAmount = expensesToUse.reduce((sum, expense) => sum + expense.amount, 0);

        const categoryTotals = expensesToUse.reduce((acc, expense) => {
            if (!acc[expense.category]) {
                acc[expense.category] = 0;
            }
            acc[expense.category] += expense.amount;
            return acc;
        }, {});

        const businessTotals = expensesToUse.reduce((acc, expense) => {
            if (!acc[expense.business]) {
                acc[expense.business] = 0;
            }
            acc[expense.business] += expense.amount;
            return acc;
        }, {});

        return {
            totalAmount,
            categoryTotals,
            businessTotals,
            transactionCount: expensesToUse.length
        };
    }, [dateFilteredExpenses]);


    const resetDateFilter = useCallback(() => {
        if (expenses.length > 0) {
            let earliest = new Date();
            let latest = new Date(0);

            expenses.forEach(expense => {
                const expenseDate = new Date(expense.date);
                if (expenseDate < earliest) earliest = expenseDate;
                if (expenseDate > latest) latest = expenseDate;
            });

            setDateRange({
                startDate: earliest.toISOString().split('T')[0],
                endDate: latest.toISOString().split('T')[0]
            });
        }
    }, [expenses]);


    const expensesForConsumption = dateFilteredExpenses;

    const summary = useMemo(() => calculateSummary(), [calculateSummary]);

    return {
        filteredExpenses: expensesForConsumption,
        loading,
        error,
        filters,
        setFilters,
        categories,
        businesses,
        refetchExpenses: () => {}, // No longer needed since data comes from context

        expenses,
        dateRange,
        setDateRange,
        showDateFilter,
        setShowDateFilter,
        resetDateFilter,

        summary
    };
}