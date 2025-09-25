import { usePathname, useRouter } from 'expo-router';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { get } from '../utils/api';
import { useAuth } from './AuthContext';
const ProfileDataContext = createContext();


export function ProfileDataProvider({ children }) {
    const { account, profile } = useAuth();
    const [categories, setCategories] = useState([]);
    const [businesses, setBusinesses] = useState([]);
    const [profileBudgets, setProfileBudgets] = useState([]);
    const [categoryBudgets, setCategoryBudgets] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const [budgetLoading, setBudgetLoading] = useState(false);
    const [expensesLoading, setExpensesLoading] = useState(false);
    const [getCategoriesLoading, setGetCategoriesLoading] = useState(false);
    const [getBusinessesLoading, setGetBusinessesLoading] = useState(false);

    const fetchBudgets = useCallback(async () => {
        if (!account || !profile) {
            return false;
        }
        try {
            setBudgetLoading(true);
            let errMsg = [];
            const profileBudgetsRes = await get(
                `budgets/get-profile-budgets?username=${account.username}&profileName=${profile.profileName}`
            );

            const categoryBudgetsRes = await get(`budgets/get-category-budgets?refId=${profile.expenses}`);

            if (profileBudgetsRes.ok) {
                setProfileBudgets(profileBudgetsRes.budgets || []);
            } else {
                switch (profileBudgetsRes.status) {
                    case 400: errMsg.push('בקשה לא תקינה בטעינת תקציבי הפרופיל'); break;
                    case 404: errMsg.push('לא נמצאו תקציבי פרופיל'); break;
                    case 500: errMsg.push('שגיאת שרת בטעינת תקציבי פרופיל'); break;
                    default: errMsg.push('שגיאה בטעינת תקציבי פרופיל'); break;
                }
            }

            if (categoryBudgetsRes.ok) {
                setCategoryBudgets(categoryBudgetsRes.budgets || []);
            } else {
                switch (categoryBudgetsRes.status) {
                    case 400: errMsg.push('בקשה לא תקינה בטעינת תקציבי הקטגוריות'); break;
                    case 404: errMsg.push('לא נמצאו תקציבי קטגוריות'); break;
                    case 500: errMsg.push('שגיאת שרת בטעינת תקציבי קטגוריות'); break;
                    default: errMsg.push('שגיאה בטעינת תקציבי קטגוריות'); break;
                }
            }

            if (errMsg.length > 0) {
                setErrors(prev => [{ budgetErrors: errMsg }, ...prev]);
            }

        } catch (error) {
            setErrors(prev => [{ budgetErrors: ['שגיאה בטעינת תקציבים'] }, ...prev]);
            return false;
        } finally {
            setBudgetLoading(false);
        }
        return true;
    }, [account, profile]);

    const fetchExpenses = useCallback(async () => {
        if (!profile?.expenses) {
            return false;
        }
        setExpensesLoading(true);
        try {
            const response = await get(`expenses/profile-expenses/${profile.expenses}`);
            if (response.ok) {
                setExpenses(response.expenses || []);
            }
            else {
                switch (response.status) {
                    case 400: setErrors(prev => [{ expensesErrors: ['בקשה לא תקינה בטעינת הוצאות'] }, ...prev]); break;
                    case 404: setErrors(prev => [{ expensesErrors: ['לא נמצאו הוצאות'] }, ...prev]); break;
                    case 500: setErrors(prev => [{ expensesErrors: ['שגיאת שרת בטעינת הוצאות'] }, ...prev]); break;
                    default: setErrors(prev => [{ expensesErrors: ['שגיאה בטעינת הוצאות'] }, ...prev]); break;
                }
            }
        }
        catch (error) {
            setErrors(prev => [{ expensesErrors: ['שגיאה בטעינת הוצאות'] }, ...prev]);
            return false;
        } finally {
            setExpensesLoading(false);
        }
        return true;
    }, [profile]);



    const fetchCategories = useCallback(async () => {
        if (!profile?.expenses) return;

        setGetCategoriesLoading(true);
        try {
            const response = await get(`expenses/category/get-names/${profile.expenses}`);

            if (response.ok) {
                setCategories(response.categoriesNames || []);
            } else {
                let errorMsg;
                switch (response.status) {
                    case 400:
                        errorMsg = 'בקשה לא תקינה בטעינת קטגוריות';
                        break;
                    case 404:
                        errorMsg = 'לא נמצאו קטגוריות';
                        break;
                    case 500:
                        errorMsg = 'שגיאת שרת בטעינת קטגוריות';
                        break;
                    default:
                        errorMsg = 'שגיאה בטעינת קטגוריות';
                }
                setErrors(prev => [{ categoriesErrors: [errorMsg] }, ...prev]);
                console.error('Error fetching categories:', response.error || response.status);
            }
        } catch (error) {
            setErrors(prev => [{ categoriesErrors: ['תקשורת עם השרת נכשלה בעת טעינת קטגוריות'] }, ...prev]);
            console.error('Exception in fetchCategories:', error);
        } finally {
            setGetCategoriesLoading(false);
        }
    }, [profile?.expenses]);

    const fetchBusinesses = useCallback(async (category) => {
        if (!profile?.expenses) return [];
        try {
            setGetBusinessesLoading(true);
            const response = await get(`expenses/business/get-businesses/${profile.expenses}/${category}`);
            if (response.ok) {
                return response.businesses;
            } else {
                switch (response.status) {
                    case 400:
                        setErrors(prev => [{ businessesErrors: ['בקשה לא תקינה בטעינת בעלי העסקים, נסה שוב מאוחר יותר'] }, ...prev]);
                        break;
                    case 404:
                        setErrors(prev => [{ businessesErrors: ['לא נמצאה הקטגוריה המבוקשת'] }, ...prev]);
                        break;
                    case 500:
                        setErrors(prev => [{ businessesErrors: ['שגיאת שרת בטעינת בעלי העסקים, נסה שוב מאוחר יותר'] }, ...prev]);
                        break;
                }
                console.error('Error fetching businesses:', response.error);
                return [];
            }
        } catch (error) {
            console.error("Exception in getBusinesses:", error);
            return [];
        } finally {
            setGetBusinessesLoading(false);
        }
    }, [profile?.expenses]);

    useEffect(() => {
        if (categories.length > 0) {
            setGetBusinessesLoading(true);
            const fetchAllBusinesses = async () => {
                let allBusinesses = [];
                for (const category of categories) {
                    const businesses = await fetchBusinesses(category);
                    allBusinesses = [...allBusinesses, { category: category, businesses: businesses }]
                }
                setBusinesses(allBusinesses);
            }
            fetchAllBusinesses();
            setGetBusinessesLoading(false);
        }
    }, [categories])

    useEffect(() => {
        setLoading(budgetLoading || expensesLoading || getCategoriesLoading || getBusinessesLoading);
    }, [budgetLoading, expensesLoading, getCategoriesLoading, getBusinessesLoading]);

    useEffect(() => {
        if (account && profile) {
            setExpensesLoading(true);
            setTimeout(() => {
                fetchBudgets();
                fetchExpenses();
                fetchCategories();
            }, 50);
        } else {
            setProfileBudgets([]);
            setCategoryBudgets([]);
            setCategories([]);
            setBusinesses([]);
            setExpenses([]);
        }
    }, [account, profile, fetchBudgets, fetchExpenses]);



    const value = {
        categories,
        businesses,
        profileBudgets,
        categoryBudgets,
        expenses,
        loading,
        expensesLoading,
        budgetLoading,
        getCategoriesLoading,
        getBusinessesLoading,
        errors,
        fetchBudgets,
        fetchExpenses,
        fetchCategories,
        fetchBusinesses
    };



    return (
        <ProfileDataContext.Provider value={value}>
            {children}
        </ProfileDataContext.Provider>
    );
}

export function useProfileData() {
    const context = useContext(ProfileDataContext);
    if (!context) {
        throw new Error('useProfileData must be used within a ProfileDataProvider');
    }
    return context;
}
