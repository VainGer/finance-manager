import { useState } from "react";
import { post } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Footer from "../../components/common/Footer";

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        const clearFields = () => {
            setUsername('');
            setPassword('');
            setConfirmPassword('');
        }
        const showError = (message) => {
            setError(message);
            clearFields();
        }
        if (!username || !password || !confirmPassword || username.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
            showError('אנא מלא את כל השדות');
            return;
        } else if (password !== confirmPassword) {
            showError('הסיסמאות אינן תואמות');
            return;
        } else if (password.length < 6) {
            showError('הסיסמא חייבת להכיל לפחות 6 תווים');
            return;
        }

        setLoading(true);
        const response = await post('account/register', { username, password });
        if (response.ok) {
            navigate('/login');
        } else if (response.status === 500) {
            showError('תקלה בשרת, אנא נסה שוב מאוחר יותר');
        } else {
            setLoading(false);
            showError('שם משתמש כבר קיים');
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-center text-gray-900">הרשמה</h1>
                    {error && <p className="text-sm text-center text-red-600 bg-red-100 border border-red-400 rounded-md py-2 px-4">{error}</p>}
                    <form className='space-y-6' onSubmit={handleRegister}>
                        <div>
                            <input
                                type="text"
                                placeholder="שם משתמש"
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 text-right border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="סיסמא"
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 text-right border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="אימות סיסמא"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 text-right border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            style="primary"
                        >
                            {loading ? 'רושם...' : 'הירשם'}
                        </Button>
                    </form>
                </div>
            </div>
            
            {/* Footer */}
            <Footer />
        </div>
    );
}