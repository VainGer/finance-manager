import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { get, post } from '../../utils/api';
import CreateProfile from '../../components/profile/CreateProfile';
import ProfileList from '../../components/profile/ProfileList';
import Navbar from '../../components/Navbar';

export default function ProfileAuth() {
    const navigate = useNavigate();
    const location = useLocation();
    const { account } = useAuth();
    const { setProfile } = useAuth();

    const [profiles, setProfiles] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pinInput, setPinInput] = useState('');
    const [error, setError] = useState('');
    const [showCreateProfile, setShowCreateProfile] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Check for success message from URL params (only for profile creation)
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const message = urlParams.get('message');
        // Only show success message for profile creation, not deletion
        if (message === 'profile-created') {
            setSuccessMessage('הפרופיל נוצר בהצלחה!');
            // Clear the URL params
            navigate('/profiles', { replace: true });
            // Clear message after 5 seconds
            setTimeout(() => setSuccessMessage(''), 5000);
        }
    }, [location.search, navigate]);

    // if (!account) {
    //     alert('עליך להיכנס לחשבון כדי לגשת לדף זה');
    //     navigate('/login');
    //     return null;
    // }

    useEffect(() => {
        if (!account) {
            navigate('/login');
            return;
        }
        
        const fetchProfilesData = async () => {
            setLoading(true);
            const response = await get('profile/get-profiles?username=' + account.username);
            setProfiles(response.profiles || []);
            setLoading(false);
        };
        fetchProfilesData();
    }, [account, navigate]);

    const refreshProfiles = async () => {
        if (!account) {
            navigate('/login');
            return;
        }
        const response = await get('profile/get-profiles?username=' + account.username);
        setProfiles(response.profiles || []);
        setShowCreateProfile(false);
        // Show success message for profile creation
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
        const response = await post('profile/validate-profile',
            { username: account.username, profileName: selectedProfile.profileName, pin: pinInput });

        if (response.ok) {
            setProfile(response.profile);
            navigate('/dashboard');
        } else if (response.status === 401) {
            setError('הקוד הסודי שגוי, אנא נסה שוב');
        } else {
            setError('תקלה בשרת, אנא נסה שוב מאוחר יותר');
        }
    }


    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            {!account ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🔄</div>
                        <div className="text-xl font-semibold text-gray-600">מפנה להתחברות...</div>
                    </div>
                </div>
            ) : loading && profiles.length === 0 ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="loader"></div>
                </div>
            ) : !selectedProfile && !showCreateProfile ? (
                <div className="container mx-auto text-center py-10" dir="rtl">
                    {/* Success Message */}
                    {successMessage && (
                        <div className="mb-6 mx-auto max-w-md opacity-0 animate-pulse" style={{
                            animation: 'fadeIn 0.5s ease-in-out forwards'
                        }}>
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-md relative">
                                <button
                                    onClick={() => setSuccessMessage('')}
                                    className="absolute top-2 left-2 text-green-600 hover:text-green-800 font-bold text-lg transition-colors"
                                    title="סגור הודעה"
                                >
                                    ×
                                </button>
                                <div className="flex items-center justify-center">
                                    <span className="text-2xl mr-2">✅</span>
                                    <span className="font-medium">{successMessage}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <h1 className="text-4xl font-bold mb-4">בחירת פרופיל</h1>
                    <p className="text-lg text-gray-600 mb-8">בחר פרופיל כדי להמשיך</p>
                    {profiles.length > 0 ? (
                        <div>
                            <ProfileList 
                                profiles={profiles} 
                                onSelect={setSelectedProfile} 
                                onAddProfile={() => setShowCreateProfile(true)}
                            />
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">לא נמצאו פרופילים, צור פרופיל ראשון</h2>
                            <CreateProfile username={account.username} firstProfile={true} />
                        </div>
                    )}
                </div>
            ) : showCreateProfile ? (
                <div className="container mx-auto text-center py-10" dir="rtl">
                    <h1 className="text-4xl font-bold mb-4">צור פרופיל חדש</h1>
                    <div className="max-w-md mx-auto">
                        <CreateProfile 
                            username={account.username} 
                            firstProfile={false}
                            onProfileCreated={refreshProfiles}
                        />
                        <button
                            onClick={() => setShowCreateProfile(false)}
                            className="mt-4 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            ← חזור לרשימת הפרופילים
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                        <h1 className="text-2xl font-bold text-center text-gray-900">
                            כניסה לפרופיל: {selectedProfile.profileName}
                        </h1>
                        {error && <p className="text-sm text-center text-red-600 bg-red-100 border border-red-400 rounded-md py-2 px-4">{error}</p>}
                        <form className='space-y-6' onSubmit={authProfile}>
                            <div>
                                <input
                                    type="password"
                                    placeholder="הזן את הקוד הסודי"
                                    onChange={(e) => setPinInput(e.target.value)}
                                    className="w-full px-4 py-2 text-center border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    maxLength="4"
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => { setSelectedProfile(null); setError(''); }}
                                    className="w-full py-2 px-4 font-semibold text-gray-700 bg-gray-200 rounded-md shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    ביטול
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-2 px-4 font-semibold text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'מאמת...' : 'כניסה'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}