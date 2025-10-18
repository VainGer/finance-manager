import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProfileData } from '../../context/ProfileDataContext';
import useChildrenData from './useChildrenData';

export default function useBudgetSummary() {
    const { profile } = useAuth();
    const {
        profileBudgets,
        categoryBudgets,
        budgetLoading: parentLoading,
        errors,
        fetchBudgets
    } = useProfileData();

    const {
        children,
        loading: childrenLoading,
        error: childrenError,
        childrenProfileBudgets,
        childrenCategoryBudgets,
        selectedChild,
        setSelectedChild
    } = useChildrenData();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeProfileBudgets, setActiveProfileBudgets] = useState([]);
    const [activeCategoryBudgets, setActiveCategoryBudgets] = useState([]);

    const [availablePeriods, setAvailablePeriods] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [processedBudgets, setProcessedBudgets] = useState({});
    const [currentProfileBudget, setCurrentProfileBudget] = useState(null);
    const [currentCategoryBudgets, setCurrentCategoryBudgets] = useState([]);
    const [relevantPeriod, setRelevantPeriod] = useState(false);


    useEffect(() => {
        if (errors?.length > 0) {
            const budgetErrors = errors.find(e => e.budgetErrors)?.budgetErrors;
            if (budgetErrors?.length > 0) setError(budgetErrors[0]);
        }
        if (childrenError) setError(childrenError);
    }, [errors, childrenError]);


    useEffect(() => {
        if (!selectedChild) {
            if (!profile || parentLoading) {
                setLoading(true);
                return;
            }

            if (profileBudgets?.length && categoryBudgets?.length) {
                setActiveProfileBudgets(profileBudgets);
                setActiveCategoryBudgets(categoryBudgets);
                processBudgets(profileBudgets, categoryBudgets);
            }
            setLoading(false);
        }
    }, [profile, parentLoading, profileBudgets, categoryBudgets, selectedChild]);


    useEffect(() => {
        if (!selectedChild) return;

        if (!childrenLoading) {
            setActiveProfileBudgets(childrenProfileBudgets);
            setActiveCategoryBudgets(childrenCategoryBudgets);
            processBudgets(childrenProfileBudgets, childrenCategoryBudgets);
            setLoading(false);
        } else if (childrenLoading) {
            setLoading(true);
        }
    }, [selectedChild, childrenLoading, childrenProfileBudgets, childrenCategoryBudgets]);


    const processBudgets = (profileArr, categoryArr) => {
        const map = {};
        profileArr.forEach(b => {
            const id = b._id?.$oid || b._id || b.id;
            map[id] = {
                profileBudget: b,
                categories: []
            };
        });

        categoryArr.forEach(category => {
            category.budgets.forEach(catBudget => {
                const id = catBudget._id?.$oid || catBudget._id || catBudget.id;
                if (map[id]) {
                    map[id].categories.push({
                        name: category.name,
                        budget: catBudget.amount,
                        spent: catBudget.spent || 0
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
                id: b._id?.$oid || b._id || b.id,
                startDate: b.startDate,
                endDate: b.endDate
            }));

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

        const entry = processedBudgets[selectedPeriod.id];
        if (!entry) {
            setCurrentProfileBudget(null);
            setCurrentCategoryBudgets([]);
            return;
        }

        setCurrentProfileBudget(entry.profileBudget);
        setCurrentCategoryBudgets(entry.categories);

        const now = new Date();
        const start = new Date(selectedPeriod.startDate);
        const end = new Date(selectedPeriod.endDate);
        setRelevantPeriod(start <= now && now <= end);
    }, [selectedPeriod, processedBudgets]);

    useEffect(() => {
    }, [currentProfileBudget, currentCategoryBudgets])

    return {
        loading: loading || parentLoading || childrenLoading,
        error,
        availablePeriods,
        selectedPeriod,
        setSelectedPeriod,
        relevantPeriod,
        currentProfileBudget,
        currentCategoryBudgets,
        refetchBudgets: fetchBudgets,
        childrenProps: {
            children,
            selectedChild,
            setSelectedChild,
            loading: childrenLoading,
            error: childrenError
        }
    };
}
