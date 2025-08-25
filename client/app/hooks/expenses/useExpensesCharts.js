import { useMemo, useState } from 'react';
import useExpensesDisplay from './useExpensesDisplay';

export default function useExpesesCharts({ profile }) {
    const [dateFilter, setDateFilter] = useState('all');
    const [selectedMonth, setSelectedMonth] = useState('');
    const {
        expenses,
        filteredExpenses,
        loading,
        error,
        refetchExpenses
    } = useExpensesDisplay({ profile });

    const filteredByDateExpenses = useMemo(() => {
        if (!filteredExpenses) return [];
        if (dateFilter === 'all') return filteredExpenses;

        const now = new Date();

        if (dateFilter === 'specific' && selectedMonth) {
            const [year, month] = selectedMonth.split('-');
            return filteredExpenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getFullYear() === parseInt(year) &&
                    expenseDate.getMonth() === parseInt(month) - 1;
            });
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
                return filteredExpenses;
        }

        return filteredExpenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= cutoffDate && expenseDate <= now;
        });
    }, [filteredExpenses, dateFilter, selectedMonth]);

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
        if (!expenses || expenses.length === 0) return [];
        const months = new Set();
        expenses.forEach(expense => {
            const date = new Date(expense.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            months.add(monthKey);
        });
        return Array.from(months).sort().reverse();
    }, [expenses]);

    const monthlyChartData = useMemo(() => {
        if (!expenses || expenses.length === 0) return [];

        const monthlyData = {};
        expenses.forEach(expense => {
            if (!expense.date) return;

            const date = new Date(expense.date);
            const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`;

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { month: monthKey, amount: 0 };
            }
            monthlyData[monthKey].amount += expense.amount;
        });

        return Object.values(monthlyData);
    }, [expenses]);


    return {
        expenses,
        filteredExpenses,
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
        refetchExpenses
    }
}