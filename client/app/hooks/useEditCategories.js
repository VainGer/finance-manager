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
        const name = categoryName?.trim();

        if (!name) {
            setError('אנא הזן שם קטגוריה');
            return false;
        }
        if (name.length < 2) {
            setError('שם הקטגוריה חייב להכיל לפחות 2 תווים');
            return false;
        }

        setLoading(true);
        const response = await post('expenses/category/create', {
            refId: profile.expenses,
            name,
        });
        setLoading(false);

        if (response.ok) {
            setCategoryName('');
            await fetchCategories();
            setSuccess('הקטגוריה נוספה בהצלחה');
            setTimeout(() => setSuccess(false), 5000);
            return true;
        }

        switch (response.status) {
            case 400:
                setError('שם הקטגוריה לא תקין');
                break;
            case 409:
                setError('שם הקטגוריה כבר קיים');
                break;
            case 500:
                setError('שגיאת שרת בעת הוספת הקטגוריה');
                break;
            default:
                setError('אירעה שגיאה בעת הוספת הקטגוריה, נסה שוב מאוחר יותר');
                console.error('Error adding category:', response.error);
        }
        return false;
    };

    const renameCategory = async (
        selectedCategory,
        newCategoryName,
        setNewCategoryName,
        setSelectedCategory
    ) => {
        resetState();
        const newName = newCategoryName?.trim();

        if (!selectedCategory) {
            setError('אנא בחר קטגוריה לשינוי');
            return false;
        }
        if (!newName) {
            setError('אנא הזן שם חדש לקטגוריה');
            return false;
        }
        if (selectedCategory === newName) {
            setError('השם החדש זהה לשם הנוכחי');
            return false;
        }

        setLoading(true);
        const response = await put('expenses/category/rename', {
            refId: profile.expenses,
            oldName: selectedCategory,
            newName,
        });
        setLoading(false);

        if (response.ok) {
            setNewCategoryName('');
            setSelectedCategory('');
            await fetchCategories();
            setSuccess('הקטגוריה עודכנה בהצלחה');
            setTimeout(() => setSuccess(false), 5000);
            return true;
        }

        switch (response.status) {
            case 400:
                setError('שם הקטגוריה לא תקין');
                break;
            case 409:
                setError('שם הקטגוריה כבר קיים');
                break;
            case 500:
                setError('שגיאת שרת בעת עדכון הקטגוריה');
                break;
            default:
                setError('אירעה שגיאה בעת עדכון הקטגוריה, נסה שוב מאוחר יותר');
                console.error('Error editing category:', response.error);
        }
        return false;
    };

    const deleteCategory = async (selectedCategory, setShowConfirm) => {
        resetState();
        setLoading(true);

        try {
            const response = await del(`expenses/category/delete/${profile.expenses}/${encodeURIComponent(selectedCategory)}`);
            setLoading(false);

            if (response.ok) {
                await fetchCategories();
                setSuccess('הקטגוריה נמחקה בהצלחה');
                setTimeout(() => setSuccess(false), 5000);
                return true;
            }

            setShowConfirm(false);
            switch (response.status) {
                case 400:
                    setError('בקשה לא תקינה');
                    break;
                case 404:
                    setError('הקטגוריה לא נמצאה');
                    break;
                case 500:
                    setError('שגיאת שרת בעת מחיקת הקטגוריה');
                    break;
                default:
                    setError('אירעה שגיאה בעת מחיקת הקטגוריה, נסה שוב מאוחר יותר');
                    console.error('Error deleting category:', response.error);
            }
            return false;
        } catch (err) {
            console.error('Exception deleting category:', err);
            setError('תקשורת עם השרת נכשלה');
            setShowConfirm(false);
            setLoading(false);
            return false;
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
