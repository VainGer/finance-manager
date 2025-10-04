import { useRouter } from 'expo-router';
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfileData } from '../context/ProfileDataContext';
import { del, post, put } from '../utils/api.js';

export default function useEditBusinesses(props = {}) {
  const {
    businesses,
    categories,
    getBusinessesLoading,
    getCategoriesLoading,
    fetchCategories,
    errors,
  } = useProfileData();

  const { profile } = useAuth();
  const router = useRouter();

  const goBack = props.goBack || (() => router.back());

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const businessesErrors = useMemo(() => {
    const errObj = errors.find(e => e.businessesErrors);
    return errObj ? errObj.businessesErrors : null;
  }, [errors]);

  const categoriesErrors = useMemo(() => {
    const errObj = errors.find(e => e.categoriesErrors);
    return errObj ? errObj.categoriesErrors : null;
  }, [errors]);

  const resetState = () => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  };

  const addBusiness = async (category, name, setName) => {
    if (!category) {
      setError('אנא בחר קטגוריה');
      return;
    }
    if (!name || name.trim() === '') {
      setError('אנא הזן שם בעל העסק');
      return;
    }

    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const response = await post('expenses/business/add', {
        refId: profile.expenses,
        catName: category,
        name: name.trim(),
      });

      if (response.ok) {
        await fetchCategories();
        setSuccess('בעל עסק נוסף בהצלחה');
        setName('');
        setTimeout(() => setSuccess(false), 5000);
      } else if (response.status === 409) {
        setError('שם בעל העסק כבר קיים');
      } else {
        setError('אירעה שגיאה בעת יצירת בעל העסק, נסה שוב מאוחר יותר');
        console.error('Error creating business:', response.error);
      }
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const renameBusiness = async (category, oldName, newName) => {
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

    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const response = await put('expenses/business/rename', {
        refId: profile.expenses,
        catName: category,
        oldName,
        newName: newName.trim(),
      });

      if (response.ok) {
        await fetchCategories();
        setSuccess('העסק שונה בהצלחה');
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else if (response.status === 400) {
        setError('שם העסק כבר קיים בקטגוריה זו');
      } else {
        setError('אירעה שגיאה בעת עריכת שם בעל העסק, נסה שוב מאוחר יותר');
        console.error('Error renaming business:', response.error);
      }
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const deleteBusiness = async (selectedCategory, selectedBusiness) => {
    if (!selectedCategory) {
      setError('אנא בחר קטגוריה');
      return;
    }
    if (!selectedBusiness) {
      setError('אנא בחר עסק');
      return;
    }

    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const response = await del(
        `expenses/business/delete/${profile.expenses}/${selectedCategory}/${selectedBusiness}`
      );

      if (response.ok) {
        await fetchCategories();
        setSuccess('העסק נמחק בהצלחה');
        setTimeout(() => {
          setSuccess(false);
        }, 1500);
      } else {
        setError('אירעה שגיאה בעת מחיקת העסק, נסה שוב מאוחר יותר');
        console.error('Error deleting business:', response.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const getBusinessesByCategory = category => {
    if (!businesses || businesses.length === 0) return [];
    const categoryBusinesses = businesses.find(b => b.category === category);
    return categoryBusinesses ? categoryBusinesses.businesses : [];
  };

  const getAllBusinesses = () => {
    if (!businesses) return [];
    return businesses.flatMap(item =>
      item.businesses.map(b => ({
        name: b,
        category: item.category,
      }))
    );
  };

  return {
    error,
    success,
    loading,

    businesses,
    businessesLoading: getBusinessesLoading,
    businessesErrors,

    categories,
    categoriesLoading: getCategoriesLoading,
    categoriesErrors,

    addBusiness,
    renameBusiness,
    deleteBusiness,
    resetState,
    getBusinessesByCategory,
    getAllBusinesses,
    goBack,
  };
}
