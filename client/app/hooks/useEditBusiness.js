import { useState, useEffect } from 'react';
import { get, put, post, del } from '../utils/api.js';
export default function useEditBusiness({ profile, goBack }) {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const resetState = () => {
        setError(null);
        setSuccess(false);
        setLoading(false);
    };

    const addBusiness = async (refId, category, name, setName) => {
        if (!name || name.trim() === '') {
            setError('אנא הזן שם בעל העסק');
            return;
        }
        setError(null);
        setSuccess(false);
        setLoading(true);
        const response = await post('expenses/business/add', {
            refId: refId,
            catName: category,
            name: name.trim()
        });
        setTimeout(() => setLoading(false), 500);
        if (response.ok) {
            setSuccess('בעל עסק נוסף בהצלחה');
            setName('');
            setTimeout(() => setSuccess(false), 2000);
        } else if (response.status === 409) {
            setError('שם בעל העסק כבר קיים');
        } else {
            setError('אירעה שגיאה בעת יצירת בעל העסק, נסה שוב מאוחר יותר');
            console.error('Error creating business:', response.error);
        }
    }

    const renameBusiness = async (refId, category, oldName, newName) => {
        setError(null);
        setSuccess(null);
        setLoading(true);
        if (!category) {
            setError('אנא בחר קטגוריה');
            return;
        }
        if (!oldName) {
            setError('אנא בחר עסק');
            return;
        }
        if (!newName || newName.trim() === '') {
            setError('אנא הזן שם חדש לעסק');
            return;
        }

        const response = await put('expenses/business/rename', {
            refId: refId,
            catName: category,
            oldName: oldName,
            newName: newName.trim()
        });
        setTimeout(() => setLoading(false), 500);
        if (response.ok) {
            setSuccess('העסק שונה בהצלחה');
            setTimeout(() => goBack(), 1500);
        } else if (response.status === 400) {
            setError('שם העסק כבר קיים בקטגוריה זו');
        } else {
            setError('אירעה שגיאה בעת עריכת שם בעל העסק, נסה שוב מאוחר יותר');
            console.error('Error renaming business:', response.error);
        }
    }

    const deleteBusiness = async (refId, selectedCategory, selectedBusiness) => {
        setError(null);
        setSuccess(null);
        if (!selectedCategory) {
            setError('אנא בחר קטגוריה');
            return;
        }
        if (!selectedBusiness) {
            setError('אנא בחר עסק');
            return;
        }

        const response = await del(`expenses/business/delete/${refId}/${selectedCategory}/${selectedBusiness}`);
        if (response.ok) {
            setSuccess('העסק נמחק בהצלחה');
            setTimeout(() => { goBack(); }, 1500);
        } else {
            setError('אירעה שגיאה בעת מחיקת העסק, נסה שוב מאוחר יותר');
            console.error('Error deleting business:', response.error);
        }
    }

    return {
        error,
        success,
        loading,
        addBusiness,
        renameBusiness,
        deleteBusiness,
        resetState
    }
}