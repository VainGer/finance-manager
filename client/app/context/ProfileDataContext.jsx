import { usePathname } from 'expo-router';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { get } from '../utils/api';
import { useAuth } from './AuthContext';
import useAIHistory from '../hooks/useAiHistory';

const ProfileDataContext = createContext();


export function ProfileDataProvider({ children }) {
    const { account, profile, isTokenReady, isExpiredToken } = useAuth();
    const { history: aiData, newDataReady, startPolling } = useAIHistory();
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
    const [canBuildNewBudget, setCanBuildNewBudget] = useState(false);
    const prevProfileId = useRef(profile?._id);
    const prevAccountUsername = useRef(account?.username);
    const pathname = usePathname();
    const restrictedPaths = ['/', '/login', '/authProfile', '/register'];


    const fetchBudgets = async () => {
        if (!account || !profile) {
            return false;
        }
        try {
            setErrors(prev => prev.filter(e => !e.budgetErrors));
            setBudgetLoading(true);
            let errMsg = [];
            const response = await get(`budgets/get-profile-budgets?username=${encodeURIComponent(account.username)}&profileName=${encodeURIComponent(profile.profileName)}`);
            if (response.ok) {
                const sortedProfileBudgets = response.profileBudgets.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
                setProfileBudgets(sortedProfileBudgets || []);
                setCategoryBudgets(response.categoryBudgets || []);
                console.log(JSON.stringify(response.categoryBudgets, null, 2));
            } else {
                switch (response.status) {
                    case 400: errMsg.push('בקשה לא תקינה בטעינת תקציבי הפרופיל'); break;
                    case 404: errMsg.push('לא נמצאו תקציבי פרופיל'); break;
                    case 500: errMsg.push('שגיאת שרת בטעינת תקציבי פרופיל'); break;
                    default: errMsg.push('שגיאה בטעינת תקציבי פרופיל'); break;
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
    };

    const fetchExpenses = async () => {
        if (!profile?.expenses) {
            return false;
        }
        setErrors(prev => prev.filter(e => !e.expensesErrors));
        setExpensesLoading(true);
        try {
            const response = await get(`expenses/profile-expenses/${encodeURIComponent(profile.expenses)}`);
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
    };



    const fetchCategories = async () => {
        if (!profile?.expenses) return;

        setGetCategoriesLoading(true);
        try {
            setErrors(prev => prev.filter(e => !e.categoriesErrors));
            const response = await get(`expenses/category/get-names/${encodeURIComponent(profile.expenses)}`);
            if (response.ok) {
                setCategories(response.categoriesNames || []);
                setGetBusinessesLoading(true);
                await fetchAllBusinesses(response.categoriesNames || []);
                return;
            }
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
        } catch (error) {
            setErrors(prev => [{ categoriesErrors: ['תקשורת עם השרת נכשלה בעת טעינת קטגוריות'] }, ...prev]);
            console.error('Exception in fetchCategories:', error);
        } finally {
            setGetCategoriesLoading(false);
            setGetBusinessesLoading(false);
        }
    };

    const fetchBusinesses = async (category) => {
        if (!profile?.expenses) return [];
        try {
            setErrors(prev => prev.filter(e => !e.businessesErrors));
            const response = await get(
                `expenses/business/get-businesses/${profile.expenses}/${encodeURIComponent(category)}`
            );
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
            setErrors(prev => [{ businessesErrors: ['תקשורת עם השרת נכשלה בעת טעינת בעלי העסקים'] }, ...prev]);
            return [];
        }
    };

    const fetchAllBusinesses = async (categories) => {
        if (categories.length > 0) {
            let allBusinesses = [];
            for (const category of categories) {
                const businesses = await fetchBusinesses(category);
                allBusinesses = [...allBusinesses, { category: category, businesses: businesses }]
            }
            setBusinesses(allBusinesses);
        }
    };




    useEffect(() => {
        if (!dataLoaded && account && profile && isTokenReady && !isExpiredToken && !restrictedPaths.includes(pathname)) {
            setExpensesLoading(true);
            const fetchData = async () => {
                await fetchBudgets();
                await fetchExpenses();
                await fetchCategories();
            }
            fetchData();
            startPolling();
            setDataLoaded(true);
        }
    }, [account, profile, isTokenReady, isExpiredToken, pathname, dataLoaded]);

    useEffect(() => {
        if (profile?._id !== prevProfileId.current ||
            account?.username !== prevAccountUsername.current || restrictedPaths.includes(pathname)) {
            setDataLoaded(false);
            prevProfileId.current = profile?._id;
            prevAccountUsername.current = account?.username;
            setCategories([]);
            setBusinesses([]);
            setProfileBudgets([]);
            setCategoryBudgets([]);
            setExpenses([]);
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
        aiData,
        newDataReady,
        canBuildNewBudget,
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