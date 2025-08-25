import { goBack } from 'expo-router/build/global-state/routing.js';
import { put, post, del } from '../utils/api.js';
import { useState } from 'react'

export default function useEditTransactions({ profile, refetchBudgets, refetchExpenses }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const resetState = () => {
        setLoading(false);
        setError(null);
        setSuccess(null);
    }

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
            refetchExpenses();
            refetchBudgets();
        } else {
            setError('שגיאה בהוספת העסקה');
        }
        setTimeout(() => { resetState(); }, 2000);
    }

    const deleteTransaction = async (transaction, goBack) => {
        const deleteData = {
            refId: profile.expenses,
            catName: transaction.category,
            busName: transaction.business,
            transactionId: transaction._id
        };
        setLoading(true);
        const response = await del('expenses/transaction/delete-transaction', deleteData);
        setLoading(false);
        if (response.ok) {
            refetchExpenses();
            refetchBudgets();
            setSuccess('העסקה נמחקה בהצלחה!');
            setTimeout(() => { goBack(); setSuccess(null); }, 1500);
        } else {
            console.error('Delete failed:', response);
            setError('שגיאה במחיקת העסקה');
            alert(`שגיאה במחיקת העסקה`);
        }
    };

    const changeTransactionAmount = async (transaction, newAmount) => {
        if (!newAmount || isNaN(newAmount) || Number(newAmount) <= 0) {
            setError('אנא הזן סכום תקין');
            return;
        }
        const updateData = {
            refId: profile.expenses,
            catName: transaction.category,
            busName: transaction.business,
            transactionId: transaction._id,
            newAmount: Number(newAmount)
        };
        setLoading(true);
        const response = await put('expenses/transaction/change-amount', { ...updateData });
        setLoading(false);
        if (response.ok) {
            setSuccess('סכום העסקה עודכן בהצלחה!');
            refetchExpenses();
            refetchBudgets();
            setTimeout(() => { setSuccess(null); goBack(); }, 2000);
        } else {
            console.error('Update failed:', response);
            setError('שגיאה בעדכון סכום העסקה');
            alert(`שגיאה בעדכון סכום העסקה`);
        }
    }

    const changeTransactionDate = async (transaction, newDate) => {
        if (!newDate || isNaN(newDate.getTime())) {
            setError('אנא הזן תאריך תקין');
            return;
        }
        const updateData = {
            refId: profile.expenses,
            catName: transaction.category,
            busName: transaction.business,
            transactionId: transaction._id,
            newDate: new Date(newDate)
        };
        setLoading(true);
        const response = await put('expenses/transaction/change-date', { ...updateData });
        setLoading(false);
        if (response.ok) {
            setSuccess('תאריך העסקה עודכן בהצלחה!');
            refetchExpenses();
            refetchBudgets();
            setTimeout(() => { setSuccess(null); goBack(); }, 2000);
        } else {
            console.error('Update failed:', response);
            setError('שגיאה בעדכון תאריך העסקה');
            alert(`שגיאה בעדכון תאריך העסקה`);
        }
    }

    const changeTransactionDescription = async (transaction, newDescription) => {
        const updateData = {
            refId: profile.expenses,
            catName: transaction.category,
            busName: transaction.business,
            transactionId: transaction._id,
            newDescription
        };
        setLoading(true);
        const response = await put('expenses/transaction/change-description', { ...updateData });
        setLoading(false);
        if (response.ok) {
            setSuccess('תיאור העסקה עודכן בהצלחה!');
            refetchExpenses();
            refetchBudgets();
            setTimeout(() => { setSuccess(null); goBack(); }, 2000);
        } else {
            console.error('Update failed:', response);
            setError('שגיאה בעדכון תיאור העסקה');
            alert(`שגיאה בעדכון תיאור העסקה`);
        }
    }

    return {
        loading,
        error,
        success,
        addTransaction,
        deleteTransaction,
        changeTransactionAmount,
        changeTransactionDate,
        changeTransactionDescription,
        resetState
    }
}