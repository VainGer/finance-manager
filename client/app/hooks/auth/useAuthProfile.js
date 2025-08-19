import { post, get } from '../../utils/api.js';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

export default function useAuthProfile({ account, setProfile }) {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const fetchProfilesData = async () => {
        setLoading(true);
        const response = await get('profile/get-profiles?username=' + account.username);
        if (response.ok) {
            setProfiles(response.profiles || []);
        } if (response.status === 500) {
            setError('שגיאה בטעינת פרופילים');
        }
        setLoading(false);
    };

    const authProfile = async (profileName, pin) => {
        setLoading(true);
        pin = pin.trim();
        const response = await post('profile/validate-profile',
            { username: account.username, profileName, pin });
        if (response.ok) {
            setProfile(response.profile);
            router.replace('/home/budgetSummary');
        } else {
            setError('הוזן קוד סודי שגוי');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProfilesData();
    }, [account]);

    return { profiles, loading, error, authProfile };
}
