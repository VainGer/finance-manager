import { get, put, post, del } from '../utils/api.js';
import { useState, useEffect } from 'react'
export default function useEditTransactions({ profile }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);


    const addTransaction = async (transactionData, setters) => {

        const { selectedCategory, selectedBusiness, amount, date, description } = transactionData;
        const { setSelectedCategory, setSelectedBusiness, setAmount, setDate, setDescription } = setters;

        if (!selectedCategory || !selectedBusiness || !amount || !date) {
            setError('אנא מלא את כל השדות');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        const transaction = {
            amount: Number(amount),
            date: new Date(date),
            description: description
        }

        const response = await post('expenses/transaction/create', {
            refId: profile.expenses,
            catName: selectedCategory,
            busName: selectedBusiness,
            transaction
        });
        setLoading(false);
        if (response.ok || response.success) {
            setSuccess('העסקה נוספה בהצלחה!');
            setSelectedCategory('');
            setSelectedBusiness('');
            setAmount('');
            setDate(null);
            setDescription('');
            if (onTransactionAdded) {
                onTransactionAdded();
            }
            setTimeout(() => { setSuccess(null) }, 1500);
        } else {
            setError('שגיאה בהוספת העסקה');
        }
    }

    const deleteTransaction = async () => {
        setIsDeleting(true);
        try {
            const deleteData = {
                refId: profile.expenses,
                catName: transaction.category,
                busName: transaction.business,
                transactionId: transaction._id
            };

            const response = await del('expenses/transaction/delete-transaction', deleteData);

            if (response.ok || response.success || response.message?.includes('successfully')) {
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
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        loading,
        error,
        success,
        addTransaction
    }
}