import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, post } from '../../utils/api';
import { getDeviceInfo, getExpiration } from '../../utils/tokenUtils';

export default function useAuthProfile({ account, setProfile, scheduleTokenRefresh, setRememberProfile, setIsTokenReady, setIsExpiredToken }) {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchProfilesData = async () => {
        if (!account?.username) {
            setProfiles([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await get(`profile/get-profiles?username=${encodeURIComponent(account.username)}`);
            if (response.ok) {
                setProfiles(response.profiles || []);
            } else {
                switch (response.status) {
                    case 400: setError('בקשה לא תקינה'); break;
                    case 404: setError('לא נמצאו פרופילים'); break;
                    case 500: setError('שגיאה בטעינת פרופילים'); break;
                    case 503: setError('השירות אינו זמין כרגע'); break;
                    default: setError('לא ניתן לטעון פרופילים');
                }
            }
        } catch (err) {
            console.error('Profile fetch error:', err);
            setError('תקשורת עם השרת נכשלה');
        } finally {
            setLoading(false);
        }
    };

    const authProfile = async (profileName, pin, remember = true) => {
        if (!account?.username || !profileName) {
            setError('נתונים חסרים');
            return;
        }

        if (!pin || pin.trim() === '') {
            setError('נא להזין קוד זיהוי');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await post('profile/validate-profile', {
                username: account.username,
                profileName,
                pin: pin.trim(),
                device: getDeviceInfo(),
                remember
            });

            if (response.ok) {
                setProfile(response.profile);
                setRememberProfile(remember);

                if (response.tokens?.accessToken) {
                    const expDate = getExpiration(response.tokens.accessToken);
                    if (expDate) scheduleTokenRefresh(expDate);
                }

                setIsTokenReady(true);
                setIsExpiredToken(false);
                navigate('/dashboard');
                return;
            } else {
                switch (response.status) {
                    case 400: setError('נא להזין את כל הפרטים'); break;
                    case 401: setError('קוד זיהוי שגוי'); break;
                    case 404: setError('פרופיל לא נמצא'); break;
                    case 500: setError('שגיאה בשרת, אנא נסה שוב מאוחר יותר'); break;
                    case 503: setError('השירות אינו זמין כרגע'); break;
                    default:
                        console.error("Auth failed:", response.error || "Unknown error");
                        setError('כניסה נכשלה, אנא נסה שוב');
                }
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError('תקשורת עם השרת נכשלה');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (account) fetchProfilesData();
    }, [account]);

    return { profiles, loading, error, authProfile, fetchProfilesData };
}
