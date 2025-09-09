import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { post } from '../utils/api';
import { prepareImage } from '../utils/imageProcessing';

export default function useProfileSettings({ initialProfile }) {
    const { account, setProfile } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const resetMessages = () => {
        setError(null);
        setSuccess(null);
    };

    const renameProfile = async (newProfileName) => {
        setLoading(true);
        resetMessages();
        const response = await post('profile/rename-profile', {
            username: account.username,
            oldProfileName: initialProfile.profileName,
            newProfileName
        });
        setLoading(false);
        if (response.ok) {
            setProfile(prev => ({ ...prev, profileName: newProfileName }));
            setSuccess('שם הפרופיל עודכן בהצלחה!');
            return { ok: true, newProfileName };
        } else {
            setError(response.message || 'שגיאה בעדכון שם הפרופיל');
            return { ok: false };
        }
    };

    const changePin = async (oldPin, newPin, confirmNewPin, profileName) => {
        resetMessages();
        if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) { setError('הקוד החדש חייב להיות בדיוק 4 ספרות'); return; }
        if (oldPin.length !== 4 || !/^\d{4}$/.test(oldPin)) { setError('הקוד הנוכחי חייב להיות בדיוק 4 ספרות'); return; }
        if (newPin !== confirmNewPin) { setError('הקודים החדשים אינם תואמים'); return; }
        if (!oldPin || !newPin) { setError('יש למלא את כל השדות'); return; }

        setLoading(true);
        const response = await post('profile/change-pin', {
            username: account.username,
            profileName: profileName || initialProfile.profileName,
            oldPin,
            newPin
        });
        setLoading(false);
        if (response.ok) {
            setSuccess('הקוד שונה בהצלחה!');
        } else {
            setError(response.message || 'שגיאה בשינוי הקוד. יתכן שהקוד הנוכחי שגוי.');
        }
    };

    const changeProfileColor = async (newColor, profileName) => {
        setLoading(true);
        resetMessages();
        const response = await post('profile/set-color', {
            username: account.username,
            profileName: profileName || initialProfile.profileName,
            color: newColor
        });
        setLoading(false);
        if (response.ok) {
            setProfile(prev => ({ ...prev, color: newColor }));
            setSuccess('צבע הפרופיל עודכן בהצלחה!');
        } else {
            setError(response.message || 'שגיאה בעדכון הצבע');
        }
    };

    const changeAvatar = async (avatar, profileName) => {
        setLoading(true);
        resetMessages();
        let avatarBase64 = null;
        if (avatar) {
            try {
                avatarBase64 = await prepareImage(avatar.assets[0].uri);
            } catch (err) {
                setError('שגיאה בעיבוד התמונה');
                setLoading(false);
                return;
            }
        }

        const response = await post('profile/set-avatar', {
            username: account.username,
            profileName: profileName || initialProfile.profileName,
            avatar: avatarBase64
        });
        setLoading(false);
        if (response.ok) {
            setProfile(prev => ({ ...prev, avatar: response.avatarUrl }));
            setSuccess('תמונת הפרופיל עודכנה בהצלחה!');
        } else {
            setError(response.message || 'שגיאה בעדכון התמונה');
        }
    };

    const removeAvatar = async (profileName) => {
        setLoading(true);
        resetMessages();
        const response = await post('profile/set-avatar', {
            username: account.username,
            profileName: initialProfile.profileName,
            avatar: null
        });
        setLoading(false);
        if (response.ok) {
            setProfile(prev => ({ ...prev, avatar: null }));
            setSuccess('תמונת הפרופיל הוסרה!');
        } else {
            setError(response.message || 'שגיאה בהסרת התמונה');
        }
    };

    const updateProfile = async (profileName) => {
        try {
            const response = await post('profile/update-profile', {
                username: account.username,
                profileName: profileName || initialProfile.profileName
            });

            if (response.ok || response.success) {
                setProfile(response.profile);
                setSuccess('הפרופיל עודכן בהצלחה!');
            } else {
                setError(`שגיאה בעדכון הפרופיל: ${response?.message || 'לא ידוע'}`);
            }
        } catch (error) {
            console.error('Update profile error:', error);
            setError('שגיאה בעדכון הפרופיל');
        }
        setTimeout(() => resetMessages(), 3000);
    };

    return { loading, error, success, renameProfile, changePin, changeProfileColor, changeAvatar, removeAvatar, updateProfile, resetMessages };
}