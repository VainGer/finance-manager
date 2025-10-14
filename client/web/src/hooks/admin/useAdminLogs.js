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
        } catch {
            setError("שגיאת שרת בטעינת הפרופילים");
        }
    }, []);

    const fetchLogsWithFilters = useCallback(async (filters = {}) => {
        setLoading(true);
        setError("");
        try {
            const res = await post("admin/actions/filter", filters);
            if (res.ok) {
                const processed = (res.actions || []).map(log => ({
                    ...log,
                    target: safeParseJSON(log.target),
                }));
                setLogs(processed);
                return processed;
            } else {
                setError(res.message || "שגיאה בטעינת הלוגים");
                return [];
            }
        } catch {
            setError("שגיאת שרת בעת טעינת הלוגים");
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    function safeParseJSON(value) {
        if (typeof value !== "string") return value;
        try {
            const parsed = JSON.parse(value);
            if (typeof parsed === "string" && (parsed.startsWith("{") || parsed.startsWith("["))) {
                return safeParseJSON(parsed);
            }
            return parsed;
        } catch {
            return value;
        }
    }



    useEffect(() => {
        fetchGroupedProfiles();
    }, [fetchGroupedProfiles]);

    return {
        groupedProfiles,
        logs,
        loading,
        error,
        fetchLogsWithFilters,
    };
}
