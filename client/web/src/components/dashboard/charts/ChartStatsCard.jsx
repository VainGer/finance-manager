import { useMemo } from 'react';

export default function ChartStatsCard({ data, expenses, period }) {
    const stats = useMemo(() => {
        if (!expenses || expenses.length === 0) return null;

        const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const averageExpense = totalAmount / expenses.length;
        const categoriesCount = new Set(expenses.map(exp => exp.category || 'ללא קטגוריה')).size;
        
        // Find highest spending category
        const categoryTotals = {};
        expenses.forEach(exp => {
            const category = exp.category || 'ללא קטגוריה';
            categoryTotals[category] = (categoryTotals[category] || 0) + exp.amount;
        });
        
        const highestCategory = Object.entries(categoryTotals)
            .sort(([,a], [,b]) => b - a)[0];

        // Calculate recent trend (last 30 days vs previous 30 days)
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));

        const recentExpenses = expenses.filter(exp => 
            new Date(exp.date) >= thirtyDaysAgo
        );
        const previousExpenses = expenses.filter(exp => 
            new Date(exp.date) >= sixtyDaysAgo && new Date(exp.date) < thirtyDaysAgo
        );

        const recentTotal = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const previousTotal = previousExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        
        const trend = previousTotal > 0 
            ? ((recentTotal - previousTotal) / previousTotal * 100)
            : 0;

        return {
            totalAmount,
            averageExpense,
            categoriesCount,
            highestCategory: highestCategory ? {
                name: highestCategory[0],
                amount: highestCategory[1]
            } : null,
            trend,
            transactionCount: expenses.length
        };
    }, [expenses]);

    if (!stats) return null;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
            {/* Total Amount */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 lg:p-4 rounded-lg border border-blue-200/50">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">💰</span>
                    </div>
                    <h3 className="text-xs lg:text-sm font-semibold text-blue-700">סה״כ הוצאות</h3>
                </div>
                <p className="text-lg lg:text-xl font-bold text-blue-800">
                    ₪{stats.totalAmount.toLocaleString()}
                </p>
                <p className="text-xs text-blue-600">
                    {stats.transactionCount} עסקאות
                </p>
            </div>

            {/* Average Expense */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 lg:p-4 rounded-lg border border-green-200/50">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">📊</span>
                    </div>
                    <h3 className="text-xs lg:text-sm font-semibold text-green-700">ממוצע הוצאה</h3>
                </div>
                <p className="text-lg lg:text-xl font-bold text-green-800">
                    ₪{Math.round(stats.averageExpense).toLocaleString()}
                </p>
                <p className="text-xs text-green-600">
                    לעסקה
                </p>
            </div>

            {/* Categories Count */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 lg:p-4 rounded-lg border border-purple-200/50">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">🏷️</span>
                    </div>
                    <h3 className="text-xs lg:text-sm font-semibold text-purple-700">קטגוריות</h3>
                </div>
                <p className="text-lg lg:text-xl font-bold text-purple-800">
                    {stats.categoriesCount}
                </p>
                <p className="text-xs text-purple-600">
                    קטגוריות שונות
                </p>
            </div>

            {/* Trend */}
            <div className={`bg-gradient-to-br p-3 lg:p-4 rounded-lg border ${
                stats.trend > 0 
                    ? 'from-red-50 to-red-100 border-red-200/50' 
                    : 'from-emerald-50 to-emerald-100 border-emerald-200/50'
            }`}>
                <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        stats.trend > 0 ? 'bg-red-500' : 'bg-emerald-500'
                    }`}>
                        <span className="text-white text-lg">
                            {stats.trend > 0 ? '📈' : '📉'}
                        </span>
                    </div>
                    <h3 className={`text-xs lg:text-sm font-semibold ${
                        stats.trend > 0 ? 'text-red-700' : 'text-emerald-700'
                    }`}>
                        מגמה
                    </h3>
                </div>
                <p className={`text-lg lg:text-xl font-bold ${
                    stats.trend > 0 ? 'text-red-800' : 'text-emerald-800'
                }`}>
                    {stats.trend > 0 ? '+' : ''}{Math.round(stats.trend)}%
                </p>
                <p className={`text-xs ${
                    stats.trend > 0 ? 'text-red-600' : 'text-emerald-600'
                }`}>
                    ב-30 הימים האחרונים
                </p>
            </div>

            {/* Top Category - Show only on larger screens */}
            {stats.highestCategory && (
                <div className="col-span-2 lg:col-span-4 bg-gradient-to-br from-amber-50 to-amber-100 p-3 lg:p-4 rounded-lg border border-amber-200/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                                <span className="text-white text-lg">🥇</span>
                            </div>
                            <div>
                                <h3 className="text-sm lg:text-base font-semibold text-amber-700">
                                    קטגוריה מובילה: {stats.highestCategory.name}
                                </h3>
                                <p className="text-xs text-amber-600">
                                    הקטגוריה עם ההוצאה הגבוהה ביותר
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-lg lg:text-xl font-bold text-amber-800">
                                ₪{stats.highestCategory.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-amber-600">
                                {((stats.highestCategory.amount / stats.totalAmount) * 100).toFixed(1)}% מסה״כ
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
