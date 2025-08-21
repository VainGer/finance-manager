import { useState } from "react";
import { post } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import PageLayout from "../../components/layout/PageLayout";
import NavigationHeader from "../../components/layout/NavigationHeader";
import AuthFormContainer from "../../components/layout/AuthFormContainer";
import FormInput from "../../components/common/FormInput";
import ErrorAlert from "../../components/common/ErrorAlert";
import SecurityBadge from "../../components/common/SecurityBadge";

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const navigationButtons = [
        {
            label: 'התחברות',
            path: '/login',
            style: 'primary',
            className: 'bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white shadow-md hover:shadow-lg transition-all duration-300'
        },
        {
            label: 'דף הבית',
            path: '/',
            style: 'outline',
            className: 'border-slate-400 text-slate-700 hover:bg-slate-100 hover:border-slate-500 transition-all duration-300'
        }
    ];

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
        <PageLayout>
            <NavigationHeader leftButtons={navigationButtons} />
            
            <AuthFormContainer 
                title="הרשמה למערכת" 
                subtitle="הצטרף לאלפי משתמשים המנהלים את הכספים שלהם בצורה חכמה"
            >
                {error && <ErrorAlert message={error} />}
                
                <form className='space-y-6' onSubmit={handleRegister}>
                    <FormInput
                        type="text"
                        placeholder="שם משתמש"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    
                    <FormInput
                        type="password"
                        placeholder="סיסמא"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    
                    <FormInput
                        type="password"
                        placeholder="אימות סיסמא"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    
                    <Button
                        type="submit"
                        disabled={loading}
                        style="primary"
                        className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-medium py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        {loading ? 'רושם...' : 'הירשם'}
                    </Button>
                </form>
                
                <div className="text-center text-sm text-slate-600 mt-6">
                    יש לך כבר חשבון?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        className="text-slate-700 hover:text-slate-800 font-medium underline transition-colors duration-200"
                    >
                        התחבר כאן
                    </button>
                </div>
                
                <SecurityBadge />
            </AuthFormContainer>
        </PageLayout>
    );
}