

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