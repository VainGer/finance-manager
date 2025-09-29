import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { post } from '../utils/api';
import { prepareImage } from '../utils/imageProcessing';
import { useRouter } from 'expo-router';

export default function useProfileSettings({ setLoading }) {
    const { account, profile, setAccount, setProfile, logout, clearProfile } = useAuth();
    const router = useRouter();
    const resetMessages = () => {
        setErrors([]);
        setSuccesses([]);
    };

    const [errors, setErrors] = useState([]);
    const [successes, setSuccesses] = useState([]);

    const resetFormStates = (setNewColor, setNewProfileName, setNewAvatar, setShouldRemoveAvatar,
        setNewPin, setConfirmNewPin, setOldPin) => {
        setErrors([]);
        setSuccesses([]);
        setNewColor(profile.color);
        setNewProfileName(profile.profileName);
        setNewAvatar(null);
        setShouldRemoveAvatar(false);
        setNewPin("");
        setConfirmNewPin("");
        setOldPin("");
    };

    const addError = (msg) => {
        setErrors((prev) => [...prev, msg]);
    }
    const addSuccess = (msg) => setSuccesses((prev) => [...prev, msg]);

    const renameProfile = async (newProfileName) => {
        try {
            if (newProfileName.trim().length < 2) {
                addError("שם הפרופיל חייב להכיל לפחות 2 תווים");
                return false;
            }

            setLoading(true);
            resetMessages();

            const response = await post("profile/rename-profile", {
                username: account.username,
                oldProfileName: profile.profileName,
                newProfileName,
            });

            if (response.ok) {
                setProfile((prev) => ({ ...prev, profileName: newProfileName }));
                addSuccess("שם פרופיל עודכן בהצלחה");
                return true;
            }

            switch (response.status) {
                case 400:
                    addError("שם הפרופיל חייב להכיל לפחות 2 תווים");
                    break;
                case 404:
                    addError("הפרופיל לא נמצא");
                    break;
                case 409:
                    addError("שם פרופיל כבר קיים במשתמש");
                    break;
                case 500:
                    addError("שגיאת שרת בשינוי שם פרופיל");
                    break;
                default:
                    addError("שינוי שם הפרופיל נכשל");
            }
            return false;
        } catch (err) {
            console.error('Profile rename error:', err);
            addError("תקשורת עם השרת נכשלה");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const changePin = async (oldPin, newPin, confirmNewPin) => {
        if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
            addError("הקוד החדש חייב להיות בדיוק 4 ספרות");
            return false;
        }
        if (oldPin.length !== 4 || !/^\d{4}$/.test(oldPin)) {
            addError("הקוד הנוכחי חייב להיות בדיוק 4 ספרות");
            return false;
        }
        if (newPin !== confirmNewPin) {
            addError("הקודים החדשים אינם תואמים");
            return false;
        }

        setLoading(true);
        const response = await post("profile/change-pin", {
            username: account.username,
            profileName: profile.profileName,
            oldPin,
            newPin,
        });
        setLoading(false);

        if (response.ok) {
            addSuccess("הקוד הסודי עודכן בהצלחה");
            return true;
        } else {
            switch (response.status) {
                case 404:
                    addError("פרופיל לא קיים");
                    break;
                case 400:
                    if (response.message.includes("4 digits")) {
                        addError("הקוד החדש חייב להיות בדיוק 4 ספרות");
                    } else {
                        addError("יש למלא את כל השדות");
                    }
                    break;
                case 401:
                    addError("הקוד הישן לא נכון");
                    break;
                case 409:
                    addError("הקוד החדש חייב להיות שונה מהקוד הישן");
                    break;
                default:
                    addError("שגיאה בעת שינוי הקוד, נסה שוב מאוחר יותר");
            }
            return false;
        }
    };

    const changeProfileColor = async (newColor) => {
        setLoading(true);
        const response = await post("profile/set-color", {
            username: account.username,
            profileName: profile.profileName,
            color: newColor,
        });
        setLoading(false);

        if (response.ok) {
            setProfile((prev) => ({ ...prev, color: newColor }));
            addSuccess("צבע פרופיל עודכן בהצלחה");
            return true;
        } else {
            switch (response.status) {
                case 400:
                    addError("יש למלא את כל השדות");
                    break;
                case 404:
                    addError("פרופיל לא קיים");
                    break;
                default:
                    addError("שגיאה בעת שינוי צבע פרופיל, נסה שוב מאוחר יותר");
            }
            return false;
        }
    };

    const changeAvatar = async (avatar) => {
        setLoading(true);
        let avatarBase64 = null;
        if (avatar) {
            try {
                avatarBase64 = await prepareImage(avatar.uri);
            } catch (err) {
                addError("שגיאה בעת שינוי תמונה, נסה שוב מאוחר יותר");
                setLoading(false);
                return false;
            }
        }

        const response = await post("profile/set-avatar", {
            username: account.username,
            profileName: profile.profileName,
            avatar: avatarBase64,
        });
        setLoading(false);

        if (response.ok) {
            setProfile((prev) => ({ ...prev, avatar: avatarBase64 }));
            addSuccess("התמונה עודכנה בהצלחה");
            return true;
        } else {
            switch (response.status) {
                case 400:
                    addError("יש למלא את כל השדות");
                    break;
                case 404:
                    addError("פרופיל לא קיים");
                    break;
                default:
                    addError("שגיאה בעת שינוי תמונה, נסה שוב מאוחר יותר");
            }
            return false;
        }
    };

    const removeAvatar = async () => {
        setLoading(true);
        const response = await post("profile/set-avatar", {
            username: account.username,
            profileName: profile.profileName,
            avatar: null,
        });
        setLoading(false);

        if (response.ok) {
            setProfile((prev) => ({ ...prev, avatar: null }));
            addSuccess("התמונה הוסרה בהצלחה");
            return true;
        } else {
            switch (response.status) {
                case 400:
                    addError("יש למלא את כל השדות");
                    break;
                case 404:
                    addError("פרופיל לא קיים");
                    break;
                default:
                    addError("שגיאה בעת הסרת תמונה, נסה שוב מאוחר יותר");
            }
            return false;
        }
    };

    const deleteProfile = async (profilePin) => {
        setLoading(true);
        const response = await post('profile/delete-profile', {
            username: account.username,
            profileName: profile.profileName,
            pin: profilePin
        });
        setLoading(false);
        if (response.ok) {
            addSuccess("הפרופיל נמחק בהצלחה");
            return true;
        } else {
            switch (response.status) {
                case 400:
                    addError("יש למלא את כל השדות");
                    break;
                case 404:
                    addError("פרופיל לא קיים");
                    break;
                case 401:
                    addError("הקוד הסודי לא נכון");
                    break;
                default:
                    addError("שגיאה בעת מחיקת פרופיל, נסה שוב מאוחר יותר");
                    break;
            }
            return false;
        }
    }

    const changeAccountPassword = async (passwordForm) => {
        const { currentPassword, newPassword, confirmPassword } = passwordForm;
        if (!currentPassword || !newPassword || !confirmPassword) {
            addError('יש למלא את כל השדות');
            return false;
        }
        if (newPassword.length < 6) {
            addError('סיסמה חדשה חייבת להיות לפחות 6 תווים');
            return false;
        }
        if (newPassword !== confirmPassword) {
            addError('הסיסמאות אינן תואמות');
            return false;
        }
        if (newPassword === currentPassword) {
            addError('הסיסמה החדשה חייבת להיות שונה מהנוכחית');
            return false;
        }

        setLoading(true);
        const response = await post('account/change-password', {
            username: account.username,
            currentPassword,
            newPassword
        });
        setLoading(false);

        if (response.ok) {
            addSuccess('סיסמה שונתה בהצלחה!');
            return true;
        } else {
            switch (response.status) {
                case 400:
                    if (response.message.includes("required")) {
                        addError('יש למלא את כל השדות');
                    } else if (response.message.includes("6")) {
                        addError('סיסמה חדשה חייבת להיות לפחות 6 תווים');
                    } else {
                        addError("הסיסמה החדשה חייבת להיות שונה מהנוכחית");
                    }
                    break;
                case 401:
                    addError("הסיסמה הנוכחית לא נכונה");
                    break;
                default:
                    addError("שגיאה בעת שינוי סיסמה, נסה שוב מאוחר יותר");
                    console.error("Error changing password", response);
                    break;
            }
            return false;
        }
    };

    const handleLogout = async () => {
        await logout();
        router.replace('/');
    }

    const handleClearProfile = async () => {
        await clearProfile();
        router.replace('/authProfile');
    }

    return {
        handleLogout,
        handleClearProfile,
        resetFormStates,
        resetMessages,
        renameProfile,
        changePin,
        changeProfileColor,
        changeAvatar,
        removeAvatar,
        deleteProfile,
        changeAccountPassword,
        errors,
        successes,
    };
}