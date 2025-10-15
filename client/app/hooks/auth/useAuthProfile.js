import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { get, post } from '../../utils/api.js';
import { getDeviceInfo, setAccessToken, setRefreshToken } from '../../utils/tokenUtils.js';

export default function useAuthProfile({ account, setProfile, setStoreProfile,
    setLoggedIn, setIsExpiredToken, setAccessTokenReady }) {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const fetchProfilesData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await get('profile/get-profiles?username=' + encodeURIComponent(account.username));

            if (response.ok) {
                setProfiles(response.profiles || []);
                return;
            }

            switch (response.status) {
                case 400:
                    setError('בקשה לא תקינה');
                    break;
                case 404:
                    setError('לא נמצאו פרופילים');
                    break;
                case 500:
                    setError('שגיאה בטעינת פרופילים');
                    break;
                case 503:
                    setError('השירות אינו זמין כרגע');
                    break;
                default:
                    setError('לא ניתן לטעון פרופילים');
            }
        } catch (error) {
            console.error('Profile fetch error:', error);
            setError('תקשורת עם השרת נכשלה');
        } finally {
            setLoading(false);
        }
    };

    const authProfile = async (profileName, pin, remember) => {
        try {
            setLoading(true);
            setError(null);
            if (!pin || pin.trim() === '') {
                setError('נא להזין קוד זיהוי');
                return;
            }

            pin = pin.trim();

            const response = await post('profile/validate-profile',
                { username: account.username, profileName, pin, device: getDeviceInfo(), remember }, false);
            if (response.ok) {
                setProfile(response.profile);
                if (remember) {
                    setStoreProfile(true);
                    await setRefreshToken(response.tokens.refreshToken);
                } else {
                    setStoreProfile(false);
                }
                await setAccessToken(response.tokens.accessToken);
                setAccessTokenReady(true);
                setIsExpiredToken(false);
                router.replace('/home/(tabs)/budgetSummary');
                setLoggedIn(true);
                return;
            } else {
                switch (response.status) {
                    case 400:
                        setError('נא להזין את כל הפרטים');
                        break;
                    case 401:
                        setError('קוד זיהוי שגוי');
                        break;
                    case 404:
                        setError('פרופיל לא נמצא');
                        break;
                    case 500:
                        setError('שגיאה בשרת, אנא נסה שוב מאוחר יותר');
                        break;
                    case 503:
                        setError('השירות אינו זמין כרגע');
                        break;
                    default:
                        console.error("Auth failed:", response.error || "Unknown error");
                        setError('כניסה נכשלה, אנא נסה שוב');
                }
            }
        } catch (error) {
            console.error('Auth error:', error);
            setError('תקשורת עם השרת נכשלה');
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchProfilesData();
    }, [account]);


    return { profiles, loading, error, authProfile };

};



