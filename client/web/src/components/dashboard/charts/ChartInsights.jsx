import { useMemo } from 'react';

export default function ChartInsights({ expenses, pieChartData, monthlyData }) {
    const insights = useMemo(() => {
        if (!expenses || expenses.length === 0) return [];

        const insights = [];

        // Top spending category insight
        if (pieChartData && pieChartData.length > 0) {
            const topCategory = pieChartData[0];
            insights.push({
                type: 'category',
                icon: '🎯',
                title: 'קטגוריה מובילה',
                message: `${topCategory.name} מהווה ${topCategory.percentage}% מההוצאות שלך`,
                color: 'blue'
            });
        }

        // Monthly trend insight
        if (monthlyData && monthlyData.length >= 2) {
            const lastMonth = monthlyData[monthlyData.length - 1];
            const previousMonth = monthlyData[monthlyData.length - 2];
            const change = ((lastMonth.amount - previousMonth.amount) / previousMonth.amount * 100);
            
            if (Math.abs(change) > 5) {
                insights.push({
                    type: 'trend',
                    icon: change > 0 ? '📈' : '📉',
                    title: 'מגמת הוצאות',
                    message: `הוצאותיך ${change > 0 ? 'עלו' : 'ירדו'} ב-${Math.abs(change).toFixed(1)}% בחודש האחרון`,
                    color: change > 0 ? 'red' : 'green'
                });
            }
        }

        // Spending concentration insight
        if (pieChartData && pieChartData.length > 0) {
            const top3Percentage = pieChartData.slice(0, 3).reduce((sum, cat) => sum + parseFloat(cat.percentage), 0);
            if (top3Percentage > 70) {
                insights.push({
                    type: 'concentration',
                    icon: '🎯',
                    title: 'ריכוז הוצאות',
                    message: `${top3Percentage.toFixed(1)}% מההוצאות שלך מרוכזות ב-3 קטגוריות בלבד`,
                    color: 'amber'
                });
            }
        }

        // Average expense insight
        const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const averageExpense = totalAmount / expenses.length;
        if (averageExpense > 500) {
            insights.push({
                type: 'average',
                icon: '💡',
                title: 'ממוצע הוצאה גבוה',
                message: `הממוצע שלך הוא ₪${Math.round(averageExpense).toLocaleString()} לעסקה`,
                color: 'purple'
            });
        }

        // Frequency insight
        const daysWithExpenses = new Set(expenses.map(exp => exp.date.split('T')[0])).size;
        const totalDays = Math.ceil((new Date() - new Date(Math.min(...expenses.map(exp => new Date(exp.date))))) / (1000 * 60 * 60 * 24));
        const frequency = (daysWithExpenses / totalDays * 100);
        
        if (frequency > 80) {
            insights.push({
                type: 'frequency',
                icon: '🔄',
                title: 'פעילות גבוהה',
                message: `יש לך הוצאות ב-${frequency.toFixed(0)}% מהימים`,
                color: 'indigo'
            });
        }

        return insights.slice(0, 4); // Show max 4 insights
    }, [expenses, pieChartData, monthlyData]);

    if (insights.length === 0) return null;

    const getColorClasses = (color) => {
        const colors = {
            blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-700',
            red: 'from-red-50 to-red-100 border-red-200 text-red-700',
            green: 'from-green-50 to-green-100 border-green-200 text-green-700',
            amber: 'from-amber-50 to-amber-100 border-amber-200 text-amber-700',
            purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-700',
            indigo: 'from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-700'
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="mb-4 lg:mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                תובנות חכמות
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {insights.map((insight, index) => (
                    <div
                        key={index}
                        className={`bg-gradient-to-r ${getColorClasses(insight.color)} p-4 rounded-lg border transition-all duration-200 hover:shadow-md`}
                    >
                        <div className="flex items-start gap-3">
                            <div className="text-2xl">{insight.icon}</div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                                <p className="text-xs opacity-90">{insight.message}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
