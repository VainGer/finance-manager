import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfileData } from '../context/ProfileDataContext';
import { del, post, put } from '../utils/api.js';

export default function useEditBusinesses(props = {}) {
  const { businesses, categories, getBusinessesLoading, getCategoriesLoading, fetchCategories, errors } = useProfileData();
  const { profile, setIsExpiredToken, setAccessTokenReady } = useAuth();
  const navigate = useNavigate();

  const goBack = props.goBack || (() => navigate(-1));

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Extract business/category-level errors from ProfileDataContext
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
    setSuccess(null);
    setLoading(false);
  };

  const handleResponse = async (response, successMsg, errorMsg) => {
    setLoading(false);
    if (response.ok) {
      await fetchCategories();
      setSuccess(successMsg);
      setTimeout(() => setSuccess(null), 4000);
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
        setError('הפריט לא נמצא');
        break;
      case 409:
        setError('הפריט כבר קיים');
        break;
      case 500:
        setError('שגיאת שרת, נסה שוב מאוחר יותר');
        break;
      default:
        setError(errorMsg);
    }
    return { ok: false };
  };

  const addBusiness = async (category, name, setName) => {
    resetState();
    if (!category) {
      setError('אנא בחר קטגוריה');
      return;
    }
    if (!name || name.trim() === '') {
      setError('אנא הזן שם בעל העסק');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        refId: profile.expenses,
        catName: category.trim(),
        businessName: name.trim(),
      };

      const response = await post('expenses/business/add', payload);
      const result = await handleResponse(response, 'בעל העסק נוסף בהצלחה', 'אירעה שגיאה בעת יצירת בעל העסק');
      if (result.ok) setName('');
    } catch (err) {
      console.error('Error adding business:', err);
      setLoading(false);
      setError('שגיאה ביצירת בעל העסק: בעיית תקשורת');
    }
  };

  const renameBusiness = async (category, oldName, newName) => {
    resetState();
    if (!category) {
      setError('אנא בחר קטגוריה');
      return;
    }
    if (!oldName) {
      setError('אנא בחר עסק לשינוי');
      return;
    }
    if (!newName || newName.trim() === '') {
      setError('אנא הזן שם חדש לעסק');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        refId: profile.expenses,
        catName: category.trim(),
        oldName: oldName.trim(),
        newName: newName.trim(),
      };

      const response = await put('expenses/business/rename', payload);
      await handleResponse(response, 'העסק שונה בהצלחה', 'אירעה שגיאה בעת שינוי שם העסק');
    } catch (err) {
      console.error('Error renaming business:', err);
      setLoading(false);
      setError('שגיאה בשינוי שם העסק: בעיית תקשורת');
    }
  };

  const deleteBusiness = async (selectedCategory, selectedBusiness) => {
    resetState();
    if (!selectedCategory) {
      setError('אנא בחר קטגוריה');
      return;
    }
    if (!selectedBusiness) {
      setError('אנא בחר עסק למחיקה');
      return;
    }

    setLoading(true);
    try {
      const url = `expenses/business/delete/${profile.expenses}/${encodeURIComponent(selectedCategory.trim())}/${encodeURIComponent(selectedBusiness.trim())}`;
      const response = await del(url);
      await handleResponse(response, 'העסק נמחק בהצלחה', 'אירעה שגיאה בעת מחיקת העסק');
    } catch (err) {
      console.error('Error deleting business:', err);
      setLoading(false);
      setError('שגיאה במחיקת העסק: בעיית תקשורת');
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