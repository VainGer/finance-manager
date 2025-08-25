import { formatAmount, formatDate } from "../../../../utils/expensesUtils";
import DeleteTransaction from "../transactions/DeleteTransaction";
import EditTransaction from "../transactions/EditTransaction";

export default function ExpensesTable({ filteredExpenses, expensesId, onTransactionDeleted, onTransactionUpdated }) {
    if (filteredExpenses.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <div className="text-lg font-semibold text-slate-600 mb-2">אין עסקאות להצגה</div>
                <div className="text-slate-500">נסה לשנות את הסינון או להוסיף עסקאות חדשות</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-right p-4 font-semibold text-slate-700">תאריך</th>
                            <th className="text-right p-4 font-semibold text-slate-700">תיאור</th>
                            <th className="text-right p-4 font-semibold text-slate-700">קטגוריה</th>
                            <th className="text-right p-4 font-semibold text-slate-700">עסק</th>
                            <th className="text-right p-4 font-semibold text-slate-700">סכום</th>
                            <th className="text-center p-4 font-semibold text-slate-700">פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.map((expense, index) => (
                            <tr key={index} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 text-slate-600">{formatDate(expense.date)}</td>
                                <td className="p-4 text-slate-800 font-medium">{expense.description}</td>
                                <td className="p-4">
                                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                        {expense.category}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-600">{expense.business}</td>
                                <td className="p-4 font-bold text-red-600">{formatAmount(expense.amount)}</td>
                                <td className="p-4">
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
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="lg:hidden space-y-3 p-4">
                {filteredExpenses.map((expense, index) => (
                    <div key={index} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <div className="font-semibold text-slate-800 mb-1">{expense.description}</div>
                                <div className="text-sm text-slate-500">{formatDate(expense.date)}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold text-red-600">{formatAmount(expense.amount)}</div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                                <div className="text-xs text-slate-500 mb-1">קטגוריה</div>
                                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                    {expense.category}
                                </span>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 mb-1">עסק</div>
                                <div className="text-sm text-slate-700 font-medium">{expense.business}</div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="md:flex justify-end gap-2 pt-3 border-t border-slate-200">
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
                    </div>
                ))}
            </div>
        </div>
    );
}