import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { del, post, put } from '../utils/api.js';
import { useAuth } from '../context/AuthContext';
import { useProfileData } from '../context/ProfileDataContext';

export default function useEditTransactions(props = {}) {
    const authContext = useAuth();
    const {
        categories: contextCategories,
        businesses: contextBusinesses,
        getCategoriesLoading,
        getBusinessesLoading,
        fetchBudgets: refetchBudgets,
        fetchExpenses: refetchExpenses,
        errors,
    } = useProfileData();

    const router = useRouter();
    const profile = props.profile || authContext.profile;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [categoryError, setCategoryError] = useState(null);
    const [businessError, setBusinessError] = useState(null);

    const resetState = () => {
        setLoading(false);
        setError(null);
        setSuccess(null);
        setCategoryError(null);
        setBusinessError(null);
    };

    useEffect(() => {
        if (errors) {
            const categoriesErrors = errors.find(e => e.categoriesErrors)?.categoriesErrors;
            setCategoryError(categoriesErrors?.[0] || null);

            const businessErrors = errors.find(e => e.businessesErrors)?.businessesErrors;
            setBusinessError(businessErrors?.[0] || null);
        }
    }, [errors]);

    const changeTransactionAmount = async (transaction, newAmount, options = {}) => {
        if (!transaction || !transaction._id) {
            setError('שגיאה: עסקה לא תקינה');
            return { ok: false };
        }

        if (!profile || !profile.expenses) {
            setError('שגיאה: פרופיל לא תקין');
            return { ok: false };
        }

        if (!newAmount || isNaN(newAmount) || Number(newAmount) <= 0) {
            setError('אנא הזן סכום תקין');
            return { ok: false };
        }

        const updateData = {
            refId: profile.expenses,
            catName: transaction.category,
            busName: transaction.business,
            transactionId: transaction._id,
            newAmount: Number(newAmount),
        };

        setLoading(true);

        try {
            const response = await put('expenses/transaction/change-amount', updateData);
            setLoading(false);

            if (response.ok) {
                await Promise.all([refetchExpenses(), refetchBudgets()]);
                if (!options.silent) setSuccess('סכום העסקה עודכן בהצלחה!');
                return { ok: true };
            } else {
                setError('שגיאה בעדכון סכום העסקה');
                return { ok: false };
            }
        } catch (err) {
            console.error('Error updating transaction amount:', err);
            setLoading(false);
            setError('שגיאה בעדכון סכום העסקה: בעיית תקשורת');
            return { ok: false };
        }
    };


    const changeTransactionDate = async (transaction, newDate, options = {}) => {
        if (!transaction || !transaction._id) {
            setError('שגיאה: עסקה לא תקינה');
            return { ok: false };
        }

        if (!profile || !profile.expenses) {
            setError('שגיאה: פרופיל לא תקין');
            return { ok: false };
        }

        if (!newDate || isNaN(newDate.getTime())) {
            setError('אנא הזן תאריך תקין');
            return { ok: false };
        }

        const updateData = {
            refId: profile.expenses,
            catName: transaction.category,
            busName: transaction.business,
            transactionId: transaction._id,
            newDate: new Date(newDate),
        };

        setLoading(true);
        try {
            const response = await put('expenses/transaction/change-date', updateData);
            setLoading(false);
            if (response.ok) {
                await Promise.all([refetchExpenses(), refetchBudgets()]);
                if (!options.silent) setSuccess('תאריך העסקה עודכן בהצלחה!');
                return { ok: true };
            } else {
                setError('שגיאה בעדכון תאריך העסקה');
                return { ok: false };
            }
        } catch (err) {
            console.error('Error updating transaction date:', err);
            setLoading(false);
            setError('שגיאה בעדכון תאריך העסקה: בעיית תקשורת');
            return { ok: false };
        }
    };

    const changeTransactionDescription = async (transaction, newDescription, options = {}) => {
        if (!transaction || !transaction._id) {
            setError('שגיאה: עסקה לא תקינה');
            return { ok: false };
        }

        if (!profile || !profile.expenses) {
            setError('שגיאה: פרופיל לא תקין');
            return { ok: false };
        }

        if (!newDescription || typeof newDescription !== 'string') {
            setError('אנא הזן תיאור תקין');
            return { ok: false };
        }

        const updateData = {
            refId: profile.expenses,
            catName: transaction.category,
            busName: transaction.business,
            transactionId: transaction._id,
            newDescription,
        };

        setLoading(true);
        try {
            const response = await put('expenses/transaction/change-description', updateData);
            setLoading(false);

            if (response.ok) {
                await Promise.all([refetchExpenses(), refetchBudgets()]);
                if (!options.silent) setSuccess('תיאור העסקה עודכן בהצלחה!');
                return { ok: true };
            } else {
                setError('שגיאה בעדכון תיאור העסקה');
                return { ok: false };
            }
        } catch (err) {
            console.error('Error updating transaction description:', err);
            setLoading(false);
            setError('שגיאה בעדכון תיאור העסקה: בעיית תקשורת');
            return { ok: false };
        }
    };


    const deleteTransaction = async (transaction, options = {}) => {
        if (!transaction || !transaction._id) {
            setError('שגיאה: עסקה לא תקינה');
            return { ok: false };
        }

        if (!profile || !profile.expenses) {
            setError('שגיאה: פרופיל לא תקין');
            return { ok: false };
        }

        const deleteData = {
            refId: profile.expenses,
            catName: transaction.category,
            busName: transaction.business,
            transactionId: transaction._id
        };

        setLoading(true);

        try {
            const response = await del('expenses/transaction/delete-transaction', deleteData);
            setLoading(false);

            if (response.ok) {
                await Promise.all([refetchExpenses(), refetchBudgets()]);
                if (!options.silent) {
                    setSuccess('העסקה נמחקה בהצלחה!');
                }
                return { ok: true };
            } else {
                setError('שגיאה במחיקת העסקה');
                return { ok: false };
            }
        } catch (err) {
            console.error('Error in deleteTransaction:', err);
            setLoading(false);
            setError('שגיאה במחיקת העסקה: בעיית תקשורת');
            return { ok: false };
        }
    };


    const getBusinessesByCategory = (category) => {
        if (!contextBusinesses?.length) return [];
        const categoryBusinesses = contextBusinesses.find(b => b.category === category);
        return categoryBusinesses ? categoryBusinesses.businesses : [];
    };

    return {
        loading,
        error,
        success,
        categories: contextCategories,
        businesses: contextBusinesses,
        categoriesLoading: getCategoriesLoading,
        businessesLoading: getBusinessesLoading,
        categoryError,
        businessError,
        changeTransactionAmount,
        changeTransactionDate,
        changeTransactionDescription,
        deleteTransaction,
        resetState,
        getBusinessesByCategory,
    };
}
