import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { post } from '../../utils/api';
import Button from '../../components/common/Button';
import PageLayout from '../../components/layout/PageLayout';
import NavigationHeader from '../../components/layout/NavigationHeader';
import AuthFormContainer from '../../components/layout/AuthFormContainer';
import FormInput from '../../components/common/FormInput';
import ErrorAlert from '../../components/common/ErrorAlert';
import SecurityBadge from '../../components/common/SecurityBadge';

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

    const navigationButtons = [
        {
            label: 'דף הבית',
            path: '/',
            style: 'outline',
            className: 'border-slate-400 text-slate-700 hover:bg-slate-100 hover:border-slate-500 transition-all duration-300'
        },
        {
            label: 'הרשמה',
            path: '/register',
            style: 'primary',
            className: 'bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white shadow-md hover:shadow-lg transition-all duration-300'
        }
    ];

    return (
        <PageLayout>
            <NavigationHeader leftButtons={navigationButtons} />
            
            <AuthFormContainer 
                title="התחברות לחשבון"
                subtitle="ברוך הבא חזרה למנהל הכספים שלך"
            >
                <ErrorAlert message={error} />

                <form className="space-y-6" onSubmit={handleLogin}>
                    <FormInput
                        label="שם משתמש"
                        placeholder="הזן את שם המשתמש שלך"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            if (error) setError('');
                        }}
                        required
                    />
                    
                    <FormInput
                        label="סיסמא"
                        type="password"
                        placeholder="הזן את הסיסמא שלך"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (error) setError('');
                        }}
                        required
                    />

                    <Button
                        type="submit"
                        disabled={loading}
                        style="primary"
                        size="large"
                        className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-medium py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                מתחבר...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                התחבר לחשבון
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        )}
                    </Button>
                </form>

                {/* Register Link */}
                <div className="mt-6 text-center">
                    <p className="text-slate-600 text-sm">
                        עדיין אין לך חשבון?{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="text-slate-700 font-medium hover:text-slate-900 transition-colors duration-300"
                        >
                            הירשם עכשיו
                        </button>
                    </p>
                </div>
            </AuthFormContainer>

            <SecurityBadge />
        </PageLayout>
    );
}