import { useState, useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { get, post } from '../../utils/api';
import CreateProfile from '../../components/profile/CreateProfile';
import ProfileList from '../../components/profile/ProfileList';

export default function ProfileAuth() {
    const navigate = useNavigate();
    const { account } = useAuth();

    const [profiles, setProfiles] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pinInput, setPinInput] = useState('');
    const [error, setError] = useState('');

    // if (!account) {
    //     alert('עליך להיכנס לחשבון כדי לגשת לדף זה');
    //     navigate('/login');
    //     return null;
    // }

    useEffect(() => {
        const fetchProfilesData = async () => {
            setLoading(true);
            const response = await get('profile/get-profiles?username=' + account.username);
            setProfiles(response.profiles);
            setLoading(false);
        };
        fetchProfilesData();
    }, [account]);

    const authProfile = async (e) => {
        e.preventDefault();
        if (!pinInput) {
            setError('אנא הזן את הקוד הסודי');
            return;
        }
        const response = await post('profile/validate-profile',
            { username: account.username, profileName: selectedProfile.profileName, pin: pinInput });

        if (response.ok) {
            navigate('/dashboard');
        } else if (response.status === 401) {
            setError('הקוד הסודי שגוי, אנא נסה שוב');
        } else {
            setError('תקלה בשרת, אנא נסה שוב מאוחר יותר');
        }
    }

    return (
        <>
            {loading && profiles.length === 0 ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="loader"></div>
                </div>
            ) : !selectedProfile ? (
                <div className="container mx-auto text-center py-10">
                    <h1 className="text-4xl font-bold mb-4">בחירת פרופיל</h1>
                    <p className="text-lg text-gray-600 mb-8">בחר פרופיל כדי להמשיך</p>
                    {profiles.length > 0 ? (
                        <ProfileList profiles={profiles} onSelect={setSelectedProfile} />
                    ) : (
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">לא נמצאו פרופילים, צור פרופיל ראשון</h2>
                            <CreateProfile username={account.username} firstProfile={true} onProfileCreated={(newProfile) => setProfiles([newProfile])} />
                        </div>
                    )}
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
                                    value={pinInput}
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
        </>
    );
}