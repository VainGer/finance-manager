import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { get, post } from '../utils/api';

export default function useBudgets() {
  const { account, profile } = useAuth();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [childrenBudgets, setChildrenBudgets] = useState([]);
  const [selectedChildBudget, setSelectedChildBudget] = useState(null);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validDates, setValidDates] = useState(false);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      if (profile?.expenses) {
        const response = await get(`expenses/category/get-names/${profile.expenses}`);
        if (response.ok) {
          setCategoryBudgets(
            response.categoriesNames.map((cat) => ({ name: cat, budget: '' }))
          );
        } else {
          setError('Failed to load categories');
        }
      }
      setLoading(false);
    };
    fetchCategories();
  }, [profile]);

  const fetchBudgetsForChildren = useCallback(async () => {
    setLoading(true);
    try {
      const response = await get(
        `budgets/get-child-budgets?username=${account.username}&profileName=${profile.profileName}`
      );
      if (response.ok) {
        setChildrenBudgets(response.budgets);
      }
    } catch (err) {
      setError('Error fetching budgets');
    }
    setLoading(false);
  }, [account.username, profile.profileName]);

  useEffect(() => {
    if (!profile.parentProfile) fetchBudgetsForChildren();
  }, [profile, fetchBudgetsForChildren]);

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
    setLoading(true);
    if (!startDate || !endDate || parseFloat(amount) <= 0) {
      setError('אנא מלא את כל השדות');
      setLoading(false);
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
        setError(null);
        setLoading(false);
        return true;
      } else {
        setError('תקופת תקציב בתאריכים שהוזנו כבר קיימת');
        setStartDate('');
        setEndDate('');
        setLoading(false);
        return false;
      }
    } else {
      setError('אירעה שגיאה בבדיקת התאריכים');
      setLoading(false);
      return false;
    }
  }, [account.username, profile.profileName, startDate, endDate, amount]);

  const create = useCallback(async () => {
    setLoading(true);
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
      setSuccess('התקציב נוצר בהצלחה!');
      setError(null);
      setLoading(false);
      return true;
    } else {
      setError('נכשל ביצירת התקציב.');
      setLoading(false);
      return false;
    }
  }, [account.username, profile.profileName, profile.expenses, startDate, endDate, amount, categoryBudgets]);

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
    loading,
    resetState,
  };
}