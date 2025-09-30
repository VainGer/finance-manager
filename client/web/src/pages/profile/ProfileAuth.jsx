import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { get, post } from '../../utils/api';
import CreateProfile from '../../components/profile/CreateProfile';
import ProfileList from '../../components/profile/ProfileList';
import AuthForm from '../../components/profile/AuthForm';
import PageLayout from '../../components/layout/PageLayout';
import NavigationHeader from '../../components/layout/NavigationHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import Alert from '../../components/common/Alert';

export default function ProfileAuth() {
    const navigate = useNavigate();
    const location = useLocation();
    const { account, setProfile } = useAuth();

    const [profiles, setProfiles] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [showCreateProfile, setShowCreateProfile] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pinInput, setPinInput] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Navigation configuration with logout option
    const navigationButtons = [
        {
            label: 'התנתק',
            path: '/',
            style: 'outline',
            className: 'border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 transition-all duration-300',
            onClick: () => {
                // Clear authentication and redirect to home
                localStorage.removeItem('token');
                localStorage.removeItem('account');
            }
        }
    ];

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const message = urlParams.get('message');
        if (message === 'profile-created') {
            setSuccessMessage('הפרופיל נוצר בהצלחה!');
            navigate('/profiles', { replace: true });
            setTimeout(() => setSuccessMessage(''), 5000);
        }
    }, [location.search, navigate]);

    useEffect(() => {

        const fetchProfilesData = async () => {
            setLoading(true);
            const response = await get('profile/get-profiles?username=' + account.username);
            setProfiles(response.profiles || []);
            setLoading(false);
        };
        fetchProfilesData();
    }, [account, navigate]);

    const refreshProfiles = async () => {
        const response = await get('profile/get-profiles?username=' + account.username);
        setProfiles(response.profiles || []);
        setShowCreateProfile(false);
        setSuccessMessage('הפרופיל נוצר בהצלחה!');
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    const authProfile = async (e) => {
        e.preventDefault();
        if (!account || !selectedProfile) {
            setError('נתונים חסרים');
            return;
        }
        if (!pinInput) {
            setError('אנא הזן את הקוד הסודי');
            return;
        }
        
        try {
            const response = await post('profile/validate-profile',
            { 
                username: account.username, 
                profileName: selectedProfile.profileName, 
                pin: pinInput,
                device: navigator.userAgent,
                remember: true
            });
            
        console.log('PIN validation response:', response); // Debug log
        
        if (response.ok) {
            console.log('Server returned profile:', response.profile);
            console.log('Profile ID from server:', response.profile?._id);
            setProfile(response.profile);
            // שמירת טוקנים אם יש
            if (response.tokens && response.tokens.accessToken) {
                localStorage.setItem('accessToken', response.tokens.accessToken);
            }
            if (response.tokens && response.tokens.refreshToken) {
                localStorage.setItem('refreshToken', response.tokens.refreshToken);
            }
            navigate('/dashboard');
        } else {
            // בדיקה מפורטת של תגובת השרת
            console.log('PIN validation failed:', {
                status: response.status,
                message: response.message,
                error: response.error
            });
            
            if (response.status === 400 || response.status === 401) {
                // בדיקת הודעת השגיאה המדויקת מהשרת
                if (response.message && response.message.includes('PIN') || 
                    response.message && response.message.includes('pin') ||
                    response.message && response.message.includes('קוד') ||
                    response.error && response.error.includes('PIN') ||
                    response.error && response.error.includes('pin')) {
                    setError('הקוד הסודי שגוי, אנא נסה שוב');
                } else {
                    setError('הקוד הסודי שגוי, אנא נסה שוב');
                }
            } else if (response.status === 404) {
                setError('פרופיל לא נמצא');
            } else if (response.status >= 500) {
                setError('תקלה בשרת, אנא נסה שוב מאוחר יותר');
            } else {
                // הודעה כללית עם פרטי השגיאה
                setError(`שגיאה: ${response.message || response.error || 'הקוד הסודי שגוי'}`);
            }
        }
        } catch (error) {
            console.error('PIN validation error:', error);
            setError('שגיאת תקשורת עם השרת, אנא נסה שוב');
        }
    }


    return (
        <PageLayout>
            <NavigationHeader leftButtons={navigationButtons} />
            
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">
                            ניהול פרופילים
                        </h1>
                        <p className="text-lg text-slate-600">
                            בחר פרופיל כדי להתחיל לנהל את הכספים שלך
                        </p>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="mb-6">
                            <Alert type="success" message={successMessage} />
                        </div>
                    )}

                    {/* Content */}
                    {loading ? (
                        <div className="flex justify-center items-center min-h-[400px]">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Show Profile List */}
                            {profiles.length > 0 && !selectedProfile && (
                                <ProfileList 
                                    profiles={profiles} 
                                    onSelect={setSelectedProfile} 
                                />
                            )}

                            {/* Show Create Profile */}
                            {(!profiles || profiles.length === 0) && (
                                <CreateProfile 
                                    username={account.username} 
                                    firstProfile={true} 
                                    onProfileCreated={refreshProfiles} 
                                />
                            )}

                            {/* Show Auth Form */}
                            {selectedProfile && (
                                <AuthForm 
                                    selectedProfile={selectedProfile}
                                    error={error}
                                    onSubmit={authProfile}
                                    setPinInput={setPinInput}
                                    onCancel={() => setSelectedProfile(null)}
                                    loading={loading} 
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
}