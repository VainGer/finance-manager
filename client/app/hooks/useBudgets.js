import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfileData } from '../context/ProfileDataContext';
import { get, post } from '../utils/api';

export default function useBudgets({ setLoading }) {
  const { account, profile } = useAuth();
  const {
    fetchBudgets,
    categories,
    getCategoriesLoading,
    errors
  } = useProfileData();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [childrenBudgets, setChildrenBudgets] = useState([]);
  const [childrenProfiles, setChildrenProfiles] = useState([]);
  const [selectedChildBudget, setSelectedChildBudget] = useState(null);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validDates, setValidDates] = useState(false);


  useEffect(() => {
    const categoryErrors = errors.find(e => e.categoriesErrors)?.categoriesErrors;
    if (categoryErrors && categoryErrors.length > 0) {
      setError(categoryErrors[0]);
    }
  }, [errors]);

  const resetState = useCallback(() => {
    setStartDate('');
    setEndDate('');
    setAmount('');
    setCategoryBudgets([]);
    setChildrenBudgets([]);
    setSelectedChildBudget(null);
    setError(null);
    setSuccess(null);
    setValidDates(false);
    setLoading(false);
  }, []);

  // Use categories from context to populate categoryBudgets
  useEffect(() => {
    if (categories && categories.length > 0) {
      setCategoryBudgets(
        categories.map((cat) => ({ name: cat, budget: '' }))
      );
    }
  }, [categories]);

  // Update loading state when context categories are loading
  useEffect(() => {
    setLoading(getCategoriesLoading);
  }, [getCategoriesLoading, setLoading]);

  const fetchBudgetsForChildren = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await get(
        `budgets/get-child-budgets?username=${account.username}&profileName=${profile.profileName}`
      );

      if (response.ok) {
        setChildrenBudgets(response.budgets);
        return;
      }

      switch (response.status) {
        case 400:
          setError('בקשה לא תקינה בטעינת תקציבים');
          break;
        case 404:
          setError('לא נמצאו תקציבים');
          break;
        case 500:
          setError('שגיאת שרת בטעינת תקציבי ילדים');
          break;
        default:
          setError('שגיאה בטעינת תקציבי ילדים');
      }
    } catch (err) {
      console.error('Child budgets fetch error:', err);
      setError('תקשורת עם השרת נכשלה');
    } finally {
      setLoading(false);
    }
  }, [account.username, profile.profileName]);

  const fetchChildrenProfiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await get(`profile/get-profiles?username=${account.username}`);

      if (response.ok) {
        setChildrenProfiles(response.profiles.filter((p) => !p.parentProfile));
        return;
      }

      switch (response.status) {
        case 400:
          setError('בקשה לא תקינה בטעינת פרופילים');
          break;
        case 404:
          setError('לא נמצאו פרופילי ילדים');
          break;
        case 500:
          setError('שגיאת שרת בטעינת פרופילים');
          break;
        default:
          setError('שגיאה בטעינת פרופילי ילדים');
      }
    } catch (err) {
      console.error('Children profiles fetch error:', err);
      setError('תקשורת עם השרת נכשלה');
    } finally {
      setLoading(false);
    }
  }, [account.username]);

  useEffect(() => {
    if (!profile.parentProfile) fetchBudgetsForChildren();
    if (profile.parentProfile) fetchChildrenProfiles();
  }, [profile, fetchBudgetsForChildren, fetchChildrenProfiles]);

  const remainingAmount = useMemo(() => {
    const totalSpent = categoryBudgets.reduce(
      (total, category) => total + (parseFloat(category.budget) || 0),
      0
    );
    return (parseFloat(amount) || 0) - totalSpent;
  }, [categoryBudgets, amount]);

  const handleCategoryBudgetChange = useCallback((index, value) => {
    setCategoryBudgets((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], budget: value };
      return updated;
    });
  }, []);

  const handleChildBudgetSelect = useCallback((index) => {
    setSelectedChildBudget(index);
    const budget = childrenBudgets[index];
    setStartDate(budget.startDate);
    setEndDate(budget.endDate);
    setAmount(String(budget.amount));
  }, [childrenBudgets]);

  const setDatesAndSum = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!startDate || !endDate || parseFloat(amount) <= 0) {
        setError('אנא מלא את כל השדות');
        return false;
      }

      const response = await post('budgets/check-budget-dates', {
        username: account.username,
        profileName: profile.profileName,
        startDate,
        endDate
      });

      if (response.ok) {
        if (response.isValid) {
          setValidDates(true);
          return true;
        } else {
          setError('תקופת תקציב בתאריכים שהוזנו כבר קיימת');
          setStartDate('');
          setEndDate('');
          return false;
        }
      }

      switch (response.status) {
        case 400:
          setError('נתוני תאריכים לא תקינים');
          break;
        case 404:
          setError('פרופיל לא נמצא');
          break;
        case 500:
          setError('שגיאת שרת בבדיקת התאריכים');
          break;
        default:
          setError('אירעה שגיאה בבדיקת התאריכים');
      }
      return false;
    } catch (err) {
      console.error('Date check error:', err);
      setError('תקשורת עם השרת נכשלה');
      return false;
    } finally {
      setLoading(false);
    }
  }, [account.username, profile.profileName, startDate, endDate, amount]);

  const create = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const finalCategoryBudgets = categoryBudgets
        .filter((cat) => parseFloat(cat.budget) > 0)
        .map((cat) => ({
          categoryName: cat.name,
          amount: parseFloat(cat.budget) || 0
        }));


      const response = await post('budgets/add-budget', {
        budgetData: {
          username: account.username,
          profileName: profile.profileName,
          refId: profile.expenses,
          profileBudget: {
            startDate,
            endDate,
            amount: parseFloat(amount) || 0,
            spent: 0
          },
          categoriesBudgets: finalCategoryBudgets
        }
      });

      if (response.ok) {
        await fetchBudgets();
        setSuccess('התקציב נוצר בהצלחה!');
        return true;
      }

      switch (response.status) {
        case 400:
          setError('נתוני תקציב לא תקינים');
          break;
        case 404:
          setError('פרופיל לא נמצא');
          break;
        case 409:
          setError('תקציב לתקופה זו כבר קיים');
          break;
        case 500:
          setError('שגיאת שרת ביצירת התקציב');
          break;
        default:
          setError('נכשל ביצירת התקציב');
      }
      return false;
    } catch (err) {
      console.error('Budget creation error:', err);
      setError('תקשורת עם השרת נכשלה');
      return false;
    } finally {
      setLoading(false);
    }
  }, [account.username, profile.profileName, profile.expenses, startDate, endDate, amount, categoryBudgets]);

  const addChildBudget = useCallback(async ({ profileName, startDate: sDate, endDate: eDate, amount: amt }) => {
    try {
      setLoading(true);
      setError(null);

      if (!sDate || !eDate || parseFloat(amt) <= 0) {
        setError('אנא מלא את כל נתוני התקציב');
        return false;
      }

      const response = await post('budgets/add-child-budget', {
        username: account.username,
        profileName,
        budget: {
          startDate: sDate,
          endDate: eDate,
          amount: parseFloat(amt) || 0,
        },
      });

      if (response.ok) {
        setSuccess('התקציב נוסף בהצלחה');
        fetchBudgetsForChildren();
        fetchChildrenProfiles();
        return true;
      }

      switch (response.status) {
        case 400:
          setError('נתוני תקציב לא תקינים');
          break;
        case 404:
          setError('פרופיל ילד לא נמצא');
          break;
        case 409:
          setError('תקציב לתקופה זו כבר קיים');
          break;
        case 500:
          setError('שגיאת שרת בהוספת תקציב');
          break;
        default:
          setError('אירעה שגיאה בעת הוספת התקציב');
      }
      return false;
    } catch (err) {
      console.error('Child budget addition error:', err);
      setError('תקשורת עם השרת נכשלה');
      return false;
    } finally {
      setLoading(false);
    }
  }, [account.username, fetchBudgetsForChildren, fetchChildrenProfiles]);

  return {
    account,
    profile,
    startDate, setStartDate,
    endDate, setEndDate,
    amount, setAmount,
    categoryBudgets, handleCategoryBudgetChange,
    childrenBudgets, selectedChildBudget, handleChildBudgetSelect,
    error, setError,
    success, setSuccess,
    validDates, setValidDates,
    remainingAmount,
    setDatesAndSum,
    create,
    resetState,
    childrenProfiles,
    addChildBudget,
  };
}