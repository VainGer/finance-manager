import { useState, useEffect } from 'react';
import { post, put, del } from '../utils/api';
import { useFocusEffect } from 'expo-router';
export default function useEditCategories({ profile, goBack }) {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const resetState = () => {
        setError(null);
        setSuccess(false);
        setLoading(false);
    };


    const addCategory = async (categoryName, setCategoryName) => {
        if (!categoryName || categoryName.trim() === '') {
            setError('אנא הזן שם קטגוריה');
            return;
        }
        setError(null);
        setSuccess(false);
        setLoading(true);
        const response = await post('expenses/category/create', {
            refId: profile.expenses,
            name: categoryName.trim()
        });
        setTimeout(() => setLoading(false), 500);
        if (response.ok) {
            setSuccess('הקטגוריה נוספה בהצלחה');
            setCategoryName('');
            setTimeout(() => setSuccess(false), 2000);
        } else if (response.status === 409) {
            setError('שם הקטגוריה כבר קיים');
        } else {
            setError('אירעה שגיאה בעת הוספת הקטגוריה, נסה שוב מאוחר יותר');
            console.error('Error adding category:', response.error);
        }
    }

    const renameCategory = async (selectedCategory, newCategoryName, setNewCategoryName, setSelectedCategory) => {
        setError(null);
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
            newName: newCategoryName.trim()
        });
        setLoading(false);
        if (response.ok) {
            setError(null);
            setSuccess('הקטגוריה עודכנה בהצלחה');
            setNewCategoryName('');
            setSelectedCategory('');
            setTimeout(() => { setSuccess(false); goBack(); }, 1500);
        } else if (response.status === 409) {
            setError('שם הקטגוריה כבר קיים');
        } else {
            setError('אירעה שגיאה בעת עדכון הקטגוריה, נסה שוב מאוחר יותר');
            console.error('Error editing category:', response.error);
        }
    };

    const deleteCategory = async (refId, selectedCategory) => {
        setError(null);
        setLoading(true);
        const response = await del(`expenses/category/delete/${refId}/${selectedCategory}`);
        setLoading(false);
        if (response.ok) {
            setSuccess('הקטגוריה נמחקה בהצלחה');
            setTimeout(() => {
                setSuccess(false);
                goBack();
            }, 1500);
        } else {
            setShowConfirm(false);
            setError('אירעה שגיאה בעת מחיקת הקטגוריה, נסה שוב מאוחר יותר');
            console.error('Error deleting category:', response.error);
        }
        setShowConfirm(false);
        setError('תקשורת עם השרת נכשלה');
    };

    return {
        error,
        success,
        loading,
        addCategory,
        renameCategory,
        deleteCategory,
        resetState
    };
}
