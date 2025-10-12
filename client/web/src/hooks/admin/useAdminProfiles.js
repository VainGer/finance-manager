import { useState, useCallback, useEffect } from "react";
import { post } from "../../utils/api";

export default function useAdminProfiles() {
    const [groupedProfiles, setGroupedProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchGroupedProfiles = useCallback(async () => {
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    }, []);

    const updateProfile = useCallback(async (username, profileName, updates) => {
        setLoading(true);
        setError("");
        try {
            const res = await post("admin/profiles/update", { username, profileName, updates });
            if (!res.ok) throw new Error(res.message || "שגיאה בעדכון הפרופיל");
            await fetchGroupedProfiles(); 
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    }, [fetchGroupedProfiles]);

    const deleteProfile = useCallback(async (username, profileName) => {
        setLoading(true);
        setError("");
        try {
            const res = await post("admin/profiles/delete", { username, profileName });
            if (!res.ok) throw new Error(res.message || "שגיאה במחיקת הפרופיל");
            await fetchGroupedProfiles();
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    }, [fetchGroupedProfiles]);

    useEffect(() => {
        fetchGroupedProfiles();
    }, [fetchGroupedProfiles]);

    return {
        groupedProfiles,
        loading,
        error,
        fetchGroupedProfiles,
        updateProfile,
        deleteProfile,
    };
}
