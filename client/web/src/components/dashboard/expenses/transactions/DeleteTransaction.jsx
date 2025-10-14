import { useState } from 'react';
import useEditTransactions from '../../../../hooks/useEditTransactions';

export default function DeleteTransaction({ transaction, onTransactionDeleted }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const { loading, error, deleteTransaction, resetState } = useEditTransactions();

    const handleDelete = async () => {
        const res = await deleteTransaction(transaction);
        if (res.ok) {
            onTransactionDeleted?.(transaction._id);
            setShowConfirm(false);
            resetState();
        }
    };

    const handleCancel = () => {
        setShowConfirm(false);
        resetState();
    };

    if (showConfirm) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3 mx-auto">
                <div className="flex items-center gap-2 text-red-800">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-sm font-medium">האם אתה בטוח?</span>
                </div>
                <p className="text-red-700 text-xs">פעולה זו תמחק את העסקה לצמיתות</p>

                {error && (
                    <div className="bg-red-100 border border-red-200 text-red-700 text-xs rounded-lg p-2">
                        {error}
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2 justify-center">
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                מוחק...
                            </div>
                        ) : (
                            'כן, מחק'
                        )}
                    </button>

                    <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        ביטול
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg p-2 transition-colors group"
            title="מחק עסקה"
            aria-label="מחק עסקה"
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:scale-110 transition-transform"
            >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    );
}
