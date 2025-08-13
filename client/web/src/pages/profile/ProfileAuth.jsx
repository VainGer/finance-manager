import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { get, post } from '../../utils/api';
import CreateProfile from '../../components/profile/CreateProfile';
import ProfileList from '../../components/profile/ProfileList';
import Navbar from '../../components/Navbar';
import AuthForm from '../../components/profile/AuthForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Footer from '../../components/common/Footer';

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
        const response = await post('profile/validate-profile',
            { username: account.username, profileName: selectedProfile.profileName, pin: pinInput });
        if (response.ok) {
            setProfile(response.profile);
            navigate('/dashboard');
        } else if (response.status === 400) {
            setError('הקוד הסודי שגוי, אנא נסה שוב');
        } else {
            setError('תקלה בשרת, אנא נסה שוב מאוחר יותר');
        }
    }


    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            {loading ? <LoadingSpinner /> : (
                <>
                    {profiles.length > 0 && !selectedProfile && <ProfileList profiles={profiles} onSelect={setSelectedProfile} />}
                    {!profiles || profiles.length === 0 && <CreateProfile username={account.username} firstProfile={true} onProfileCreated={refreshProfiles} />}
                    {selectedProfile && <AuthForm selectedProfile={selectedProfile}
                        error={error}
                        onSubmit={authProfile}
                        setPinInput={setPinInput}
                        onCancel={() => setSelectedProfile(null)}
                        loading={loading} />}
                </>)}
                
            {/* Footer */}
            <Footer />
        </div>
    );
}