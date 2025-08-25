import { useCallback, useEffect, useMemo, useState } from 'react';
import { get } from '../../utils/api';

export default function useExpensesDisplay({ profile }) {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [dateFilteredExpenses, setDateFilteredExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        category: 'all',
        business: 'all',
        sortBy: 'date',
        sortOrder: 'desc'
    });
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
    const [showDateFilter, setShowDateFilter] = useState(false);

    const fetchExpenses = useCallback(async () => {
        setLoading(true);
        setError(null);
        const expensesId = profile.expenses;
        const response = await get(`expenses/profile-expenses/${expensesId}`);
        if (response.ok && response.expenses) {
            const realExpenses = [];
            const expensesData = response.expenses;
            if (expensesData.categories) {
                expensesData.categories.forEach(category => {
                    if (category.Businesses) {
                        category.Businesses.forEach(business => {
                            if (business.transactions) {
                                business.transactions.forEach(transaction => {
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
            setExpenses(realExpenses);
        } else {
            setError(response.message || 'שגיאה בטעינת הנתונים');
        }

        setLoading(false);
    }, [profile]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    useEffect(() => {
        let filtered = [...expenses];

        if (filters.category !== 'all') {
            filtered = filtered.filter(expense => expense.category === filters.category);
        }

        if (filters.business !== 'all') {
            filtered = filtered.filter(expense => expense.business === filters.business);
        }
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
        refetchExpenses: fetchExpenses,

        expenses,
        dateRange,
        setDateRange,
        showDateFilter,
        setShowDateFilter,
        resetDateFilter,

        summary
    };
}
