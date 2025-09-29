import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { post } from '../../utils/api.js';
export default function useRegister({ setPassword, setUsername, setConfirmPassword }) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const register = async (username, password, confirmPassword) => {
        try {
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
            const response = await post('account/register', { username, password }, false);

            if (response.ok) {
                router.replace('/login');
                return;
            }

            switch (response.status) {
                case 400:
                    setError('נא למלא את כל השדות בצורה תקינה');
                    break;
                case 409:
                    setError('שם המשתמש כבר קיים במערכת');
                    setUsername('');
                    break;
                case 500:
                    setError('תקלה בשרת, אנא נסה שוב מאוחר יותר');
                    break;
                case 503:
                    setError('השירות אינו זמין כרגע, אנא נסה שוב מאוחר יותר');
                    break;
                default:
                    setError('הרשמה נכשלה');
                    setUsername('');
                    setPassword('');
                    setConfirmPassword('');
            }
        } catch (error) {
            setError('תקשורת עם השרת נכשלה');
            console.error('Registration error:', error);
        } finally {
            setLoading(false);
        }
    }
    return { error, loading, register };
}