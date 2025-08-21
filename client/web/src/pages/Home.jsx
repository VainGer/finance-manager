import Button from '../components/common/Button';
import Footer from '../components/common/Footer';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className='min-h-screen bg-gradient-to-b from-slate-50 to-gray-100' dir="rtl">
            {/* Navigation Header */}
            <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-800 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <span className="text-xl font-semibold text-slate-800">מנהל כספים</span>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={() => navigate('/login')}
                                style="outline"
                                size="small"
                                className="min-w-[80px] border-slate-400 text-slate-700 hover:bg-slate-100 hover:border-slate-500 transition-all duration-300"
                            >
                                התחברות
                            </Button>
                            <Button
                                onClick={() => navigate('/register')}
                                style="primary"
                                size="small"
                                className="min-w-[80px] bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                הרשמה
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
                {/* Background with overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10"></div>
                
                {/* Background pattern for texture */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-full h-full" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>

                {/* Main Hero Content */}
                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <div className="space-y-8">
                        {/* Main Headline */}
                        <div className="space-y-6">
                            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight">
                                להיות מקצועי
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                                    עם הכסף שלך
                                </span>
                            </h1>
                            <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                                פלטפורמה מתקדמת לניהול פיננסי חכם עם עיבוד LLM אוטומטי לחוויית משתמש מושלמת
                            </p>
                        </div>

                        {/* CTA Button */}
                        <div className="flex justify-center">
                            <Button
                                onClick={() => navigate('/register')}
                                style="primary"
                                size="large"
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold px-12 py-4 text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 border-0"
                            >
                                <span className="flex items-center gap-3">
                                    להתחיל ניסיון חינם
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Social Proof Notification */}
                <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/20 max-w-sm">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                        </div>
                        <div className="text-sm">
                            <div className="font-semibold text-slate-800">דני מתל אביב הצטרף עכשיו</div>
                            <div className="text-slate-600">חסך ₪2,400 בחודש הראשון</div>
                        </div>
                    </div>
                </div>

                {/* Trust Badge */}
                <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div className="text-sm">
                            <div className="font-semibold text-slate-800">מאובטח ברמה בנקאית</div>
                            <div className="text-slate-600">10,000+ משתמשים פעילים</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="text-center space-y-6 sm:space-y-8 mb-16">
                        <div className="space-y-4 sm:space-y-6">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-slate-600 to-slate-800 rounded-2xl mb-6 shadow-lg">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-light text-slate-800 tracking-tight">
                                תכונות <span className="font-semibold text-slate-900">מתקדמות</span>
                            </h2>
                            <p className="text-xl sm:text-2xl text-slate-600 font-light max-w-3xl mx-auto leading-relaxed">
                                גלה את הכלים המתקדמים שיעזרו לך לנהל את הכספים שלך בצורה חכמה ויעילה
                            </p>
                        </div>

                        {/* Features Preview Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                            <Button
                                onClick={() => navigate('/register')}
                                style="primary"
                                size="large"
                                className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-medium tracking-wide shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                התחל עכשיו
                            </Button>
                            <Button
                                onClick={() => navigate('/login')}
                                style="outline"
                                size="large"
                                className="border-slate-400 text-slate-700 hover:bg-slate-100 hover:border-slate-500 font-medium tracking-wide transition-all duration-300"
                            >
                                התחברות לחשבון
                            </Button>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 mb-16 shadow-lg">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-slate-800 mb-2">10,000+</div>
                                <div className="text-sm text-slate-600">משתמשים פעילים</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-slate-800 mb-2">₪50M+</div>
                                <div className="text-sm text-slate-600">תקציבים מנוהלים</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-slate-800 mb-2">500K+</div>
                                <div className="text-sm text-slate-600">עסקאות מעובדות</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-slate-800 mb-2">99.9%</div>
                                <div className="text-sm text-slate-600">זמינות מערכת</div>
                            </div>
                        </div>
                    </div>

                    {/* LLM Transaction Processing Section */}
                    <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl p-8 mb-16 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                        
                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center shadow-lg">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                            </svg>
                                        </div>
                                        <span className="px-4 py-2 bg-slate-600 rounded-full text-sm font-medium shadow-lg">
                                            חדש! עיבוד LLM חכם
                                        </span>
                                    </div>
                                    
                                    <h2 className="text-3xl font-bold mb-4">
                                        העלאת דוח הוצאות ועיבוד אוטומטי
                                    </h2>
                                    
                                    <p className="text-xl text-slate-200 mb-6 leading-relaxed">
                                        העלה קובץ דוח בנק והמערכת תעבד אוטומטית את כל העסקאות, תקטלג אותן ותסנכרן עם התקציבים שלך באמצעות טכנולוגיית LLM מתקדמת
                                    </p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-md">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-slate-200">זיהוי עסקים ממאגר קיים</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-slate-200">קיטלוג לקטגוריות</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-md">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-slate-200">סנכרון עם תקציבים</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center shadow-md">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-slate-200">עריכה ידנית לפני שמירה</span>
                                        </div>
                                    </div>
                                    
                                    <Button
                                        onClick={() => navigate('/register')}
                                        style="primary"
                                        size="large"
                                        className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                                    >
                                        נסה עיבוד קבצים
                                    </Button>
                                </div>
                                
                                <div className="flex-1 max-w-md">
                                    <div className="bg-slate-600/30 backdrop-blur-sm rounded-xl p-6 border border-slate-500/30 shadow-lg">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                                <span className="text-slate-200">מעבד LLM מוכן</span>
                                            </div>
                                            
                                            <div className="bg-slate-700/50 rounded-lg p-4 backdrop-blur-sm border border-slate-600/30">
                                                <div className="text-sm text-slate-300 mb-2">קובץ עובד:</div>
                                                <div className="text-white font-medium">דוח_בנק_ינואר_2025.csv</div>
                                                <div className="text-xs text-slate-400 mt-1">42 עסקאות זוהו</div>
                                            </div>
                                            
                                            <div className="bg-slate-700/50 rounded-lg p-4 backdrop-blur-sm border border-slate-600/30">
                                                <div className="text-sm text-slate-300 mb-2">קיטלוג אוטומטי:</div>
                                                <div className="text-white font-medium">רמי לוי → מזון ומשקאות</div>
                                                <div className="text-white font-medium">פז → תחבורה</div>
                                                <div className="text-xs text-slate-400 mt-1">דיוק: 89%</div>
                                            </div>
                                            
                                            <div className="bg-green-600/20 rounded-lg p-3 backdrop-blur-sm border border-green-500/30">
                                                <div className="text-sm text-green-200">
                                                    ✅ מוכן לסנכרון עם תקציבים
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 p-8 rounded-xl hover:shadow-xl transition-all duration-300 group">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-4">ניתוח נתונים מתקדם</h3>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                דוחות מפורטים וגרפיקה אינטראקטיבית לניתוח מגמות הוצאות ותחזיות תקציביות מדויקות
                            </p>
                            <ul className="text-sm text-slate-500 space-y-2">
                                <li>• גרפים אינטראקטיביים</li>
                                <li>• דוחות מותאמים אישית</li>
                                <li>• תחזיות AI</li>
                            </ul>
                        </div>
                        
                        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 p-8 rounded-xl hover:shadow-xl transition-all duration-300 group">
                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-4">בקרת תקציב חכמה</h3>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                ניהול תקציבים דינמי עם התרעות בזמן אמת ומעקב אחר יעדים פיננסיים לטווח קצר וארוך
                            </p>
                            <ul className="text-sm text-slate-500 space-y-2">
                                <li>• התרעות חכמות</li>
                                <li>• תקציבי קטגוריות</li>
                                <li>• מעקב יעדים</li>
                            </ul>
                        </div>
                        
                        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 p-8 rounded-xl hover:shadow-xl transition-all duration-300 group">
                            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-4">אבטחה ברמה בנקאית</h3>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                הצפנה מתקדמת ואבטחת מידע בסטנדרטים הגבוהים ביותר לשמירה על פרטיותך ובטחון נתוניך
                            </p>
                            <ul className="text-sm text-slate-500 space-y-2">
                                <li>• הצפנה 256-bit</li>
                                <li>• גיבוי אוטומטי</li>
                                <li>• אימות דו-שלבי</li>
                        </ul>
                    </div>
                </div>

                {/* Final CTA Section */}
                    <div className="text-center bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-12 text-white shadow-xl">
                        <h2 className="text-3xl font-semibold mb-4">מוכן להתחיל?</h2>
                        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                            הצטרף לאלפי משתמשים שכבר מנהלים את הכספים שלהם בצורה חכמה ומקצועית
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                            <Button
                                onClick={() => navigate('/register')}
                                style="primary"
                                size="large"
                                className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-slate-500 hover:border-slate-400"
                            >
                                התחל עכשיו - ללא עלות
                            </Button>
                            <Button
                                onClick={() => navigate('/login')}
                                style="outline"
                                size="large"
                                className="border-2 border-slate-400 text-slate-300 hover:bg-slate-700 hover:border-slate-300 hover:text-white font-medium transition-all duration-300"
                            >
                                יש לי חשבון
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}