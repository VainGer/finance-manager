import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useProfileData } from "../context/ProfileDataContext";
import { get, post, del } from "../utils/api";

export default function useBudgets({ setLoading }) {
  const { account, profile } = useAuth();
  const {
    fetchBudgets,
    categories,
    getCategoriesLoading,
    errors,
    profileBudgets,
    aiData,
    navigatedToProposedBudget,
    setNavigatedToProposedBudget
  } = useProfileData();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [childrenBudgets, setChildrenBudgets] = useState([]);
  const [childrenProfiles, setChildrenProfiles] = useState([]);
  const [selectedChildBudget, setSelectedChildBudget] = useState(null);
  const [prefillNextBudget, setPrefillNextBudget] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validDates, setValidDates] = useState(false);
  const [adviceToPrefill, setAdviceToPrefill] = useState(false);
  const skipAdviceRef = useRef(false);


  useEffect(() => {
    if (navigatedToProposedBudget) {
      skipAdviceRef.current = true;
      setAdviceToPrefill(false);
      setPrefillNextBudget(true);
      setNavigatedToProposedBudget(false);
    }
  }, [navigatedToProposedBudget]);


  useEffect(() => {
    if (prefillNextBudget && aiData?.length) {
      const latestHistory = aiData[0];
      const plan = latestHistory?.coachOutput?.nextMonthPlan;

      if (!plan?.proposedBudgets?.length) {
        console.warn("[AI Prefill] No proposedBudgets found in AI data.");
        return;
      }

      const prefilledCategories = plan.proposedBudgets.map((p) => ({
        name: p.category,
        budget: String(p.proposed || 0),
        include: true,
      }));

      setCategoryBudgets(prefilledCategories);

      const total = plan.proposedBudgets.reduce(
        (sum, c) => sum + (parseFloat(c.proposed) || 0),
        0
      );
      setAmount(String(total));

      setPrefillNextBudget(false);
    }
  }, [prefillNextBudget, aiData]);

  useEffect(() => {
    if (!aiData?.length || !profileBudgets?.length) return;

    const aiEnd = new Date(aiData[0].endDate);
    const profileEnd = new Date(profileBudgets[0].endDate);

    if (isNaN(aiEnd) || isNaN(profileEnd)) return;

    if (aiEnd.getTime() === profileEnd.getTime() && !skipAdviceRef.current) {
      setTimeout(() => setAdviceToPrefill(true), 100);
    }

    skipAdviceRef.current = false;
  }, [aiData, profileBudgets, startDate, endDate]);


  useEffect(() => {
    const categoryErrors = errors.find(e => e.categoriesErrors)?.categoriesErrors;
    const budgetErrors = errors.find(e => e.budgetErrors)?.budgetErrors;

    if (categoryErrors?.length) setError(categoryErrors[0]);
    else if (budgetErrors?.length) setError(budgetErrors[0]);
    else setError(null);
  }, [errors]);

  const resetState = useCallback(() => {
    setStartDate("");
    setEndDate("");
    setAmount("");
    skipAdviceRef.current = false;
    if (categories?.length) {
      setCategoryBudgets(categories.map(cat => ({ name: cat, budget: "", include: true })));
    } else {
      setCategoryBudgets([]);
    }
    setChildrenBudgets([]);
    setSelectedChildBudget(null);
    setError(null);
    setSuccess(null);
    setValidDates(false);
    setLoading(false);
  }, [setLoading]);


  useEffect(() => {
    if (categories?.length) {
      setCategoryBudgets(categories.map(cat => ({ name: cat, budget: "", include: true })));
    }
  }, [categories]);

  useEffect(() => {
    setLoading(getCategoriesLoading);
  }, [getCategoriesLoading, setLoading]);

  const fetchBudgetsForChildren = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await get(
        `budgets/get-child-budgets?username=${encodeURIComponent(account.username)}&profileName=${encodeURIComponent(profile.profileName)}`
      );
      if (response.ok) {
        setChildrenBudgets(response.budgets);
        return;
      }
      handleErrorByStatus(response.status, {
        400: "בקשה לא תקינה בטעינת תקציבים",
        404: "לא נמצאו תקציבים",
        500: "שגיאת שרת בטעינת תקציבי ילדים",
        default: "שגיאה בטעינת תקציבי ילדים",
      });
    } catch (err) {
      console.error("Child budgets fetch error:", err);
      setError("תקשורת עם השרת נכשלה");
    } finally {
      setLoading(false);
    }
  }, [account.username, profile.profileName, setLoading]);

  const fetchChildrenProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await get(`profile/get-profiles?username=${encodeURIComponent(account.username)}`);
      if (response.ok) {
        setChildrenProfiles(response.profiles.filter(p => !p.parentProfile));
        return;
      }
      handleErrorByStatus(response.status, {
        400: "בקשה לא תקינה בטעינת פרופילים",
        404: "לא נמצאו פרופילי ילדים",
        500: "שגיאת שרת בטעינת פרופילים",
        default: "שגיאה בטעינת פרופילי ילדים",
      });
    } catch (err) {
      console.error("Children profiles fetch error:", err);
      setError("תקשורת עם השרת נכשלה");
    } finally {
      setLoading(false);
    }
  }, [account.username, setLoading]);

  useEffect(() => {
    if (!profile.parentProfile) fetchBudgetsForChildren();
    else fetchChildrenProfiles();
  }, [profile, fetchBudgetsForChildren, fetchChildrenProfiles]);


  const remainingAmount = useMemo(() => {
    const total = categoryBudgets.reduce((sum, cat) => {
      if (!cat.include) return sum;
      return sum + (parseFloat(cat.budget) || 0);
    }, 0);
    return (parseFloat(amount) || 0) - total;
  }, [categoryBudgets, amount]);

  const handleCategoryBudgetChange = useCallback((index, value) => {
    setCategoryBudgets(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], budget: value };
      return updated;
    });
  }, []);

  const handleCategoryIncludeToggle = useCallback((index, value) => {
    setCategoryBudgets(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], include: value };
      return updated;
    });
  }, []);

  const handleChildBudgetSelect = useCallback(index => {
    setSelectedChildBudget(index);
    const b = childrenBudgets[index];
    setStartDate(b.startDate);
    setEndDate(b.endDate);
    setAmount(String(b.amount));
  }, [childrenBudgets]);

  const setDates = useCallback(async () => {
    if (!startDate || !endDate) {
      setError("אנא בחר תאריכים");
      return false;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setError("תאריך התחלה חייב להיות לפני תאריך סיום");
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await post("budgets/check-budget-dates", {
        username: account.username,
        profileName: profile.profileName,
        startDate,
        endDate,
      });

      if (response.ok) {
        if (response.isValid) {
          setValidDates(true);
          return true;
        }
        setError("תקופת תקציב בתאריכים שהוזנו כבר קיימת");
        setStartDate("");
        setEndDate("");
        return false;
      }

      handleErrorByStatus(response.status, {
        400: "נתוני תאריכים לא תקינים",
        404: "פרופיל לא נמצא",
        500: "שגיאת שרת בבדיקת התאריכים",
        default: "אירעה שגיאה בבדיקת התאריכים",
      });
      return false;
    } catch (err) {
      console.error("Date check error:", err);
      setError("תקשורת עם השרת נכשלה");
      return false;
    } finally {
      setLoading(false);
    }
  }, [account.username, profile.profileName, startDate, endDate, setLoading]);


  const create = useCallback(async () => {
    if (!startDate || !endDate || parseFloat(amount) <= 0) {
      setError("אנא מלא את כל השדות");
      return false;
    }

    const finalBudgets = [];
    for (const cat of categoryBudgets) {
      if (!cat.include) continue;
      const amt = parseFloat(cat.budget);
      if (!amt || amt <= 0) {
        setError("יש להקצות סכום חיובי לכל קטגוריה שנבחרה");
        return false;
      }
      finalBudgets.push({ categoryName: cat.name, amount: amt });
    }

    if (finalBudgets.length === 0) {
      setError("יש לבחור לפחות קטגוריה אחת לתקציב");
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await post("budgets/add-budget", {
        budgetData: {
          username: account.username,
          profileName: profile.profileName,
          refId: profile.expenses,
          profileBudget: { startDate, endDate, amount: parseFloat(amount) || 0, spent: 0 },
          categoriesBudgets: finalBudgets,
        },
      });

      if (response.ok) {
        await fetchBudgets();
        setSuccess("התקציב נוצר בהצלחה!");
        setTimeout(() => setSuccess(null), 2000);
        return true;
      }

      handleErrorByStatus(response.status, {
        400: "נתוני תקציב לא תקינים",
        404: "פרופיל לא נמצא",
        409: "תקציב לתקופה זו כבר קיים",
        500: "שגיאת שרת ביצירת התקציב",
        default: "נכשל ביצירת התקציב",
      });
      return false;
    } catch (err) {
      console.error("Budget creation error:", err);
      setError("תקשורת עם השרת נכשלה");
      return false;
    } finally {
      setLoading(false);
    }
  }, [account.username, profile.profileName, profile.expenses, startDate, endDate, amount, categoryBudgets, fetchBudgets, setLoading]);

  const addChildBudget = useCallback(
    async ({ profileName, startDate: sDate, endDate: eDate, amount: amt }) => {
      if (!sDate || !eDate || parseFloat(amt) <= 0) {
        setError("אנא מלא את כל נתוני התקציב");
        return false;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await post("budgets/add-child-budget", {
          username: account.username,
          profileName,
          budget: { startDate: sDate, endDate: eDate, amount: parseFloat(amt) || 0 },
        });

        if (response.ok) {
          setSuccess("התקציב נוסף בהצלחה");
          setTimeout(() => setSuccess(null), 2000);
          fetchBudgetsForChildren();
          return true;
        }

        handleErrorByStatus(response.status, {
          400: "נתוני תקציב לא תקינים",
          404: "פרופיל ילד לא נמצא",
          409: "תקציב לתקופה זו כבר קיים",
          500: "שגיאת שרת בהוספת תקציב",
          default: "אירעה שגיאה בעת הוספת התקציב",
        });
        return false;
      } catch (err) {
        console.error("Child budget addition error:", err);
        setError("תקשורת עם השרת נכשלה");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [account.username, fetchBudgetsForChildren, setLoading]
  );

  const deleteBudget = async (budgetId) => {
    if (!budgetId) {
      setError("לא נבחר תקציב למחיקה");
      return false;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await del(
        `budgets/delete-budget/${encodeURIComponent(account.username)}/${encodeURIComponent(profile.profileName)}/${budgetId}`
      );
      if (response.ok) {
        await fetchBudgets();
        setSuccess("התקציב נמחק בהצלחה");
        setTimeout(() => setSuccess(null), 3000);
        return true;
      }

      switch (response.status) {
        case 400:
          setError("בקשה לא תקינה למחיקת תקציב");
          break;
        case 404:
          setError("התקציב לא נמצא או שהפרופיל לא קיים");
          break;
        case 500:
          setError("שגיאת שרת בעת מחיקת התקציב");
          break;
        default:
          setError("שגיאה במחיקת התקציב");
      }

      return false;
    } catch (err) {
      console.error("Budget deletion error:", err);
      setError("תקשורת עם השרת נכשלה");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleErrorByStatus = (status, messages) => {
    const msg = messages[status] || messages.default;
    setError(msg);
  };

  return {
    account,
    profile,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    amount,
    setAmount,
    categoryBudgets,
    handleCategoryBudgetChange,
    handleCategoryIncludeToggle,
    childrenBudgets,
    selectedChildBudget,
    handleChildBudgetSelect,
    error,
    setError,
    success,
    setSuccess,
    validDates,
    setValidDates,
    remainingAmount,
    setDates,
    create,
    resetState,
    childrenProfiles,
    addChildBudget,
    profileBudgets,
    deleteBudget,
    setPrefillNextBudget,
    adviceToPrefill,
    setAdviceToPrefill
  };
}
