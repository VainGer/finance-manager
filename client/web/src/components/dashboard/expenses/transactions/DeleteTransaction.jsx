import { useState } from 'react';
import { del } from '../../../../utils/api';
import { useAuth } from '../../../../context/AuthContext';

export default function DeleteTransaction({ transaction, refId, onTransactionDeleted }) {
    const { profile } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const deleteData = {
                refId: refId,
                catName: transaction.category,
                busName: transaction.business,
                transactionId: transaction._id
            };

            const response = await del('expenses/transaction/delete-transaction', deleteData);

            if (response.ok || response.success || response.message?.includes('successfully')) {
                // Notify parent component that transaction was deleted
                if (onTransactionDeleted) {
                    onTransactionDeleted(transaction._id);
                }
                setShowConfirm(false);
            } else {
                console.error('Delete failed:', response);
                alert(`שגיאה במחיקת העסקה: ${response.message || 'לא ידוע'}`);
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
            alert('שגיאה במחיקת העסקה');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancel = () => {
        setShowConfirm(false);
    };

    if (showConfirm) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-sm text-red-600">בטוח?</span>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed"
                >
                    {isDeleting ? '...' : 'כן'}
                </button>
                <button
                    onClick={handleCancel}
                    disabled={isDeleting}
                    className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    לא
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded p-1 transition-colors"
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
            >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    );
}
