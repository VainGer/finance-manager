import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, post } from '../../utils/api';
import { getDeviceInfo, setAccessToken, setRefreshToken } from '../../utils/tokenUtils';

export default function useAuthProfile({ account, setProfile, setLoggedIn }) {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchProfilesData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await get('profile/get-profiles?username=' + account.username, false); // לא secure

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

    const authProfile = async (profileName, pin, remember = true) => {
        try {
            setLoading(true);
            setError(null);
            
            if (!pin || pin.trim() === '') {
                setError('נא להזין קוד זיהוי');
                setLoading(false);
                return;
            }

            pin = pin.trim();

            const response = await post('profile/validate-profile', {
                username: account.username, 
                profileName, 
                pin, 
                device: getDeviceInfo(), 
                remember
            }, false); // לא secure
            
            if (response.ok) {
                setProfile(response.profile);
                // שמירת טוקנים
                console.log('Profile response tokens:', response.tokens);
                if (response.tokens && response.tokens.accessToken) {
                    await setAccessToken(response.tokens.accessToken);
                    console.log('Access token saved:', response.tokens.accessToken);
                }
                if (response.tokens && response.tokens.refreshToken && remember) {
                    await setRefreshToken(response.tokens.refreshToken);
                    console.log('Refresh token saved:', response.tokens.refreshToken);
                }
                setLoggedIn(true);
                navigate('/dashboard');
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
    };

    useEffect(() => {
        if (account) {
            fetchProfilesData();
        }
    }, [account]);

    return { profiles, loading, error, authProfile, fetchProfilesData };
}
