import { useState, useEffect, useMemo, useCallback } from "react";
import { post } from "../../utils/api";

export default function useAdminExpenses() {
    const [groupedProfiles, setGroupedProfiles] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState("");
    const [selectedProfile, setSelectedProfile] = useState(null);

    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [dateFilteredExpenses, setDateFilteredExpenses] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [filters, setFilters] = useState({
        category: "all",
        business: "all",
        sortBy: "date",
        sortOrder: "desc",
    });
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

    const fetchGroupedProfiles = useCallback(async () => {
        try {
            const res = await post("admin/profiles");
            if (res.ok) {
                setGroupedProfiles(res.groupedProfiles || []);
            } else {
                setError(res.message || "שגיאה בטעינת רשימת הפרופילים");
            }
        } catch (err) {
            setError("שגיאת שרת בטעינת רשימת הפרופילים");
        }
    }, []);

    useEffect(() => {
        fetchGroupedProfiles();
    }, [fetchGroupedProfiles]);

    const fetchExpenses = useCallback(async (refId) => {
        if (!refId) return;
        setLoading(true);
        setError("");

        try {
            const res = await post("admin/expenses", { refId });
            if (res.ok) {
                const normalized = [];
                res.expenses?.forEach((category) => {
                    category.Businesses?.forEach((business) => {
                        business.transactionsArray?.forEach((group) => {
                            group.transactions?.forEach((t) => {
                                normalized.push({
                                    _id: t._id,
                                    amount: Number(t.amount),
                                    date: t.date,
                                    description: t.description,
                                    category: category.name,
                                    business: business.name,
                                });
                            });
                        });
                    });
                });
                setExpenses(normalized);
            } else {
                setError(res.message || "שגיאה בטעינת ההוצאות");
            }
        } catch (err) {
            setError("שגיאת שרת בעת טעינת ההוצאות");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedProfile?.expenses) {
            fetchExpenses(selectedProfile.expenses);
        } else {
            setExpenses([]);
        }
    }, [selectedProfile, fetchExpenses]);

    useEffect(() => {
        let filtered = [...expenses];

        if (filters.category !== "all") {
            filtered = filtered.filter((e) => e.category === filters.category);
        }

        if (filters.business !== "all") {
            filtered = filtered.filter((e) => e.business === filters.business);
        }

        filtered.sort((a, b) => {
            let aVal, bVal;
            switch (filters.sortBy) {
                case "amount":
                    aVal = a.amount;
                    bVal = b.amount;
                    break;
                case "date":
                    aVal = new Date(a.date);
                    bVal = new Date(b.date);
                    break;
                case "description":
                    aVal = a.description?.toLowerCase() || "";
                    bVal = b.description?.toLowerCase() || "";
                    break;
                default:
                    aVal = new Date(a.date);
                    bVal = new Date(b.date);
            }

            return filters.sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        });

        setFilteredExpenses(filtered);
    }, [expenses, filters]);

    useEffect(() => {
        if (!dateRange.startDate || !dateRange.endDate) {
            setDateFilteredExpenses(filteredExpenses);
            return;
        }

        const start = new Date(dateRange.startDate);
        const end = new Date(dateRange.endDate);
        end.setHours(23, 59, 59, 999);

        const filtered = filteredExpenses.filter((e) => {
            const d = new Date(e.date);
            return d >= start && d <= end;
        });

        setDateFilteredExpenses(filtered);
    }, [filteredExpenses, dateRange]);

    useEffect(() => {
        if (expenses.length > 0) {
            let earliest = new Date();
            let latest = new Date(0);
            expenses.forEach((e) => {
                const d = new Date(e.date);
                if (d < earliest) earliest = d;
                if (d > latest) latest = d;
            });
            setDateRange({
                startDate: earliest.toISOString().split("T")[0],
                endDate: latest.toISOString().split("T")[0],
            });
        }
    }, [expenses]);

    const categories = useMemo(() => ["all", ...new Set(expenses.map((e) => e.category))], [expenses]);
    const businesses = useMemo(() => ["all", ...new Set(expenses.map((e) => e.business))], [expenses]);

    const summary = useMemo(() => {
        const totalAmount = dateFilteredExpenses.reduce((sum, e) => sum + e.amount, 0);
        const transactionCount = dateFilteredExpenses.length;
        return { totalAmount, transactionCount };
    }, [dateFilteredExpenses]);

    return {
        groupedProfiles,
        selectedAccount,
        setSelectedAccount,
        selectedProfile,
        setSelectedProfile,

        expenses: dateFilteredExpenses,
        loading,
        error,

        filters,
        setFilters,
        categories,
        businesses,
        dateRange,
        setDateRange,
        summary,
    };
}
