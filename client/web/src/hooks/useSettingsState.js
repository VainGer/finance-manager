import { useState } from 'react';
import { post } from '../utils/api';

export default function useSettingsState({ account, profile, setAccount, setProfile, navigate, logout }) {
  const [activeSection, setActiveSection] = useState('profile');
  const [editMode, setEditMode] = useState({ profile: false, password: false, pin: false });
  const [profileForm, setProfileForm] = useState({ profileName: profile?.profileName || '', color: profile?.color || '#3B82F6' });
  const [avatarForm, setAvatarForm] = useState({ file: null, preview: null });
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, pin: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pinForm, setPinForm] = useState({ currentPin: '', newPin: '', confirmPin: '' });
  const [message, setMessage] = useState('');

  const handleLogout = async () => { 
    await logout(); // This will call the server and clear cookies
    navigate('/'); 
  };
  const handleSwitchProfile = () => { setProfile(null); navigate('/profiles'); };

  const handleProfileEdit = async () => {
    if (!editMode.profile) {
      setEditMode(prev => ({ ...prev, profile: true }));
      setProfileForm({ profileName: profile?.profileName || '', color: profile?.color || '#3B82F6' });
      return;
    }

    const trimmedName = (profileForm.profileName || '').trim();
    const nameChanged = trimmedName !== (profile?.profileName || '');
    const colorChanged = profileForm.color !== profile?.color;

    if (!trimmedName) {
      setMessage('שם פרופיל לא יכול להיות ריק');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // No changes: exit edit mode without calling API
    if (!nameChanged && !colorChanged) {
      setEditMode(prev => ({ ...prev, profile: false }));
      setMessage('אין שינויים לשמור');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    try {
      // If only color changed, skip rename
      if (!nameChanged && colorChanged) {
        const colorRes = await post('profile/set-color', {
          username: account.username,
          profileName: profile.profileName,
          color: profileForm.color
        });
        if (colorRes.success || colorRes.message?.includes('successfully')) {
          setProfile(prev => ({ ...prev, color: profileForm.color }));
          setMessage('הצבע עודכן בהצלחה!');
          setEditMode(prev => ({ ...prev, profile: false }));
        } else {
          setMessage(`שגיאה בעדכון הצבע: ${colorRes?.message || 'לא ידוע'}`);
        }
        setTimeout(() => setMessage(''), 3000);
        return;
      }

      // Name changed (maybe color too)
      const renameRes = await post('profile/rename-profile', {
        username: account.username,
        oldProfileName: profile.profileName,
        newProfileName: trimmedName
      });

      if (renameRes.success || renameRes.message?.includes('successfully')) {
        // If color also changed, update color against the new name
        if (colorChanged) {
          const colorRes2 = await post('profile/set-color', {
            username: account.username,
            profileName: trimmedName,
            color: profileForm.color
          });
          if (!(colorRes2.success || colorRes2.message?.includes('successfully'))) {
            setMessage(`שגיאה בעדכון הצבע: ${colorRes2?.message || 'לא ידוע'}`);
            setTimeout(() => setMessage(''), 3000);
            return;
          }
        }

        const updatedProfile = { ...profile, profileName: trimmedName, color: profileForm.color };
        setProfile(updatedProfile);
        setMessage('הפרופיל עודכן בהצלחה!');
        setEditMode(prev => ({ ...prev, profile: false }));
      } else {
        setMessage(`שגיאה בעדכון הפרופיל: ${renameRes?.message || 'לא ידוע'}`);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      const updatedProfile = { ...profile, profileName: trimmedName, color: profileForm.color };
      setProfile(updatedProfile);
      setMessage('הפרופיל עודכן בהצלחה!');
      setEditMode(prev => ({ ...prev, profile: false }));
    }

    setTimeout(() => setMessage(''), 3000);
  };

  const handlePasswordChange = async () => {
    if (!editMode.password) {
      setEditMode(prev => ({ ...prev, password: true }));
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage('יש למלא את כל השדות');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    if (newPassword.length < 6) {
      setMessage('סיסמה חדשה חייבת להיות לפחות 6 תווים');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('הסיסמאות אינן תואמות');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    if (newPassword === currentPassword) {
      setMessage('הסיסמה החדשה חייבת להיות שונה מהנוכחית');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      const response = await post('account/change-password', {
        username: account.username,
        currentPassword,
        newPassword
      });
      if (response?.status === 200) {
        setMessage('סיסמה שונתה בהצלחה!');
        setEditMode(prev => ({ ...prev, password: false }));
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage(response?.message || 'שגיאה בשינוי הסיסמה');
      }
    } catch (error) {
      setMessage(error?.message || 'שגיאה בשינוי הסיסמה');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handlePinChange = async () => {
    if (!editMode.pin) { setEditMode(prev => ({ ...prev, pin: true })); setPinForm({ currentPin: '', newPin: '', confirmPin: '' }); return; }
    if (pinForm.newPin.length !== 4 || !/^\d{4}$/.test(pinForm.newPin)) { setMessage('הקוד החדש חייב להיות בדיוק 4 ספרות'); setTimeout(() => setMessage(''), 3000); return; }
    if (pinForm.currentPin.length !== 4 || !/^\d{4}$/.test(pinForm.currentPin)) { setMessage('הקוד הנוכחי חייב להיות בדיוק 4 ספרות'); setTimeout(() => setMessage(''), 3000); return; }
    if (pinForm.newPin !== pinForm.confirmPin) { setMessage('הקודים החדשים אינם תואמים'); setTimeout(() => setMessage(''), 3000); return; }
    if (!pinForm.currentPin || !pinForm.newPin) { setMessage('יש למלא את כל השדות'); setTimeout(() => setMessage(''), 3000); return; }
    try {
      const response = await post('profile/change-pin', {
        username: account.username,
        profileName: profile.profileName,
        oldPin: pinForm.currentPin,
        newPin: pinForm.newPin
      });
      if (response && response.status === 200 && (response.success || response.message?.includes('successfully'))) {
        setMessage('הקוד שונה בהצלחה!');
        setEditMode(prev => ({ ...prev, pin: false }));
        setPinForm({ currentPin: '', newPin: '', confirmPin: '' });
      } else if (response?.status === 500) {
        if (response.message === 'Internal server error') setMessage('שגיאת שרת: יתכן שהקוד הנוכחי שגוי או שיש בעיה בבסיס הנתונים');
        else setMessage(`שגיאת שרת: ${response.message}`);
      } else if (response?.message) setMessage(`שגיאה: ${response.message}`);
      else setMessage(`שגיאה (סטטוס ${response?.status}): ${JSON.stringify(response)}`);
    } catch (error) {
      console.error('PIN change error:', error);
      if (error?.response?.data?.error) setMessage(`שגיאת שרת: ${error.response.data.error}`);
      else if (error?.response?.data?.message) setMessage(`שגיאה: ${error.response.data.message}`);
      else if (error?.message) setMessage(`שגיאה: ${error.message}`);
      else if (error?.response?.status === 400) setMessage('הקוד הנוכחי שגוי או שחסרים נתונים');
      else if (error?.response?.status === 404) setMessage('הפרופיל לא נמצא');
      else if (error?.response?.status === 500) setMessage('שגיאת שרת פנימית - יתכן שהקוד הנוכחי שגוי או שיש בעיה בשרת');
      else setMessage('שגיאה בשינוי הקוד - אולי הקוד הנוכחי שגוי?');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCancel = (type) => {
    setEditMode(prev => ({ ...prev, [type]: false }));
    if (type === 'profile') setProfileForm({ profileName: profile?.profileName || '', color: profile?.color || '#3B82F6' });
    else if (type === 'password') setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    else if (type === 'pin') setPinForm({ currentPin: '', newPin: '', confirmPin: '' });
  };

  const handleAvatarSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { setMessage('גודל התמונה חייב להיות קטן מ-5MB'); setTimeout(() => setMessage(''), 3000); return; }
      const reader = new FileReader();
      reader.onload = (e) => setAvatarForm({ file, preview: e.target.result });
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarForm.file) { setMessage('אנא בחר תמונה להעלאה'); setTimeout(() => setMessage(''), 3000); return; }
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const response = await post('profile/set-avatar', { username: account.username, profileName: profile.profileName, avatar: reader.result });
          if (response.success || response.message?.includes('successfully')) {
            setProfile(prev => ({ ...prev, avatar: reader.result }));
            setMessage('התמונה הועלתה בהצלחה!');
            setAvatarForm({ file: null, preview: null });
          } else {
            setMessage(`שגיאה בהעלאת התמונה: ${response?.message || 'לא ידוע'}`);
          }
        } catch (error) {
          console.error('Avatar upload error:', error);
          setMessage('שגיאה בהעלאת התמונה');
        }
        setTimeout(() => setMessage(''), 3000);
      };
      reader.readAsDataURL(avatarForm.file);
    } catch (error) {
      console.error('Avatar upload error:', error);
      setMessage('שגיאה בהעלאת התמונה');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const updateProfile = async () => {
    try {
      const response = await post('profile/update-profile', { 
        username: account.username, 
        profileName: profile.profileName 
      });
      
      if (response.ok || response.success || response.message?.includes('successfully')) {
        setProfile(response.profile);
        setMessage('הפרופיל עודכן בהצלחה!');
      } else {
        setMessage(`שגיאה בעדכון הפרופיל: ${response?.message || 'לא ידוע'}`);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      setMessage('שגיאה בעדכון הפרופיל');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleRemoveAvatar = async () => {
    try {
      const response = await post('profile/set-avatar', { username: account.username, profileName: profile.profileName, avatar: null });
      if (response.success || response.message?.includes('successfully')) {
        setProfile(prev => ({ ...prev, avatar: null }));
        setMessage('התמונה הוסרה בהצלחה!');
      } else {
        setMessage(`שגיאה בהסרת התמונה: ${response?.message || 'לא ידוע'}`);
      }
    } catch (error) {
      console.error('Remove avatar error:', error);
      setMessage('שגיאה בהסרת התמונה');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteProfile = () => setDeleteConfirmation({ isOpen: true, pin: '' });

  const confirmDeleteProfile = async () => {
    if (!deleteConfirmation.pin) { setMessage('אנא הזן את הקוד לאישור המחיקה'); setTimeout(() => setMessage(''), 2000); return; }
    if (deleteConfirmation.pin.length !== 4 || !/^\d{4}$/.test(deleteConfirmation.pin)) { setMessage('הקוד חייב להיות 4 ספרות בדיוק'); setTimeout(() => setMessage(''), 2000); return; }
    try {
      const response = await post('profile/delete-profile', { username: account.username, profileName: profile.profileName, pin: deleteConfirmation.pin });
      if (response.success || response.message?.includes('successfully')) {
        setMessage('הפרופיל נמחק בהצלחה!');
        setTimeout(() => { setProfile(null); sessionStorage.removeItem('profile'); navigate('/profiles'); }, 2000);
      } else if (response?.message?.includes('Invalid PIN') || response?.status === 400) {
        setMessage('הקוד שגוי - נסה שוב');
        setTimeout(() => setMessage(''), 2000);
      } else {
        setMessage(`שגיאה במחיקת הפרופיל: ${response?.message || 'לא ידוע'}`);
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (error) {
      console.error('Delete profile error:', error);
      setMessage('שגיאה במחיקת הפרופיל');
      setTimeout(() => setMessage(''), 2000);
    }
    setDeleteConfirmation({ isOpen: false, pin: '' });
  };

  const cancelDeleteProfile = () => setDeleteConfirmation({ isOpen: false, pin: '' });

  const sections = [
    { id: 'profile', name: 'פרופיל', icon: '👤' },
    { id: 'account', name: 'חשבון', icon: '⚙️' },
    { id: 'about', name: 'אודות', icon: 'ℹ️' },
    { id: 'newProfile', name: 'פרופיל חדש', icon: '➕' },
  ];

  if (profile.children && profile.children.length > 0) {
    sections.push({ id: 'addChildrenBudget', name: 'הוספת תקציב לילדים', icon: '👶' });
  }

  return {
    state: {
      activeSection,
      editMode,
      profileForm,
      avatarForm,
      deleteConfirmation,
      passwordForm,
      pinForm,
      message,
      sections,
    },
    actions: {
      updateProfile,
      setActiveSection,
      setEditMode,
      setProfileForm,
      setAvatarForm,
      setDeleteConfirmation,
      setPasswordForm,
      setPinForm,
      setMessage,
      handleLogout,
      handleSwitchProfile,
      handleProfileEdit,
      handlePasswordChange,
      handlePinChange,
      handleCancel,
      handleAvatarSelect,
      handleAvatarUpload,
      handleRemoveAvatar,
      handleDeleteProfile,
      confirmDeleteProfile,
      cancelDeleteProfile,
    },
  };
}
