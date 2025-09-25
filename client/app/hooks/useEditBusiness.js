import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfileData } from '../context/ProfileDataContext';
import { del, post, put } from '../utils/api.js';

export default function useEditBusiness(props = {}) {
    const { businesses, getBusinessesLoading, fetchBusinesses, errors } = useProfileData();
    const authContext = useAuth();
    const router = useRouter();

    const profile = props.profile || authContext.profile;

    const goBack = props.goBack || (() => router.back());

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [businessesError, setBusinessesError] = useState(null);

    const resetState = () => {
        setError(null);
        setSuccess(false);
        setLoading(false);
        setBusinessesError(null);
    };

    useEffect(() => {
        const businessErrors = errors.find(e => e.businessesErrors)?.businessesErrors;
        if (businessErrors && businessErrors.length > 0) {
            setBusinessesError(businessErrors[0]);
        } else {
            setBusinessesError(null);
        }
    }, [errors]);



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
            setTimeout(() => {
                setSuccess(false);
                goBack();
            }, 1500);
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
            setTimeout(() => {
                setSuccess(false);
                goBack();
            }, 1500);
        } else {
            setError('אירעה שגיאה בעת מחיקת העסק, נסה שוב מאוחר יותר');
            console.error('Error deleting business:', response.error);
        }
    }

    const getBusinessesByCategory = (category) => {
        if (!businesses || businesses.length === 0) {
            return [];
        }
        const categoryBusinesses = businesses.find(b => b.category === category);
        return categoryBusinesses ? categoryBusinesses.businesses : [];
    };

    const getAllBusinesses = () => {
        if (!businesses) return [];

        return businesses.reduce((acc, item) => {
            return [...acc, ...item.businesses.map(b => ({
                name: b,
                category: item.category
            }))];
        }, []);
    };

    return {
        error,
        success,
        loading,
        businessesLoading: getBusinessesLoading,
        businessesError,
        businesses,
        addBusiness,
        renameBusiness,
        deleteBusiness,
        resetState,
        fetchBusinesses,
        getBusinessesByCategory,
        getAllBusinesses
    };
}