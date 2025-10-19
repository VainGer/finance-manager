import { useLocation } from 'react-router-dom';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { get } from '../utils/api';
import { useAuth } from './AuthContext';
import useAIHistory from '../hooks/useAiHistory';

const ProfileDataContext = createContext();

function useSafeLocation() {
    try {
        return useLocation();
    } catch {
        return { pathname: '/' };
    }
}

export function ProfileDataProvider({ children }) {
    const { account, profile, isTokenReady, isExpiredToken } = useAuth();
    const { history: aiHistory, newDataReady, startPolling } = useAIHistory();

    const [categories, setCategories] = useState([]);
    const [businesses, setBusinesses] = useState([]);
    const [profileBudgets, setProfileBudgets] = useState([]);
    const [categoryBudgets, setCategoryBudgets] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [errors, setErrors] = useState([]);
    const [budgetLoading, setBudgetLoading] = useState(false);
    const [expensesLoading, setExpensesLoading] = useState(false);
    const [getCategoriesLoading, setGetCategoriesLoading] = useState(false);
    const [getBusinessesLoading, setGetBusinessesLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);

    const prevProfileId = useRef(profile?._id);
    const prevAccountUsername = useRef(account?.username);
    const location = useSafeLocation();
    const pathname = location.pathname;
    const restrictedPaths = ['/login', '/register'];


    const STORAGE_KEY = 'profileData';


    const loadCache = () => {
        try {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    };

    const saveCache = (partial) => {
        try {
            const current = loadCache() || {};
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...partial }));
        } catch (e) {
            console.error('Failed to save profile data to cache', e);
        }
    };

    const clearCache = () => {
        sessionStorage.removeItem(STORAGE_KEY);
    };


    const fetchBudgets = async () => {
        if (!account || !profile) return false;
        try {
            setErrors(prev => prev.filter(e => !e.budgetErrors));
            setBudgetLoading(true);

            const response = await get(`budgets/get-profile-budgets?username=${encodeURIComponent(account.username)}&profileName=${encodeURIComponent(profile.profileName)}`);
            if (response.ok) {
                const sortedProfileBudgets = response.profileBudgets.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
                setProfileBudgets(sortedProfileBudgets || []);
                setCategoryBudgets(response.categoryBudgets || []);
                saveCache({ profileBudgets: sortedProfileBudgets, categoryBudgets: response.categoryBudgets });
            } else {
                const msg = {
                    400: 'בקשה לא תקינה בטעינת תקציבי הפרופיל',
                    404: 'לא נמצאו תקציבי פרופיל',
                    500: 'שגיאת שרת בטעינת תקציבי פרופיל'
                }[response.status] || 'שגיאה בטעינת תקציבי פרופיל';
                setErrors(prev => [{ budgetErrors: [msg] }, ...prev]);
            }
        } catch {
            setErrors(prev => [{ budgetErrors: ['שגיאה בטעינת תקציבים'] }, ...prev]);
            return false;
        } finally {
            setBudgetLoading(false);
        }
        return true;
    };

    const fetchExpenses = async () => {
        if (!profile?.expenses) return false;
        setErrors(prev => prev.filter(e => !e.expensesErrors));
        setExpensesLoading(true);
        try {
            const response = await get(`expenses/profile-expenses/${encodeURIComponent(profile.expenses)}`);
            if (response.ok) {
                const exp = response.expenses || [];
                setExpenses(exp);
                saveCache({ expenses: exp });
            } else {
                const msg = {
                    400: 'בקשה לא תקינה בטעינת הוצאות',
                    404: 'לא נמצאו הוצאות',
                    500: 'שגיאת שרת בטעינת הוצאות'
                }[response.status] || 'שגיאה בטעינת הוצאות';
                setErrors(prev => [{ expensesErrors: [msg] }, ...prev]);
            }
        } catch {
            setErrors(prev => [{ expensesErrors: ['שגיאה בטעינת הוצאות'] }, ...prev]);
            return false;
        } finally {
            setExpensesLoading(false);
        }
        return true;
    };

    const fetchBusinesses = async (category) => {
        if (!profile?.expenses) return [];
        try {
            setErrors(prev => prev.filter(e => !e.businessesErrors));
            const response = await get(`expenses/business/get-businesses/${profile.expenses}/${encodeURIComponent(category)}`);
            if (response.ok) {
                return response.businesses;
            } else {
                const msg = {
                    400: 'בקשה לא תקינה בטעינת בעלי העסקים, נסה שוב מאוחר יותר',
                    404: 'לא נמצאה הקטגוריה המבוקשת',
                    500: 'שגיאת שרת בטעינת בעלי העסקים, נסה שוב מאוחר יותר'
                }[response.status];
                setErrors(prev => [{ businessesErrors: [msg] }, ...prev]);
                return [];
            }
        } catch {
            setErrors(prev => [{ businessesErrors: ['תקשורת עם השרת נכשלה בעת טעינת בעלי העסקים'] }, ...prev]);
            return [];
        }
    };

    const fetchAllBusinesses = async (categories) => {
        if (categories.length > 0) {
            let allBusinesses = [];
            for (const category of categories) {
                const businesses = await fetchBusinesses(category);
                allBusinesses = [...allBusinesses, { category, businesses }];
            }
            setBusinesses(allBusinesses);
            saveCache({ businesses: allBusinesses });
        }
    };

    const fetchCategories = async () => {
        if (!profile?.expenses) return;
        setGetCategoriesLoading(true);
        try {
            setErrors(prev => prev.filter(e => !e.categoriesErrors));
            const response = await get(`expenses/category/get-names/${profile.expenses}`);
            if (response.ok) {
                const cats = response.categoriesNames || [];
                setCategories(cats);
                saveCache({ categories: cats });
                setGetBusinessesLoading(true);
                await fetchAllBusinesses(cats);
            } else {
                const msg = {
                    400: 'בקשה לא תקינה בטעינת קטגוריות',
                    404: 'לא נמצאו קטגוריות',
                    500: 'שגיאת שרת בטעינת קטגוריות'
                }[response.status] || 'שגיאה בטעינת קטגוריות';
                setErrors(prev => [{ categoriesErrors: [msg] }, ...prev]);
            }
        } catch (error) {
            setErrors(prev => [{ categoriesErrors: ['תקשורת עם השרת נכשלה בעת טעינת קטגוריות'] }, ...prev]);
        } finally {
            setGetCategoriesLoading(false);
            setGetBusinessesLoading(false);
        }
    };


    useEffect(() => {
        const cached = loadCache();
        if (cached && !dataLoaded) {
            setCategories(cached.categories || []);
            setBusinesses(cached.businesses || []);
            setProfileBudgets(cached.profileBudgets || []);
            setCategoryBudgets(cached.categoryBudgets || []);
            setExpenses(cached.expenses || []);
        }
    }, []);


    useEffect(() => {
        if (!dataLoaded && account && profile && isTokenReady && !isExpiredToken && !restrictedPaths.includes(pathname)) {
            const fetchData = async () => {
                await fetchBudgets();
                await fetchExpenses();
                await fetchCategories();
            };
            fetchData();
            startPolling();
            setDataLoaded(true);
        }
    }, [account, profile, isTokenReady, isExpiredToken, pathname, dataLoaded]);


    useEffect(() => {
        if (profile?._id !== prevProfileId.current ||
            account?.username !== prevAccountUsername.current ||
            restrictedPaths.includes(pathname)) {

            clearCache();

            setDataLoaded(false);
            setCategories([]);
            setBusinesses([]);
            setProfileBudgets([]);
            setCategoryBudgets([]);
            setExpenses([]);

            prevProfileId.current = profile?._id;
            prevAccountUsername.current = account?.username;
        }
    }, [profile, account, pathname]);

    const loading = budgetLoading || expensesLoading || getCategoriesLoading || getBusinessesLoading;

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
        dataLoaded,
        aiHistory,
        newDataReady,
        fetchBudgets,
        fetchExpenses,
        fetchCategories,
        fetchBusinesses,
        setDataLoaded
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
