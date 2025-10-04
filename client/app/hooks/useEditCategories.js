import { useRouter } from 'expo-router';
import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfileData } from '../context/ProfileDataContext';
import { del, post, put } from '../utils/api';

export default function useEditCategories() {
    const { categories, expensesLoading, errors, fetchCategories } = useProfileData();
    const { profile } = useAuth();
    const router = useRouter();

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const categoriesErrors = useMemo(() => {
        const catErrorObj = errors.find(e => e.categoriesErrors);
        return catErrorObj ? catErrorObj.categoriesErrors : null;
    }, [errors]);

    const goBack = () => router.back();

    const resetState = () => {
        setError(null);
        setSuccess(false);
        setLoading(false);
    };

    const addCategory = async (categoryName, setCategoryName) => {
        resetState();
        if (!categoryName || categoryName.trim() === '') {
            setError('אנא הזן שם קטגוריה');
            return;
        }
        if (categoryName.trim().length < 2) {
            setError('שם הקטגוריה חייב להכיל לפחות 2 תווים');
            return;
        }
        setError(null);
        setSuccess(false);
        setLoading(true);

        const response = await post('expenses/category/create', {
            refId: profile.expenses,
            name: categoryName.trim(),
        });

        setTimeout(() => setLoading(false), 500);

        if (response.ok) {
            setError(null);
            setSuccess('הקטגוריה נוספה בהצלחה');
            setCategoryName('');
            await fetchCategories();
            setTimeout(() => setSuccess(false), 5000);
        } else if (response.status === 409) {
            setError('שם הקטגוריה כבר קיים');
        } else {
            setError('אירעה שגיאה בעת הוספת הקטגוריה, נסה שוב מאוחר יותר');
            console.error('Error adding category:', response.error);
        }
    };

    const renameCategory = async (selectedCategory, newCategoryName, setNewCategoryName, setSelectedCategory) => {
        resetState();
        if (!selectedCategory) {
            setError('אנא בחר קטגוריה לשינוי');
            return;
        }
        if (!newCategoryName || newCategoryName.trim() === '') {
            setError('אנא הזן שם חדש לקטגוריה');
            return;
        }
        if (selectedCategory === newCategoryName) {
            setError('השם החדש זהה לשם הנוכחי');
            return;
        }

        setLoading(true);
        const response = await put('expenses/category/rename', {
            refId: profile.expenses,
            oldName: selectedCategory,
            newName: newCategoryName.trim(),
        });
        setLoading(false);

        if (response.ok) {
            setError(null);
            setSuccess('הקטגוריה עודכנה בהצלחה');
            setNewCategoryName('');
            setSelectedCategory('');
            await fetchCategories();
            setTimeout(() => {
                setSuccess(false);
            }, 5000);
        } else if (response.status === 409) {
            setError('שם הקטגוריה כבר קיים');
        } else {
            setError('אירעה שגיאה בעת עדכון הקטגוריה, נסה שוב מאוחר יותר');
            console.error('Error editing category:', response.error);
        }
    };

    const deleteCategory = async (selectedCategory, setShowConfirm) => {
        resetState();
        setLoading(true);

        try {
            const response = await del(`expenses/category/delete/${profile.expenses}/${selectedCategory}`);
            if (response.ok) {
                setError(null);
                await fetchCategories();
                setSuccess('הקטגוריה נמחקה בהצלחה');
                setTimeout(() => {
                    setSuccess(false);
                }, 5000);
            } else {
                setShowConfirm(false);
                setError('אירעה שגיאה בעת מחיקת הקטגוריה, נסה שוב מאוחר יותר');
                console.error('Error deleting category:', response.error);
            }
        } catch (err) {
            console.error('Exception deleting category:', err);
            setError('תקשורת עם השרת נכשלה');
            setShowConfirm(false);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return {
        error,
        success,
        loading,
        categoriesLoading: expensesLoading,
        categories,
        categoriesErrors,
        addCategory,
        renameCategory,
        deleteCategory,
        resetState,
        goBack,
    };
}
