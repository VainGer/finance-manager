import { useState } from "react";
import { post } from '../../utils/api'
export default function useAuthAdmin() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);



    const login = async (username, password) => {
        setError("");
        setLoading(true);
        try {
            const res = await post("admin/login", { username, password }, false);
            if (res.ok) {
                return true;
            } else {
                switch (res.status) {
                    case 400:
                        setError("נא מלא את כל השדות");
                        break;
                    case 401:
                        setError("שם המשתמש או הסיסמה שגויים");
                        break;
                    default:
                        setError("שגיאה בשרת, נסה שוב מאוחר יותר.");
                        break;
                }
            }
        } catch (err) {
            setError("שגיאה בשרת, נסה שוב מאוחר יותר.");
        } finally {
            setLoading(false);
        }
    };

    const register = async (username, password, secret) => {
        setError("");
        setLoading(true);
        try {
            const res = await post("admin/register", { username, password, secret }, false);

            if (res.ok) {
                return true;
            } else {
                switch (res.status) {
                    case 400:
                        setError("נא מלא את כל השדות");
                        break;
                    case 401:
                        setError("סיסמת מנהל שגויה");
                        break;
                    case 409:
                        setError("שם המשתמש כבר קיים");
                        break;
                    default:
                        setError(res.message || "שגיאה בהרשמה");
                        break;
                }
            }
        } catch (err) {
            setError("שגיאת שרת. נסה שוב מאוחר יותר.");
        } finally {
            setLoading(false);
        }
    };

    return { error, loading, login, register };

}