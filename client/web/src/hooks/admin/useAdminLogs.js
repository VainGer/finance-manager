// useAdminLogs.js
import { useState, useEffect, useCallback } from "react";
import { post } from "../../utils/api";

export default function useAdminLogs() {
    const [groupedProfiles, setGroupedProfiles] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchGroupedProfiles = useCallback(async () => {
        setError("");
        try {
            const res = await post("admin/profiles");
            if (res.ok) {
                setGroupedProfiles(res.groupedProfiles || []);
            } else {
                setError(res.message || "שגיאה בטעינת רשימת הפרופילים");
            }
        } catch (err) {
            setError("שגיאת שרת בטעינת הפרופילים");
        }
    }, []);

    const fetchRecentLogs = useCallback(async (limit = 50) => {
        setLoading(true);
        setError("");
        try {
            const res = await post("admin/actions/recent", { limit });
            if (res.ok) {
                setLogs(res.actions || []);
                return res.actions || [];
            } else {
                setError(res.message || "שגיאה בטעינת הלוגים האחרונים");
                return [];
            }
        } catch (err) {
            setError("שגיאת שרת בעת טעינת הלוגים");
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchLogsByDate = useCallback(async (start, end) => {
        setLoading(true);
        setError("");
        try {
            const res = await post("admin/actions/by-date", { start, end });
            if (res.ok) {
                setLogs(res.actions || []);
                return res.actions || [];
            } else {
                setError(res.message || "שגיאה בטעינת הלוגים לפי תאריכים");
                return [];
            }
        } catch (err) {
            setError("שגיאת שרת בעת טעינת הלוגים לפי תאריכים");
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGroupedProfiles();
    }, [fetchGroupedProfiles]);

    return {
        groupedProfiles,
        logs,
        loading,
        error,
        fetchRecentLogs,
        fetchLogsByDate,
    };
}
