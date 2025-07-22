import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { get, post } from '../../utils/api';
import CreateProfile from '../../components/profile/CreateProfile';

export default function ProfileAuth() {
    const navigate = useNavigate();
    const { account } = useAuth();

    const [profiles, setProfiles] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [loading, setLoading] = useState(true);
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

    return (
        <>
            {profiles.length > 0 && (
                <div>Profile List</div>
            )}
            {profiles.length >= 0 && (
                <div>
                    <CreateProfile username={account.username} firstProfile={profiles.length === 0} />
                </div>
            )}
        </>
    );
}