import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { post } from '../../utils/api.js';

export default function useLogin({ setPassword }) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { setAccount } = useAuth();


    const login = async (username, password) => {
        try {
            username = username.trim().toLowerCase();
            password = password.trim();
            setLoading(true);
            setError(null);
            if (!username || !password) {
                setError('נא למלא את כל השדות');
                setLoading(false);
                return;
            }
            const response = await post('account/validate', { username, password }, false);
            if (response.ok) {
                setAccount(response.account);
                setLoading(false);
                window.location.href = '/profiles';
                return true
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
                setLoading(false);
                return false;
            }
        } catch (error) {
            setError('תקשורת עם השרת נכשלה');
            setLoading(false);
            return false;
        }
    }



    return { error, loading, login };

}