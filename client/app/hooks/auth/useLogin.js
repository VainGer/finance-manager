import { useState } from 'react';
import { post } from '../../utils/api.js';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext.jsx';
export default function useLogin({ setPassword }) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { setAccount, setStoreUser } = useAuth();

    const login = async (username, password, saveUser, toNavigate = true) => {
        try {
            username = username.trim().toLowerCase();
            password = password.trim();
            setLoading(true);
            setError(null);
            setStoreUser(saveUser);
            if (!username || !password) {
                setError('נא למלא את כל השדות');
                setLoading(false);
                return;
            }
            const response = await post('account/validate', { username, password });
            if (response.ok) {
                setAccount(response.account);
                setLoading(false);
                if (toNavigate) {
                    router.push('/authProfile');
                }
                return true;
            } else {
                switch (response.status) {
                    case 400:
                        setError('נא למלא את כל השדות');
                        break;
                    case 401:
                        setError('שם משתמש או סיסמא שגויים');
                        setPassword('');
                        break;
                    case 500:
                        setError('תקלה בשרת, אנא נסה שוב מאוחר יותר');
                        break;
                }
                return false;
            }
            setLoading(false);
        } catch (error) {
            setError('תקשורת עם השרת נכשלה');
            setLoading(false);
            return false;
        }
    }

    return { error, loading, login };

}