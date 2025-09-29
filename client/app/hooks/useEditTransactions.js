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
        errors
    } = useProfileData();

    const router = useRouter();

    const profile = props.profile || authContext.profile;

    const goBack = props.goBack || (() => router.back());

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
            if (categoriesErrors && categoriesErrors.length > 0) {
                setCategoryError(categoriesErrors[0]);
            } else {
                setCategoryError(null);
            }

            const businessErrors = errors.find(e => e.businessesErrors)?.businessesErrors;
            if (businessErrors && businessErrors.length > 0) {
                setBusinessError(businessErrors[0]);
            } else {
                setBusinessError(null);
            }
        }
    }, [errors]);


    const addTransaction = async (transactionData, setters) => {
        if (!profile || !profile.expenses) {
            console.error('Profile or expenses reference missing:', profile);
            setError('שגיאה: פרופיל לא תקין');
            return;
        }

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

        try {
            const response = await post('expenses/transaction/create', {
                refId: profile.expenses,
                catName: selectedCategory,
                busName: selectedBusiness,
                transaction
            });

            setLoading(false);
            if (response.ok || response.success) {
                try {
                    await Promise.all([refetchExpenses(), refetchBudgets()]);
                } catch (err) {
                    console.error('Error refreshing data:', err);
                }
                setSuccess('העסקה נוספה בהצלחה!');
                setSelectedCategory('');
                setSelectedBusiness('');
                setAmount('');
                setDate(null);
                setDescription('');
            } else {
                setError('שגיאה בהוספת העסקה');
            }
            setTimeout(() => { resetState(); }, 2000);
        } catch (error) {
            console.error('Error adding transaction:', error);
            setLoading(false);
            setError('שגיאה בהוספת העסקה: בעיית תקשורת');
            setTimeout(() => { resetState(); }, 2000);
        }
    }

    const deleteTransaction = async (transaction) => {
        if (!transaction || !transaction._id) {
            console.error('Invalid transaction object:', transaction);
            setError('שגיאה: עסקה לא תקינה');
            return;
        }

        if (!profile || !profile.expenses) {
            console.error('Profile or expenses reference missing:', profile);
            setError('שגיאה: פרופיל לא תקין');
            return;
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
                try {
                    await Promise.all([refetchExpenses(), refetchBudgets()]);
                } catch (err) {
                    console.error('Error refreshing data after delete:', err);
                }
                setSuccess('העסקה נמחקה בהצלחה!');
                setTimeout(() => {
                    setSuccess(null);
                    if (goBack) goBack();
                }, 1500);
            } else {
                console.error('Delete failed:', response);
                setError('שגיאה במחיקת העסקה');
                alert(`שגיאה במחיקת העסקה`);
            }
        } catch (error) {
            console.error('Error in deleteTransaction:', error);
            setLoading(false);
            setError('שגיאה במחיקת העסקה: בעיית תקשורת');
            alert(`שגיאה במחיקת העסקה: בעיית תקשורת`);
        }
    };

    const changeTransactionAmount = async (transaction, newAmount) => {
        if (!transaction || !transaction._id) {
            console.error('Invalid transaction object:', transaction);
            setError('שגיאה: עסקה לא תקינה');
            return;
        }

        if (!profile || !profile.expenses) {
            console.error('Profile or expenses reference missing:', profile);
            setError('שגיאה: פרופיל לא תקין');
            return;
        }

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

        try {
            const response = await put('expenses/transaction/change-amount', { ...updateData });
            setLoading(false);
            if (response.ok) {
                try {
                    await Promise.all([refetchExpenses(), refetchBudgets()]);
                } catch (err) {
                    console.error('Error refreshing data after amount change:', err);
                }
                setSuccess('סכום העסקה עודכן בהצלחה!');
                setTimeout(() => {
                    setSuccess(null);
                    if (goBack) goBack();
                }, 2000);
            } else {
                console.error('Update failed:', response);
                setError('שגיאה בעדכון סכום העסקה');
                alert(`שגיאה בעדכון סכום העסקה`);
            }
        } catch (error) {
            console.error('Error updating transaction amount:', error);
            setLoading(false);
            setError('שגיאה בעדכון סכום העסקה: בעיית תקשורת');
            alert(`שגיאה בעדכון סכום העסקה: בעיית תקשורת`);
        }
    }

    const changeTransactionDate = async (transaction, newDate) => {
        if (!transaction || !transaction._id) {
            console.error('Invalid transaction object:', transaction);
            setError('שגיאה: עסקה לא תקינה');
            return;
        }

        if (!profile || !profile.expenses) {
            console.error('Profile or expenses reference missing:', profile);
            setError('שגיאה: פרופיל לא תקין');
            return;
        }

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

        try {
            const response = await put('expenses/transaction/change-date', { ...updateData });
            setLoading(false);
            if (response.ok) {
                try {
                    await Promise.all([refetchExpenses(), refetchBudgets()]);
                } catch (err) {
                    console.error('Error refreshing data after date change:', err);
                }
                setSuccess('תאריך העסקה עודכן בהצלחה!');
                setTimeout(() => {
                    setSuccess(null);
                    if (goBack) {
                        goBack();
                    }
                }, 2000);
            } else {
                console.error('Update failed:', response);
                setError('שגיאה בעדכון תאריך העסקה');
                alert(`שגיאה בעדכון תאריך העסקה`);
            }
        } catch (error) {
            console.error('Error updating transaction date:', error);
            setLoading(false);
            setError('שגיאה בעדכון תאריך העסקה: בעיית תקשורת');
            alert(`שגיאה בעדכון תאריך העסקה: בעיית תקשורת`);
        }
    }

    const changeTransactionDescription = async (transaction, newDescription) => {
        if (!transaction || !transaction._id) {
            console.error('Invalid transaction object:', transaction);
            setError('שגיאה: עסקה לא תקינה');
            return;
        }

        if (!profile || !profile.expenses) {
            console.error('Profile or expenses reference missing:', profile);
            setError('שגיאה: פרופיל לא תקין');
            return;
        }

        if (newDescription === undefined) {
            setError('אנא הזן תיאור תקין');
            return;
        }

        const updateData = {
            refId: profile.expenses,
            catName: transaction.category,
            busName: transaction.business,
            transactionId: transaction._id,
            newDescription
        };
        setLoading(true);

        try {
            const response = await put('expenses/transaction/change-description', { ...updateData });
            setLoading(false);
            if (response.ok) {
                try {
                    await Promise.all([refetchExpenses(), refetchBudgets()]);
                } catch (err) {
                    console.error('Error refreshing data after description change:', err);
                }
                setSuccess('תיאור העסקה עודכן בהצלחה!');
                setTimeout(() => {
                    setSuccess(null);
                    if (goBack) goBack();
                }, 2000);
            } else {
                console.error('Update failed:', response);
                setError('שגיאה בעדכון תיאור העסקה');
                alert(`שגיאה בעדכון תיאור העסקה`);
            }
        } catch (error) {
            console.error('Error updating transaction description:', error);
            setLoading(false);
            setError('שגיאה בעדכון תיאור העסקה: בעיית תקשורת');
            alert(`שגיאה בעדכון תיאור העסקה: בעיית תקשורת`);
        }
    }

    const getBusinessesByCategory = (category) => {
        if (!contextBusinesses || contextBusinesses.length === 0) {
            return [];
        }

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
        addTransaction,
        deleteTransaction,
        changeTransactionAmount,
        changeTransactionDate,
        changeTransactionDescription,
        resetState,
        getBusinessesByCategory
    };
}