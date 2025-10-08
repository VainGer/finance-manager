import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { get } from "../../utils/api";
import { useLocation } from "react-router-dom";

export default function useChildrenData() {
    const { profile } = useAuth();
    const children = profile?.children || [];
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [childrenExpenses, setChildrenExpenses] = useState([]);
    const [childrenProfileBudgets, setChildrenProfileBudgets] = useState([]);
    const [childrenCategoryBudgets, setChildrenCategoryBudgets] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [childrenCategories, setChildrenCategories] = useState([]);
    const [childrenBusinesses, setChildrenBusinesses] = useState([]);
    const location = useLocation();
    const pathname = location.pathname;

    useEffect(() => {
        if (selectedChild) {
            fetchChildrenExpenses(selectedChild);
            fetchChildrenBudgets(selectedChild);
        }
    }, [selectedChild]);

    const resetStates = () => {
        setError(null);
        setLoading(false);
        setSelectedChild(null);
        setChildrenExpenses([]);
        setChildrenProfileBudgets([]);
        setChildrenCategoryBudgets([]);
    };

    useEffect(() => {
        resetStates();
    }, [profile, pathname]);

    const fetchChildrenExpenses = async (selectedChild) => {
        if (!profile?.children || profile.children.length === 0) return;
        setLoading(true);
        setError(null);
        try {
            const response = await get(`expenses/profile-expenses/child/${profile.username}/${selectedChild.id}`);
            if (response.ok) {
                setChildrenExpenses(response.expenses);
                const categories = [];
                const businesses = [];
                response.expenses.forEach(expense => {
                    categories.push(expense.name);
                    businesses.push({ category: expense.name, businesses: [] });
                    expense.Businesses.forEach(biz => {
                        businesses.find(c => c.category === expense.name).businesses.push(biz.name);
                    });
                });
                setChildrenCategories(categories);
                setChildrenBusinesses(businesses);
            } else {
                switch (response.status) {
                    case 400: setError('בקשה לא תקינה בטעינת הוצאות'); break;
                    case 404: setError('לא נמצאו הוצאות'); break;
                    case 500: setError('שגיאת שרת בטעינת הוצאות'); break;
                    default: setError('שגיאה בטעינת הוצאות'); break;
                }
            }
        } catch (error) {
            console.error("Error fetching children expenses:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchChildrenBudgets = async (selectedChild) => {
        if (!profile?.children || profile.children.length === 0) return;
        try {
            setLoading(true);
            setError(null);
            const response = await get(
                `budgets/get-profile-budgets?username=${profile.username}&profileName=${selectedChild.name}`);
            if (response.ok) {
                setChildrenProfileBudgets(response.budgets.budgets.profile || []);
                setChildrenCategoryBudgets(response.budgets.budgets.categories || []);
            }
            else {
                switch (response.status) {
                    case 400: setError('בקשה לא תקינה בטעינת תקציבי הפרופיל'); break;
                    case 404: setError('לא נמצאו תקציבי פרופיל'); break;
                    case 500: setError('שגיאת שרת בטעינת תקציבי פרופיל'); break;
                    default: setError('שגיאה בטעינת תקציבי פרופיל'); break;
                }
            }
        } catch (error) {
            console.error("Error fetching children budgets:", error);
        } finally {
            setLoading(false);
        }
    };

    return {
        children,
        loading,
        error,
        childrenExpenses,
        childrenProfileBudgets,
        childrenCategoryBudgets,
        selectedChild,
        setSelectedChild,
        childrenCategories,
        childrenBusinesses
    }
}