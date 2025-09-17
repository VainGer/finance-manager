import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { post } from '../../utils/api.js';
export default function useRegister({ setPassword, setUsername, setConfirmPassword }) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const register = async (username, password, confirmPassword) => {
        username = username.trim().toLowerCase();
        password = password.trim();
        confirmPassword = confirmPassword.trim();
        if (password !== confirmPassword) {
            setError('הסיסמאות אינן תואמות');
            return;
        }
        if (!username || !password) {
            setError('נא למלא את כל השדות');
            return;
        }
        if (password.length < 6) {
            setError('הסיסמה חייבת להיות באורך של לפחות 6 תווים');
            return;
        }
        setLoading(true);
        setError(null);
        const response = await post('account/register', { username, password });
        if (response.ok) {
            setLoading(false);
            router.replace('/login');
        } else if (response.status === 500) {
            setLoading(false);
            setError('תקלה בשרת, אנא נסה שוב מאוחר יותר');
        } else {
            setLoading(false);
            setError('הרשמה נכשלה');
            setUsername('');
            setPassword('');
            setConfirmPassword('');
        }
    }
    return { error, loading, register };
}