import { useMemo, useState } from 'react';
import useExpensesDisplay from './useExpensesDisplay';

export default function useExpensesCharts() {
    const [dateFilter, setDateFilter] = useState('all');
    const [selectedMonth, setSelectedMonth] = useState('');
    const {
        expenses,
        allExpenses,
        monthlyExpenses,
        isLoading: loading,
        error,
        availableDates
    } = useExpensesDisplay();

    const filteredByDateExpenses = useMemo(() => {
        if (!allExpenses || !allExpenses.length) return [];
        if (dateFilter === 'all') return allExpenses;

        const now = new Date();

        if (dateFilter === 'specific' && selectedMonth) {
            // Safely access monthlyExpenses with fallbacks
            return monthlyExpenses && monthlyExpenses[selectedMonth] ? 
                [...monthlyExpenses[selectedMonth]] : [];
        }

        const cutoffDate = new Date();

        switch (dateFilter) {
            case 'week':
                cutoffDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                cutoffDate.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                cutoffDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                return allExpenses;
        }

        return allExpenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= cutoffDate && expenseDate <= now;
        });
    }, [allExpenses, monthlyExpenses, dateFilter, selectedMonth]);

    const generateColors = (count) => {
        const colors = [];
        const baseHues = [0, 210, 45, 170, 280, 330];
        for (let i = 0; i < count; i++) {
            const hue = baseHues[i % baseHues.length];
            const adjustedHue = hue + ((Math.floor(i / baseHues.length) * 30) % 60) - 15;
            const saturation = 70 + (i % 3) * 10;
            const lightness = 50 + (i % 2) * 10;
            colors.push(hslToHex(adjustedHue, saturation, lightness));
        }
        return colors;
    };

    const hslToHex = (h, s, l) => {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    };

    const chartData = useMemo(() => {
        if (!filteredByDateExpenses || filteredByDateExpenses.length === 0) {
            return [];
        }
        const categoryTotals = filteredByDateExpenses.reduce((acc, expense) => {
            const category = expense.category || 'ללא קטגוריה';
            if (!acc[category]) {
                acc[category] = 0;
            }
            acc[category] += expense.amount;
            return acc;
        }, {});
        const sortedCategories = Object.entries(categoryTotals)
            .sort(([, amountA], [, amountB]) => amountB - amountA);
        const colors = generateColors(sortedCategories.length);

        return sortedCategories.map(([name, amount], index) => ({
            name: name,
            population: amount,
            color: colors[index],
            legendFontColor: '#7F7F7F',
            legendFontSize: 12
        }));
    }, [filteredByDateExpenses]);

    const totalAmount = useMemo(() => {
        if (!filteredByDateExpenses || filteredByDateExpenses.length === 0) {
            return 0;
        }
        return filteredByDateExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    }, [filteredByDateExpenses]);

    const availableMonths = useMemo(() => {
        if (!availableDates || !Array.isArray(availableDates) || availableDates.length <= 1) return [];
        // Safely map dateYM with validation
        return availableDates
            .filter(dateObj => dateObj && typeof dateObj === 'object' && dateObj.dateYM)
            .map(dateObj => dateObj.dateYM);
    }, [availableDates]);

    const monthlyChartData = useMemo(() => {
        // Validate monthlyExpenses exists and has entries
        if (!monthlyExpenses || typeof monthlyExpenses !== 'object' || Object.keys(monthlyExpenses).length === 0) {
            return [];
        }
        
        try {
            const monthlyData = Object.entries(monthlyExpenses).map(([monthKey, monthTransactions]) => {
                // Validate monthKey format and transactions array
                if (!monthKey || !monthKey.includes('-') || !Array.isArray(monthTransactions)) {
                    return null;
                }
                
                const [year, month] = monthKey.split('-');
                if (!year || !month) {
                    return null;
                }
                
                const formattedKey = `${month}/${year}`;
                // Safely reduce with validation for each transaction
                const amount = monthTransactions.reduce((sum, tx) => {
                    return sum + (tx && typeof tx.amount === 'number' ? tx.amount : 0);
                }, 0);
                
                return { 
                    month: formattedKey, 
                    amount: amount,
                    originalKey: monthKey
                };
            })
            // Filter out any null entries from invalid data
            .filter(item => item !== null);

            // Only sort if we have valid data
            if (monthlyData.length > 0) {
                return monthlyData.sort((a, b) => {
                    return a.originalKey.localeCompare(b.originalKey);
                });
            }
            return [];
        } catch (err) {
            console.error('Error processing monthly chart data:', err);
            return [];
        }
    }, [monthlyExpenses]);


    return {
        expenses,
        loading,
        error,
        filteredByDateExpenses,
        chartData,
        totalAmount,
        monthlyChartData,
        dateFilter,
        setDateFilter,
        selectedMonth,
        availableMonths,
        setSelectedMonth,
        monthlyExpenses
    }
}