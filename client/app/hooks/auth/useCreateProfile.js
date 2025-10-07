import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { post } from '../../utils/api';
import { prepareImage } from '../../utils/imageProcessing';


export default function useCreateProfile({ username, profileName, pin, avatar, color, firstProfile, parentProfile }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { setProfile, profile, setIsExpiredToken, setAccessTokenReady } = useAuth();
    const createProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!profileName || !pin || profileName.trim() === '' || pin.trim() === '') {
                setError('נא למלא שם פרופיל וקוד זיהוי');
                return;
            }

            if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
                setError('קוד זיהוי חייב להכיל 4 ספרות בלבד');
                return;
            }

            let avatarBase64 = null;
            if (avatar) {
                try {
                    const uri = avatar.assets ? avatar.assets[0].uri : avatar.uri;
                    if (!uri) {
                        throw new Error('Invalid avatar format');
                    }
                    avatarBase64 = await prepareImage(uri);
                } catch (error) {
                    console.error('Base64 conversion error:', error);
                    setError('שגיאה בטעינת התמונה');
                    return;
                }
            }

            const parent = firstProfile ? true : parentProfile;
            const newProfile = {
                username,
                profileName,
                pin,
                avatar: avatar ? avatarBase64 : null,
                color,
                parentProfile: parent
            }

            const uri = parent && firstProfile ? "create-first-profile" : parent ? "create-profile" : "create-child-profile";
            const response = await post(`profile/${uri}`, newProfile, !firstProfile);

            if (response.ok) {
                if (profile && profile.parentProfile && !parent) {
                    setProfile(prev => ({
                        ...prev,
                        children: Array.isArray(prev?.children)
                            ? [...prev.children, { name: profileName, id: response.profileId }]
                            : [{ name: profileName, id: response.profileId }]
                    }));
                }

                if (firstProfile) {
                    router.replace('/authProfile');
                }
                return;
            }

            switch (response.status) {
                case 400:
                    setError('נא למלא את כל השדות בצורה תקינה');
                    break;
                case 401:
                    setIsExpiredToken(false);
                    setAccessTokenReady(true);
                    setError('ההרשאה פגה, אנא התחבר מחדש');
                    break;
                case 409:
                    setError('פרופיל בשם זה כבר קיים');
                    break;
                case 500:
                    setError('שגיאה בשרת, נסה שוב מאוחר יותר');
                    break;
                case 503:
                    setError('השירות אינו זמין כרגע, אנא נסה שוב מאוחר יותר');
                    break;
                default:
                    setError('יצירת הפרופיל נכשלה');
            }
        } catch (error) {
            console.error('Profile creation error:', error);
            setError('תקשורת עם השרת נכשלה');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, createProfile, setError };
}
