import { formatAmount, formatDate } from "../../../../utils/expensesUtils";
import DeleteTransaction from "../transactions/DeleteTransaction";
import EditTransaction from "../transactions/EditTransaction";
export default function ExpensesTable({ filteredExpenses, expensesId, onTransactionDeleted, onTransactionUpdated }) {
    return (
        <div className="overflow-y-auto h-50">
            <table className="w-full">
                <thead>
                    <tr className="border-b">
                        <th className="text-right p-3 font-semibold">תאריך</th>
                        <th className="text-right p-3 font-semibold">תיאור</th>
                        <th className="text-right p-3 font-semibold">קטגוריה</th>
                        <th className="text-right p-3 font-semibold">עסק</th>
                        <th className="text-right p-3 font-semibold">סכום</th>
                        <th className="text-center p-3 font-semibold">פעולות</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredExpenses.length > 0 ? (
                        filteredExpenses.map((expense, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="p-3">{formatDate(expense.date)}</td>
                                <td className="p-3">{expense.description}</td>
                                <td className="p-3">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                        {expense.category}
                                    </span>
                                </td>
                                <td className="p-3">{expense.business}</td>
                                <td className="p-3 font-bold text-red-600">{formatAmount(expense.amount)}</td>
                                <td className="p-3 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <EditTransaction
                                            transaction={expense}
                                            refId={expensesId}
                                            onTransactionUpdated={onTransactionUpdated}
                                        />
                                        <DeleteTransaction
                                            transaction={expense}
                                            refId={expensesId}
                                            onTransactionDeleted={onTransactionDeleted}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="p-8 text-center text-gray-500">
                                אין עסקאות להצגה עם הסינון הנוכחי
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}