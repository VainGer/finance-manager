import { formatAmount } from "../../../../utils/expensesUtils";

export default function ExpensesSummary({ filteredExpenses }) {

    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{filteredExpenses.length}</div>
                    <div className="text-sm text-gray-600">עסקאות מוצגות</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{formatAmount(totalAmount)}</div>
                    <div className="text-sm text-gray-600">סה"כ הוצאות</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                        {filteredExpenses.length > 0 ? formatAmount(totalAmount / filteredExpenses.length) : formatAmount(0)}
                    </div>
                    <div className="text-sm text-gray-600">ממוצע לעסקה</div>
                </div>
            </div>
        </div>
    );
}