import { useState, useEffect, useCallback } from "react";
import { post } from "../../utils/api";

export default function useAdminBudgets() {
    const [groupedProfiles, setGroupedProfiles] = useState([]);

    const [rawBudgets, setRawBudgets] = useState({ profile: [], categories: [] });

    const [processedBudgets, setProcessedBudgets] = useState({});
    const [availablePeriods, setAvailablePeriods] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [currentProfileBudget, setCurrentProfileBudget] = useState(null);
    const [currentCategoryBudgets, setCurrentCategoryBudgets] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const fetchGroupedProfiles = useCallback(async () => {
        setError("");
        try {
            const res = await post("admin/profiles");
            if (res.ok) {
                setGroupedProfiles(res.groupedProfiles || []);
            } else {
                setError(res.message || "שגיאה בטעינת רשימת החשבונות");
            }
        } catch {
            setError("שגיאת שרת בטעינת החשבונות");
        }
    }, []);


    const fetchBudgets = useCallback(async (username, profileName) => {
        setLoading(true);
        setError("");
        try {
            const res = await post("admin/budgets/profile", { username, profileName });
            if (res.ok) {
                const profileBudgets = res.budgets?.budgets.profile || [];
                const categoryBudgets = res.budgets?.budgets.categories || [];

                setRawBudgets({ profile: profileBudgets, categories: categoryBudgets });
                processBudgets(profileBudgets, categoryBudgets);
            } else {
                setRawBudgets({ profile: [], categories: [] });
                setProcessedBudgets({});
                setAvailablePeriods([]);
                setSelectedPeriod(null);
                setError(res.message || "שגיאה בטעינת התקציבים");
            }
        } catch {
            setError("שגיאת שרת בטעינת התקציבים");
            setRawBudgets({ profile: [], categories: [] });
            setProcessedBudgets({});
            setAvailablePeriods([]);
            setSelectedPeriod(null);
        } finally {
            setLoading(false);
        }
    }, []);


    const deleteBudget = useCallback(async (username, profileName, budgetId) => {
        setError("");
        setLoading(true);
        try {
            const res = await post("admin/budgets/delete", {
                username,
                profileName,
                budgetId,
            });
            if (!res.ok) {
                throw new Error(res.message || "שגיאה במחיקת התקציב");
            }
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);


    const processBudgets = (profileArr, categoryArr) => {
        const map = {};
        profileArr.forEach(b => {
            const id = b._id?.$oid || b._id || b.id;
            map[id] = {
                profileBudget: b,
                categories: [],
            };
        });

        categoryArr.forEach(cat => {
            cat.budgets.forEach(catBudget => {
                const id = catBudget._id?.$oid || catBudget._id || catBudget.id;
                if (map[id]) {
                    map[id].categories.push({
                        name: cat.name,
                        budget: catBudget.amount,
                        spent: catBudget.spent || 0,
                    });
                }
            });
        });

        setProcessedBudgets(map);
        buildAvailablePeriods(profileArr);
    };

    const buildAvailablePeriods = (profileArr) => {
        if (!profileArr?.length) {
            setAvailablePeriods([]);
            setSelectedPeriod(null);
            return;
        }

        const periods = profileArr
            .map(b => ({
                id: b._id,
                startDate: b.startDate,
                endDate: b.endDate,
            }))
            .sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

        setAvailablePeriods(periods);
        const now = new Date();
        const current = periods.find(p => {
            const start = new Date(p.startDate);
            const end = new Date(p.endDate);
            return now >= start && now <= end;
        });
        setSelectedPeriod(current || periods[0]);
    };


    useEffect(() => {
        if (!selectedPeriod || !processedBudgets) {
            setCurrentProfileBudget(null);
            setCurrentCategoryBudgets([]);
            return;
        }
        const id = availablePeriods.find(p => p.startDate === selectedPeriod.startDate)?.id;
        const entry = processedBudgets[id];
        if (!entry) {
            setCurrentProfileBudget(null);
            setCurrentCategoryBudgets([]);
            return;
        }

        setCurrentProfileBudget(entry.profileBudget);
        setCurrentCategoryBudgets(entry.categories);
    }, [selectedPeriod, processedBudgets]);

    return {
        groupedProfiles,
        loading,
        error,

        fetchGroupedProfiles,
        fetchBudgets,
        deleteBudget,

        availablePeriods,
        selectedPeriod,
        setSelectedPeriod,

        currentProfileBudget,
        currentCategoryBudgets,
    };
}
