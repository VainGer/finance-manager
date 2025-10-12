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
        <>
            <NavigationHeader leftButtons={navigationButtons} />
            <PageLayout className="pt-16">
                <AuthFormContainer 
                title="הרשמה למערכת" 
                subtitle="הצטרף לאלפי משתמשים המנהלים את הכספים שלהם בצורה חכמה"
            >
                {error && <ErrorAlert message={error} />}
                
                <form className='space-y-6' onSubmit={handleRegister}>
                    <div className="space-y-5">
                        <FormInput
                            label="שם משתמש"
                            type="text"
                            placeholder="בחר שם משתמש ייחודי"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        
                        <FormInput
                            label="סיסמא"
                            type="password"
                            placeholder="לפחות 6 תווים"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        
                        <FormInput
                            label="אימות סיסמא"
                            type="password"
                            placeholder="הזן שוב את הסיסמא"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password strength indicator */}
                    {password && (
                        <div className="space-y-2">
                            <div className="text-sm text-slate-600">חוזק סיסמא:</div>
                            <div className="flex gap-1">
                                <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                                    password.length >= 6 ? 'bg-green-400' : 'bg-gray-200'
                                }`}></div>
                                <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                                    password.length >= 8 ? 'bg-green-400' : 'bg-gray-200'
                                }`}></div>
                                <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                                    password.length >= 10 ? 'bg-green-400' : 'bg-gray-200'
                                }`}></div>
                            </div>
                        </div>
                    )}
                    
                    <Button
                        type="submit"
                        disabled={loading}
                        style="primary"
                        size="large"
                        className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-medium py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                יוצר חשבון...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                צור חשבון חדש
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </span>
                        )}
                    </Button>
                </form>
                
                {/* Benefits Section */}
                <div className="mt-8 p-6 bg-gradient-to-br from-blue-50/50 to-slate-50/30 rounded-2xl border border-blue-100/50">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">מה תקבל עם החשבון?</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-sm text-slate-700">ניהול תקציבים ללא הגבלה</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-sm text-slate-700">עיבוד AI אוטומטי לקבצים</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-sm text-slate-700">דוחות וגרפים מתקדמים</span>
                        </div>
                    </div>
                </div>

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
        </>
    );
}