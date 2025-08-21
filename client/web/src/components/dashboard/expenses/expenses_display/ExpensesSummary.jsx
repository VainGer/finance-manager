import { formatAmount } from "../../../../utils/expensesUtils";

export default function ExpensesSummary({ filteredExpenses }) {
    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const averageAmount = filteredExpenses.length > 0 ? totalAmount / filteredExpenses.length : 0;
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Total Transactions */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200/50">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div className="text-sm font-medium text-blue-700">עסקאות מוצגות</div>
                </div>
                <div className="text-2xl font-bold text-blue-800">{filteredExpenses.length}</div>
            </div>

            {/* Total Amount */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200/50">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                    </div>
                    <div className="text-sm font-medium text-red-700">סה"כ הוצאות</div>
                </div>
                <div className="text-2xl font-bold text-red-800">{formatAmount(totalAmount)}</div>
            </div>

            {/* Average Amount */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200/50 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                    </div>
                    <div className="text-sm font-medium text-green-700">ממוצע לעסקה</div>
                </div>
                <div className="text-2xl font-bold text-green-800">{formatAmount(averageAmount)}</div>
            </div>
        </div>
    );
}