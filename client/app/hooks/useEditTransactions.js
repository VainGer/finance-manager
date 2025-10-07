import { useEffect, useState } from 'react';
import { del, put, post } from '../utils/api.js';
import { useAuth } from '../context/AuthContext';
import { useProfileData } from '../context/ProfileDataContext';


export default function useEditTransactions(props = {}) {
    const { profile: authProfile, setIsExpiredToken, setAccessTokenReady } = useAuth();
    const {
        categories: contextCategories,
        businesses: contextBusinesses,
        getCategoriesLoading,
        getBusinessesLoading,
        fetchBudgets,
        fetchExpenses,
        errors: contextErrors,
    } = useProfileData();

    const profile = props.profile || authProfile;

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
        if (Array.isArray(contextErrors)) {
            const catErrObj = contextErrors.find(e => e.categoriesErrors);
            const bizErrObj = contextErrors.find(e => e.businessesErrors);
            setCategoryError(catErrObj?.categoriesErrors?.[0] || null);
            setBusinessError(bizErrObj?.businessesErrors?.[0] || null);
        } else {
            setCategoryError(null);
            setBusinessError(null);
        }
    }, [contextErrors]);


    const handleTransactionResponse = async (response, successMsg, errorMsg, options = {}) => {
        setLoading(false);
        if (response.ok) {
            await Promise.all([fetchExpenses(), fetchBudgets()]);
            if (!options.silent) setSuccess(successMsg);
            return { ok: true };
        }

        switch (response.status) {
            case 400:
                setError('בקשה לא תקינה');
                break;
            case 401:
                setError('ההרשאה פגה, אנא התחבר מחדש');
                setIsExpiredToken(true);
                setAccessTokenReady(false);
                break;
            case 404:
                setError('העסקה לא נמצאה');
                break;
            case 500:
                setError('שגיאה בשרת, נסה שוב מאוחר יותר');
                break;
            default:
                setError(errorMsg);
        }
        return { ok: false };
    };


    const validateTransactionContext = (transaction) => {
        if (!transaction || !transaction._id) {
            setError('שגיאה: עסקה לא תקינה');
            return false;
        }
        if (!profile || !profile.expenses) {
            setError('שגיאה: פרופיל לא תקין');
            return false;
        }
        return true;
    };


    const addTransaction = async (data, resetFns = {}) => {
        resetState();

        const { selectedCategory, selectedBusiness, amount, date, description } = data;

        if (!selectedCategory || !selectedBusiness || !amount || Number(amount) <= 0) {
            setError('נא למלא את כל השדות הנדרשים');
            return { ok: false };
        }

        if (!profile || !profile.expenses) {
            setError('שגיאה: פרופיל לא תקין');
            return { ok: false };
        }

        setLoading(true);
        try {
            const payload = {
                refId: profile.expenses,
                catName: selectedCategory,
                busName: selectedBusiness,
                transaction: {
                    amount: Number(amount),
                    date: new Date(date).toISOString(),
                    description: description || '',
                },
            };

            const response = await post('expenses/transaction/create', payload);
            const res = await handleTransactionResponse(response, 'העסקה נוספה בהצלחה!', 'שגיאה בהוספת העסקה');
            if (res.ok && resetFns) {
                resetFns.setSelectedCategory?.('');
                resetFns.setSelectedBusiness?.('');
                resetFns.setAmount?.('');
                resetFns.setDate?.(new Date());
                resetFns.setDescription?.('');
            }

            return res;
        } catch (err) {
            console.error('Error adding transaction:', err);
            setLoading(false);
            setError('שגיאה בהוספת העסקה: בעיית תקשורת');
            return { ok: false };
        }
    };

    const changeTransactionAmount = async (transaction, newAmount, options = {}) => {
        resetState();
        if (!validateTransactionContext(transaction)) return { ok: false };
        if (!newAmount || isNaN(newAmount) || Number(newAmount) <= 0) {
            setError('אנא הזן סכום תקין');
            return { ok: false };
        }

        setLoading(true);
        try {
            const response = await put('expenses/transaction/change-amount', {
                refId: profile.expenses,
                catName: transaction.category,
                busName: transaction.business,
                transactionId: transaction._id,
                newAmount: Number(newAmount),
            });
            return await handleTransactionResponse(
                response,
                'סכום העסקה עודכן בהצלחה!',
                'שגיאה בעדכון סכום העסקה',
                options
            );
        } catch (err) {
            console.error('Error updating transaction amount:', err);
            setLoading(false);
            setError('שגיאה בעדכון סכום העסקה: בעיית תקשורת');
            return { ok: false };
        }
    };


    const changeTransactionDate = async (transaction, newDate, options = {}) => {
        resetState();
        if (!validateTransactionContext(transaction)) return { ok: false };

        const parsedDate = new Date(newDate);
        if (isNaN(parsedDate.getTime())) {
            setError('אנא הזן תאריך תקין');
            return { ok: false };
        }

        setLoading(true);
        try {
            const response = await put('expenses/transaction/change-date', {
                refId: profile.expenses,
                catName: transaction.category,
                busName: transaction.business,
                transactionId: transaction._id,
                newDate: parsedDate,
            });
            return await handleTransactionResponse(
                response,
                'תאריך העסקה עודכן בהצלחה!',
                'שגיאה בעדכון תאריך העסקה',
                options
            );
        } catch (err) {
            console.error('Error updating transaction date:', err);
            setLoading(false);
            setError('שגיאה בעדכון תאריך העסקה: בעיית תקשורת');
            return { ok: false };
        }
    };


    const changeTransactionDescription = async (transaction, newDescription, options = {}) => {
        resetState();
        if (!validateTransactionContext(transaction)) return { ok: false };
        if (!newDescription || typeof newDescription !== 'string') {
            setError('אנא הזן תיאור תקין');
            return { ok: false };
        }

        setLoading(true);
        try {
            const response = await put('expenses/transaction/change-description', {
                refId: profile.expenses,
                catName: transaction.category,
                busName: transaction.business,
                transactionId: transaction._id,
                newDescription,
            });
            return await handleTransactionResponse(
                response,
                'תיאור העסקה עודכן בהצלחה!',
                'שגיאה בעדכון תיאור העסקה',
                options
            );
        } catch (err) {
            console.error('Error updating transaction description:', err);
            setLoading(false);
            setError('שגיאה בעדכון תיאור העסקה: בעיית תקשורת');
            return { ok: false };
        }
    };


    const deleteTransaction = async (transaction, options = {}) => {
        resetState();
        if (!validateTransactionContext(transaction)) return { ok: false };

        setLoading(true);
        try {
            const response = await del('expenses/transaction/delete-transaction', {
                refId: profile.expenses,
                catName: transaction.category,
                busName: transaction.business,
                transactionId: transaction._id,
            });
            return await handleTransactionResponse(
                response,
                'העסקה נמחקה בהצלחה!',
                'שגיאה במחיקת העסקה',
                options
            );
        } catch (err) {
            console.error('Error deleting transaction:', err);
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
        addTransaction
    };
}
