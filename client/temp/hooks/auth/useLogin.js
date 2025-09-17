import { useState } from 'react';
import { post } from '../../utils/api.js';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext.jsx';
export default function useLogin({ setPassword }) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { setAccount } = useAuth();

    const login = async (username, password) => {
        username = username.trim().toLowerCase();
        password = password.trim();
        setLoading(true);
        setError(null);
        if (!username || !password) {
            setError('נא למלא את כל השדות');
            setLoading(false);
            return;
        }
        const response = await post('account/validate', { username, password });
        if (response.ok) {
            setAccount(response.account);
            router.push('/authProfile');
        } else if (response.status === 500) {
            setError('תקלה בשרת, אנא נסה שוב מאוחר יותר');
        } else {
            setError('שם משתמש או סיסמא שגויים');
            setPassword('');
        }
        setLoading(false);
    }
    return { error, loading, login };
}