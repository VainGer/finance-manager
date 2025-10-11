import { useState } from 'react';
import { post } from '../utils/api';

export default function useSettingsState({ account, profile, setAccount, setProfile, navigate, logout }) {

  const [activeSection, setActiveSection] = useState('profile');
  const [editMode, setEditMode] = useState({ profile: false, password: false, pin: false });

  const [profileForm, setProfileForm] = useState({
    profileName: profile?.profileName || '',
    color: profile?.color || '#3B82F6'
  });

  const [avatarForm, setAvatarForm] = useState({ file: null, preview: null });

  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, pin: '' });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [pinForm, setPinForm] = useState({
    currentPin: '',
    newPin: '',
    confirmPin: ''
  });

  const [errors, setErrors] = useState([]);
  const [successes, setSuccesses] = useState([]);

  // ─────────────── HELPERS ───────────────
  const addError = (msg) => setErrors(prev => [...prev, msg]);
  const addSuccess = (msg) => setSuccesses(prev => [...prev, msg]);
  const resetMessages = () => { setErrors([]); setSuccesses([]); };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSwitchProfile = () => {
    setProfile(null);
    navigate('/profiles');
  };


  const handleProfileEdit = async () => {
    resetMessages();

    if (!editMode.profile) {
      setEditMode(prev => ({ ...prev, profile: true }));
      setProfileForm({
        profileName: profile?.profileName || '',
        color: profile?.color || '#3B82F6'
      });
      return;
    }

    const trimmedName = (profileForm.profileName || '').trim();
    const nameChanged = trimmedName !== (profile?.profileName || '');
    const colorChanged = profileForm.color !== profile?.color;

    if (!trimmedName) {
      addError('שם פרופיל לא יכול להיות ריק');
      return;
    }


    if (!nameChanged && !colorChanged) {
      setEditMode(prev => ({ ...prev, profile: false }));
      addError('אין שינויים לשמור');
      return;
    }

    try {
      if (!nameChanged && colorChanged) {
        const res = await post('profile/set-color', {
          username: account.username,
          profileName: profile.profileName,
          color: profileForm.color
        });

        if (res.ok || res.success || res.message?.includes('successfully')) {
          setProfile(prev => ({ ...prev, color: profileForm.color }));
          addSuccess('הצבע עודכן בהצלחה!');
          setEditMode(prev => ({ ...prev, profile: false }));
        } else {
          handleCommonResponseErrors(res, addError);
        }
        return;
      }

      const renameRes = await post('profile/rename-profile', {
        username: account.username,
        oldProfileName: profile.profileName,
        newProfileName: trimmedName
      });

      if (renameRes.ok || renameRes.success || renameRes.message?.includes('successfully')) {
        if (colorChanged) {
          const colorRes2 = await post('profile/set-color', {
            username: account.username,
            profileName: trimmedName,
            color: profileForm.color
          });
          if (!(colorRes2.ok || colorRes2.success || colorRes2.message?.includes('successfully'))) {
            handleCommonResponseErrors(colorRes2, addError);
            return;
          }
        }

        setProfile(prev => ({ ...prev, profileName: trimmedName, color: profileForm.color }));
        addSuccess('הפרופיל עודכן בהצלחה!');
        setEditMode(prev => ({ ...prev, profile: false }));
      } else {
        handleCommonResponseErrors(renameRes, addError);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      addError('שגיאה בעדכון הפרופיל');
    }
  };


  const handlePasswordChange = async () => {
    resetMessages();

    if (!editMode.password) {
      setEditMode(prev => ({ ...prev, password: true }));
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      addError('יש למלא את כל השדות');
      return;
    }
    if (newPassword.length < 6) {
      addError('סיסמה חדשה חייבת להיות לפחות 6 תווים');
      return;
    }
    if (newPassword !== confirmPassword) {
      addError('הסיסמאות אינן תואמות');
      return;
    }
    if (newPassword === currentPassword) {
      addError('הסיסמה החדשה חייבת להיות שונה מהנוכחית');
      return;
    }

    try {
      const response = await post('account/change-password', {
        username: account.username,
        currentPassword,
        newPassword
      });

      if (response.ok) {
        addSuccess('סיסמה שונתה בהצלחה!');
        setEditMode(prev => ({ ...prev, password: false }));
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        handleCommonResponseErrors(response, addError);
      }
    } catch (error) {
      console.error('Password change error:', error);
      addError('שגיאה בשינוי הסיסמה');
    }
  };

  const handlePinChange = async () => {
    resetMessages();

    if (!editMode.pin) {
      setEditMode(prev => ({ ...prev, pin: true }));
      setPinForm({ currentPin: '', newPin: '', confirmPin: '' });
      return;
    }

    const { currentPin, newPin, confirmPin } = pinForm;

    if (!/^\d{4}$/.test(currentPin) || !/^\d{4}$/.test(newPin) || !/^\d{4}$/.test(confirmPin)) {
      addError('הקוד חייב להיות בדיוק 4 ספרות');
      return;
    }
    if (newPin !== confirmPin) {
      addError('הקודים החדשים אינם תואמים');
      return;
    }

    try {
      const response = await post('profile/change-pin', {
        username: account.username,
        profileName: profile.profileName,
        oldPin: currentPin,
        newPin
      });

      if (response.ok) {
        addSuccess('הקוד שונה בהצלחה!');
        setEditMode(prev => ({ ...prev, pin: false }));
        setPinForm({ currentPin: '', newPin: '', confirmPin: '' });
      } else {
        handleCommonResponseErrors(response, addError);
      }
    } catch (error) {
      console.error('PIN change error:', error);
      addError('שגיאה בשינוי הקוד');
    }
  };

  // ─────────────── AVATAR ───────────────
  const handleAvatarSelect = (event) => {
    resetMessages();
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addError('גודל התמונה חייב להיות קטן מ-5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => setAvatarForm({ file, preview: e.target.result });
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    resetMessages();

    if (!avatarForm.file) {
      addError('אנא בחר תמונה להעלאה');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const response = await post('profile/set-avatar', {
            username: account.username,
            profileName: profile.profileName,
            avatar: reader.result
          });
          if (response.ok || response.success || response.message?.includes('successfully')) {
            setProfile(prev => ({ ...prev, avatar: reader.result }));
            addSuccess('התמונה הועלתה בהצלחה!');
            setAvatarForm({ file: null, preview: null });
          } else {
            handleCommonResponseErrors(response, addError);
          }
        } catch (error) {
          console.error('Avatar upload error:', error);
          addError('שגיאה בהעלאת התמונה');
        }
      };
      reader.readAsDataURL(avatarForm.file);
    } catch (error) {
      console.error('Avatar upload error:', error);
      addError('שגיאה בהעלאת התמונה');
    }
  };

  const handleRemoveAvatar = async () => {
    resetMessages();
    try {
      const response = await post('profile/set-avatar', {
        username: account.username,
        profileName: profile.profileName,
        avatar: null
      });

      if (response.ok || response.success || response.message?.includes('successfully')) {
        setProfile(prev => ({ ...prev, avatar: null }));
        addSuccess('התמונה הוסרה בהצלחה!');
      } else {
        handleCommonResponseErrors(response, addError);
      }
    } catch (error) {
      console.error('Remove avatar error:', error);
      addError('שגיאה בהסרת התמונה');
    }
  };

  // ─────────────── DELETE PROFILE ───────────────
  const handleDeleteProfile = () => {
    resetMessages();
    setDeleteConfirmation({ isOpen: true, pin: '' });
  };

  const confirmDeleteProfile = async () => {
    resetMessages();

    const { pin } = deleteConfirmation;

    if (!pin || !/^\d{4}$/.test(pin)) {
      addError('הקוד חייב להיות 4 ספרות בדיוק');
      return;
    }

    try {
      const response = await post('profile/delete-profile', {
        username: account.username,
        profileName: profile.profileName,
        pin
      });

      if (response.ok || response.success || response.message?.includes('successfully')) {
        addSuccess('הפרופיל נמחק בהצלחה!');
        setProfile(null);
        sessionStorage.removeItem('profile');
        navigate('/profiles');
      } else {
        handleCommonResponseErrors(response, addError);
      }
    } catch (error) {
      console.error('Delete profile error:', error);
      addError('שגיאה במחיקת הפרופיל');
    }
    setDeleteConfirmation({ isOpen: false, pin: '' });
  };

  const cancelDeleteProfile = () => setDeleteConfirmation({ isOpen: false, pin: '' });

  // ─────────────── COMMON ERROR HANDLER ───────────────
  function handleCommonResponseErrors(res, push) {
    switch (res.status) {
      case 400:
        push('יש למלא את כל השדות');
        break;
      case 401:
        if (!res.message.includes('PIN')) {
          push('ההרשאה פגה, אנא התחבר מחדש');
          logout();
        } else {
          push('הקוד הסודי לא נכון');
        }
        break;
      case 403:
        push('ההרשאה פגה, אנא התחבר מחדש');
        break;
      case 404:
        push('הפרופיל לא נמצא');
        break;
      case 409:
        push('שם פרופיל כבר קיים');
        break;
      case 500:
        push('שגיאת שרת');
        break;
      default:
        push(res.message || 'שגיאה לא ידועה');
    }
  }

  const sections = [
    { id: 'profile', name: 'פרופיל', icon: '👤' },
    { id: 'account', name: 'חשבון', icon: '⚙️' },
    ...(profile?.parentProfile ? [{ id: 'newProfile', name: 'פרופיל חדש', icon: '➕' }] : []),
    ...(profile.children?.length > 0
      ? [{ id: 'addChildrenBudget', name: 'הוספת תקציב לילדים', icon: '👶' }]
      : []),
  ];

  return {
    state: {
      activeSection,
      editMode,
      profileForm,
      avatarForm,
      deleteConfirmation,
      passwordForm,
      pinForm,
      errors,
      successes,
      sections,
    },
    actions: {
      resetMessages,
      setActiveSection,
      setEditMode,
      setProfileForm,
      setAvatarForm,
      setDeleteConfirmation,
      setPasswordForm,
      setPinForm,
      handleLogout,
      handleSwitchProfile,
      handleProfileEdit,
      handlePasswordChange,
      handlePinChange,
      handleAvatarSelect,
      handleAvatarUpload,
      handleRemoveAvatar,
      handleDeleteProfile,
      confirmDeleteProfile,
      cancelDeleteProfile,
    },
  };
}
