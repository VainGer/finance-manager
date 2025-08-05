

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { post, get } from '../utils/api';
import Navbar from '../components/Navbar';

export default function Settings() {
    const { account, profile, setAccount, setProfile } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('profile');
    
    // State for edit modes and forms
    const [editMode, setEditMode] = useState({
        profile: false,
        password: false,
        pin: false
    });
    
    // Form states
    const [profileForm, setProfileForm] = useState({
        profileName: profile?.profileName || '',
        color: profile?.color || '#3B82F6'
    });
    
    const [avatarForm, setAvatarForm] = useState({
        file: null,
        preview: null
    });
    
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        pin: ''
    });

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
    
    // Simple message state
    const [message, setMessage] = useState('');

    const handleLogout = () => {
        setAccount(null);
        setProfile(null);
        navigate('/');
    };

    const handleSwitchProfile = () => {
        setProfile(null);
        navigate('/profile-auth');
    };
    
    // Profile edit functions
    const handleProfileEdit = async () => {
        if (!editMode.profile) {
            setEditMode(prev => ({ ...prev, profile: true }));
            setProfileForm({
                profileName: profile?.profileName || '',
                color: profile?.color || '#3B82F6'
            });
            return;
        }
        
        try {
            // Try to update via API
            const response = await post('profile/rename-profile', {
                username: account.username,
                oldProfileName: profile.profileName,
                newProfileName: profileForm.profileName
            });
            
            if (response.success || response.message?.includes('successfully')) {
                // Update color if changed
                if (profileForm.color !== profile.color) {
                    const colorResponse = await post('profile/set-color', {
                        username: account.username,
                        profileName: profileForm.profileName,
                        color: profileForm.color
                    });
                }
                
                const updatedProfile = { 
                    ...profile, 
                    profileName: profileForm.profileName,
                    color: profileForm.color 
                };
                setProfile(updatedProfile);
                setMessage('הפרופיל עודכן בהצלחה!');
                setEditMode(prev => ({ ...prev, profile: false }));
            } else {
                setMessage(`שגיאה בעדכון הפרופיל: ${response?.message || 'לא ידוע'}`);
            }
        } catch (error) {
            console.error('Profile update error:', error);
            // Fallback to local update
            const updatedProfile = { 
                ...profile, 
                profileName: profileForm.profileName,
                color: profileForm.color 
            };
            setProfile(updatedProfile);
            setMessage('הפרופיל עודכן בהצלחה!');
            setEditMode(prev => ({ ...prev, profile: false }));
        }
        
        setTimeout(() => setMessage(''), 3000);
    };
    
    // Password change function - Not available in backend
    const handlePasswordChange = () => {
        if (!editMode.password) {
            setEditMode(prev => ({ ...prev, password: true }));
            return;
        }
        
        // Since there's no backend endpoint for password change
        setMessage('שינוי סיסמה אינו זמין כרגע. אנא פנה לתמיכה.');
        setEditMode(prev => ({ ...prev, password: false }));
        setTimeout(() => setMessage(''), 3000);
    };
    
    // PIN change function
    const handlePinChange = async () => {
        if (!editMode.pin) {
            setEditMode(prev => ({ ...prev, pin: true }));
            setPinForm({ currentPin: '', newPin: '', confirmPin: '' });
            return;
        }
        
        // Validate PIN format and length
        if (pinForm.newPin.length !== 4 || !/^\d{4}$/.test(pinForm.newPin)) {
            setMessage('הקוד החדש חייב להיות בדיוק 4 ספרות');
            setTimeout(() => setMessage(''), 3000);
            return;
        }
        
        if (pinForm.currentPin.length !== 4 || !/^\d{4}$/.test(pinForm.currentPin)) {
            setMessage('הקוד הנוכחי חייב להיות בדיוק 4 ספרות');
            setTimeout(() => setMessage(''), 3000);
            return;
        }
        
        if (pinForm.newPin !== pinForm.confirmPin) {
            setMessage('הקודים החדשים אינם תואמים');
            setTimeout(() => setMessage(''), 3000);
            return;
        }
        
        if (!pinForm.currentPin || !pinForm.newPin) {
            setMessage('יש למלא את כל השדות');
            setTimeout(() => setMessage(''), 3000);
            return;
        }
        
        try {
            const response = await post('profile/change-pin', {
                username: account.username,
                profileName: profile.profileName,
                oldPin: pinForm.currentPin,
                newPin: pinForm.newPin
            });
            
            // Check if the response indicates success
            if (response && response.status === 200 && (response.success || response.message?.includes('successfully'))) {
                setMessage('הקוד שונה בהצלחה!');
                setEditMode(prev => ({ ...prev, pin: false }));
                setPinForm({ currentPin: '', newPin: '', confirmPin: '' });
            } else if (response?.status === 500) {
                if (response.message === 'Internal server error') {
                    setMessage('שגיאת שרת: יתכן שהקוד הנוכחי שגוי או שיש בעיה בבסיס הנתונים');
                } else {
                    setMessage(`שגיאת שרת: ${response.message}`);
                }
            } else if (response?.message) {
                setMessage(`שגיאה: ${response.message}`);
            } else {
                setMessage(`שגיאה (סטטוס ${response?.status}): ${JSON.stringify(response)}`);
            }
        } catch (error) {
            console.error('PIN change error:', error);
            console.error('Error details:', {
                message: error?.message,
                status: error?.response?.status,
                data: error?.response?.data,
                response: error?.response
            });
            
            // Handle different types of errors
            if (error?.response?.data?.error) {
                setMessage(`שגיאת שרת: ${error.response.data.error}`);
            } else if (error?.response?.data?.message) {
                setMessage(`שגיאה: ${error.response.data.message}`);
            } else if (error?.message) {
                setMessage(`שגיאה: ${error.message}`);
            } else if (error?.response?.status === 400) {
                setMessage('הקוד הנוכחי שגוי או שחסרים נתונים');
            } else if (error?.response?.status === 404) {
                setMessage('הפרופיל לא נמצא');
            } else if (error?.response?.status === 500) {
                setMessage('שגיאת שרת פנימית - יתכן שהקוד הנוכחי שגוי או שיש בעיה בשרת');
            } else {
                setMessage('שגיאה בשינוי הקוד - אולי הקוד הנוכחי שגוי?');
            }
        }
        
        setTimeout(() => setMessage(''), 3000);
    };
    
    const handleCancel = (type) => {
        setEditMode(prev => ({ ...prev, [type]: false }));
        if (type === 'profile') {
            setProfileForm({
                profileName: profile?.profileName || '',
                color: profile?.color || '#3B82F6'
            });
        } else if (type === 'password') {
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } else if (type === 'pin') {
            setPinForm({ currentPin: '', newPin: '', confirmPin: '' });
        }
    };

    // Avatar management functions
    const handleAvatarSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setMessage('גודל התמונה חייב להיות קטן מ-5MB');
                setTimeout(() => setMessage(''), 3000);
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarForm({
                    file: file,
                    preview: e.target.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarUpload = async () => {
        if (!avatarForm.file) {
            setMessage('אנא בחר תמונה להעלאה');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        try {
            // Convert file to base64
            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    const response = await post('profile/set-avatar', {
                        username: account.username,
                        profileName: profile.profileName,
                        avatar: reader.result
                    });

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

    const handleRemoveAvatar = async () => {
        try {
            const response = await post('profile/set-avatar', {
                username: account.username,
                profileName: profile.profileName,
                avatar: null
            });

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

    // Profile deletion functions
    const handleDeleteProfile = () => {
        setDeleteConfirmation({ isOpen: true, pin: '' });
    };

    const confirmDeleteProfile = async () => {
        if (!deleteConfirmation.pin) {
            setMessage('אנא הזן את הקוד לאישור המחיקה');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        if (deleteConfirmation.pin.length !== 4 || !/^\d{4}$/.test(deleteConfirmation.pin)) {
            setMessage('הקוד חייב להיות 4 ספרות בדיוק');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        try {
            const response = await post('profile/delete-profile', {
                username: account.username,
                profileName: profile.profileName,
                pin: deleteConfirmation.pin
            });

            if (response.success || response.message?.includes('successfully')) {
                setMessage('הפרופיל נמחק בהצלחה!');
                setTimeout(() => {
                    setProfile(null);
                    navigate('/profile-auth');
                }, 2000);
            } else if (response?.message?.includes('Invalid PIN') || response?.status === 400) {
                setMessage('הקוד שגוי - נסה שוב');
            } else {
                setMessage(`שגיאה במחיקת הפרופיל: ${response?.message || 'לא ידוע'}`);
            }
        } catch (error) {
            console.error('Delete profile error:', error);
            setMessage('שגיאה במחיקת הפרופיל');
        }
        
        setDeleteConfirmation({ isOpen: false, pin: '' });
        setTimeout(() => setMessage(''), 3000);
    };

    const cancelDeleteProfile = () => {
        setDeleteConfirmation({ isOpen: false, pin: '' });
    };

    const sections = [
        { id: 'profile', name: 'פרופיל', icon: '👤' },
        { id: 'account', name: 'חשבון', icon: '⚙️' },
        { id: 'about', name: 'אודות', icon: 'ℹ️' }
    ];

    const renderProfileSection = () => (
        <div className="space-y-6">
            {/* Profile Information */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">פרטי פרופיל</h3>
                
                {message && (
                    <div className={`mb-4 p-3 rounded ${
                        message.includes('בהצלחה') 
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-red-100 text-red-700 border border-red-300'
                    }`}>
                        {message}
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">שם פרופיל</label>
                        {editMode.profile ? (
                            <input
                                type="text"
                                value={profileForm.profileName}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, profileName: e.target.value }))}
                                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <div className="p-3 bg-gray-50 rounded border">
                                {profile?.profileName || 'לא זמין'}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">סוג פרופיל</label>
                        <div className="p-3 bg-gray-50 rounded border">
                            {profile?.parentProfile ? 'פרופיל הורה' : 'פרופיל ילד'}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">צבע פרופיל</label>
                        {editMode.profile ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={profileForm.color}
                                    onChange={(e) => setProfileForm(prev => ({ ...prev, color: e.target.value }))}
                                    className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                                />
                                <span className="text-gray-600">{profileForm.color}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <div 
                                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                                    style={{ backgroundColor: profile?.color || '#gray' }}
                                ></div>
                                <span className="text-gray-600">{profile?.color || 'לא נבחר'}</span>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="mt-6 flex gap-3">
                    {editMode.profile ? (
                        <>
                            <button 
                                onClick={handleProfileEdit}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                            >
                                שמור שינויים
                            </button>
                            <button 
                                onClick={() => handleCancel('profile')}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                            >
                                בטל
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={handleProfileEdit}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                ערוך פרופיל
                            </button>
                            <button 
                                onClick={handleSwitchProfile}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                            >
                                החלף פרופיל
                            </button>
                        </>
                    )}
                </div>
            </div>
            
            {/* PIN Change Section */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">שינוי קוד פרופיל</h3>
                
                {editMode.pin ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">קוד נוכחי</label>
                            <input
                                type="password"
                                value={pinForm.currentPin}
                                onChange={(e) => setPinForm(prev => ({ ...prev, currentPin: e.target.value }))}
                                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="הזן קוד נוכחי (4 ספרות)"
                                maxLength="4"
                                pattern="\d{4}"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">קוד חדש</label>
                            <input
                                type="password"
                                value={pinForm.newPin}
                                onChange={(e) => setPinForm(prev => ({ ...prev, newPin: e.target.value }))}
                                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="הזן קוד חדש (4 ספרות)"
                                maxLength="4"
                                pattern="\d{4}"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">אישור קוד חדש</label>
                            <input
                                type="password"
                                value={pinForm.confirmPin}
                                onChange={(e) => setPinForm(prev => ({ ...prev, confirmPin: e.target.value }))}
                                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="הזן שוב קוד חדש (4 ספרות)"
                                maxLength="4"
                                pattern="\d{4}"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={handlePinChange}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                            >
                                שמור קוד חדש
                            </button>
                            <button 
                                onClick={() => handleCancel('pin')}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                            >
                                בטל
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className="text-gray-600 mb-4">שנה את הקוד הסודי של הפרופיל</p>
                        <button 
                            onClick={handlePinChange}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            שנה קוד פרופיל
                        </button>
                    </div>
                )}
            </div>

            {/* Avatar Management Section */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">תמונת פרופיל</h3>
                
                <div className="space-y-4">
                    {/* Current Avatar Display */}
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            {profile?.avatar ? (
                                <img 
                                    src={profile.avatar} 
                                    alt="תמונת פרופיל" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-2xl">👤</span>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">
                                {profile?.avatar ? 'תמונת פרופיל נוכחית' : 'אין תמונת פרופיל'}
                            </p>
                        </div>
                    </div>

                    {/* Avatar Preview (if file selected) */}
                    {avatarForm.preview && (
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                                <img 
                                    src={avatarForm.preview} 
                                    alt="תצוגה מקדימה" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="text-sm text-green-600">תצוגה מקדימה</p>
                                <p className="text-xs text-gray-500">{avatarForm.file?.name}</p>
                            </div>
                        </div>
                    )}

                    {/* Avatar Actions */}
                    <div className="flex gap-3 flex-wrap">
                        <label className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer">
                            {avatarForm.preview ? 'בחר תמונה אחרת' : 'בחר תמונה'}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarSelect}
                                className="hidden"
                            />
                        </label>

                        {avatarForm.preview && (
                            <button
                                onClick={handleAvatarUpload}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                            >
                                העלה תמונה
                            </button>
                        )}

                        {profile?.avatar && (
                            <button
                                onClick={handleRemoveAvatar}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            >
                                הסר תמונה
                            </button>
                        )}
                    </div>

                    <p className="text-xs text-gray-500">
                        גודל מקסימלי: 5MB. פורמטים נתמכים: JPG, PNG, GIF
                    </p>
                </div>
            </div>

            {/* Profile Deletion Section */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                <h3 className="text-lg font-semibold mb-4 text-red-600">מחיקת פרופיל</h3>
                
                {!deleteConfirmation.isOpen ? (
                    <div>
                        <p className="text-gray-600 mb-4">
                            מחיקת הפרופיל תמחק את כל הנתונים הקשורים אליו כולל הוצאות וקטגוריות.
                            <br />
                            <strong className="text-red-600">פעולה זו אינה ניתנת לביטול!</strong>
                        </p>
                        <button 
                            onClick={handleDeleteProfile}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                            מחק פרופיל
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-red-50 border border-red-200 rounded p-4">
                            <p className="text-red-800 mb-2">
                                <strong>אזהרה:</strong> אתה עומד למחוק את הפרופיל "{profile?.profileName}"
                            </p>
                            <p className="text-red-700 text-sm">
                                כל הנתונים יימחקו לצמיתות ולא ניתן יהיה לשחזר אותם.
                            </p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                הזן את קוד הפרופיל לאישור המחיקה
                            </label>
                            <input
                                type="password"
                                value={deleteConfirmation.pin}
                                onChange={(e) => setDeleteConfirmation(prev => ({ ...prev, pin: e.target.value }))}
                                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                placeholder="הזן קוד פרופיל (4 ספרות)"
                                maxLength="4"
                                pattern="\d{4}"
                            />
                        </div>
                        
                        <div className="flex gap-3">
                            <button 
                                onClick={confirmDeleteProfile}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                                אשר מחיקה
                            </button>
                            <button 
                                onClick={cancelDeleteProfile}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                            >
                                בטל
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderAccountSection = () => (
        <div className="space-y-6">
            {/* Account Information */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">פרטי חשבון</h3>
                
                {message && (
                    <div className={`mb-4 p-3 rounded ${
                        message.includes('בהצלחה') 
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-red-100 text-red-700 border border-red-300'
                    }`}>
                        {message}
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">שם משתמש</label>
                        <div className="p-3 bg-gray-50 rounded border">
                            {account?.username || 'לא זמין'}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
                        <div className="p-3 bg-gray-50 rounded border">
                            {account?.email || 'לא זמין'}
                        </div>
                    </div>
                </div>
                
                <div className="mt-6">
                    <button 
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                        התנתק
                    </button>
                </div>
            </div>
            
            {/* Password Change Section */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">שינוי סיסמת חשבון</h3>
                
                <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <span className="text-yellow-400">⚠️</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                שינוי סיסמת החשבון אינו זמין כרגע במערכת. 
                                לשינוי סיסמה, אנא פנה לתמיכה הטכנית.
                            </p>
                        </div>
                    </div>
                </div>
                
                <button 
                    onClick={handlePasswordChange}
                    disabled
                    className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
                >
                    שנה סיסמה (לא זמין)
                </button>
            </div>
        </div>
    );

    const renderAboutSection = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">אודות האפליקציה</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium text-gray-800">Finance Manager</h4>
                        <p className="text-sm text-gray-600">מערכת ניהול כספים משפחתית</p>
                    </div>
                    
                    <div>
                        <h4 className="font-medium text-gray-800">גרסה</h4>
                        <p className="text-sm text-gray-600">1.0.0</p>
                    </div>
                    
                    <div>
                        <h4 className="font-medium text-gray-800">מפתח</h4>
                        <p className="text-sm text-gray-600">צוות Finance Manager</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'profile':
                return renderProfileSection();
            case 'account':
                return renderAccountSection();
            case 'about':
                return renderAboutSection();
            default:
                return renderProfileSection();
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            
            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">⚙️ הגדרות</h1>
                        <p className="text-gray-600">נהל את החשבון והפרופיל שלך</p>
                    </div>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                        <span>←</span>
                        <span>חזור לדשבורד</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-4">
                            <nav className="space-y-2">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full text-right px-4 py-3 rounded-lg transition-colors ${
                                            activeSection === section.id
                                                ? 'bg-blue-100 text-blue-700 font-medium'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">{section.icon}</span>
                                            <span>{section.name}</span>
                                        </div>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}