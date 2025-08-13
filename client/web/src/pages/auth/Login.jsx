import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { post } from '../../utils/api';
import Button from '../../components/common/Button';
import Footer from '../../components/common/Footer';

export default function Login() {

    const { setAccount } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username || !password || username.trim() === '' || password.trim() === '') {
            setError('אנא מלא את כל השדות');
            return;
        }
        setLoading(true);
        try {
            const response = await post('account/validate', { username, password });
            if (response.ok) {
                setAccount(response.account);
                navigate('/profiles');
            } else if (response.status === 500) {
                setError('תקלה בשרת, אנא נסה שוב מאוחר יותר');
            } else {
                setError('שם משתמש או סיסמא שגויים');
                setPassword('');
            }
        } catch (error) {
            setError('תקשורת עם השרת נכשלה');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-center text-gray-900">התחברות</h1>
                    {error && <p className="text-sm text-center text-red-600 bg-red-100 border border-red-400 rounded-md py-2 px-4">{error}</p>}
                    <form className='space-y-6' onSubmit={handleLogin}>
                        <div>
                            <input
                                type="text"
                                placeholder="שם משתמש"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    if (error) setError(''); // Clear error when user types
                                }}
                                className="w-full px-4 py-2 text-right border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="סיסמא"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) setError(''); // Clear error when user types
                                }}
                                className="w-full px-4 py-2 text-right border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            style="primary"
                        >
                            {loading ? 'מתחבר...' : 'התחבר'}
                        </Button>
                    </form>
                </div>
            </div>
            
            {/* Footer */}
            <Footer />
        </div>
    );
}