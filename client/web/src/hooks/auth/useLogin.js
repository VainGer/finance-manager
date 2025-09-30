import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { post } from '../../utils/api';

export default function useLogin({ setPassword }) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
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
            
            const response = await post('account/validate', { username, password }, false); // לא secure
            
            if (response.ok) {
                setAccount(response.account);
                setLoading(false);
                navigate('/profiles');
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
                    default:
                        setError('התחברות נכשלה');
                }
                setLoading(false);
                return false;
            }
        } catch (error) {
            setError('תקשורת עם השרת נכשלה');
            setLoading(false);
            return false;
        }
    };

    return { error, loading, login };
}
