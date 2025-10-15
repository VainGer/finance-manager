import { useNavigate } from "react-router-dom";

export default function AdminHome() {
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center rtl relative overflow-hidden">
            {/* Background Effects - matching the login style */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full filter blur-xl animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full filter blur-xl animate-pulse animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-slate-400/10 rounded-full filter blur-xl animate-pulse animation-delay-4000"></div>
            </div>

            {/* Background pattern for texture */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-12">
                {/* Header Section */}
                <div className="text-center mb-16">
                    {/* Logo/Icon */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-gradient-to-r from-slate-600 to-slate-800 p-6 rounded-3xl shadow-2xl">
                            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M12 7C13.4 7 14.8 8.6 14.8 10V11.5C15.4 11.5 16 12.1 16 12.7V16.2C16 16.8 15.4 17.3 14.8 17.3H9.2C8.6 17.3 8 16.8 8 16.2V12.7C8 12.1 8.6 11.5 9.2 11.5V10C9.2 8.6 10.6 7 12 7M12 8.2C11.2 8.2 10.5 8.7 10.5 10V11.5H13.5V10C13.5 8.7 12.8 8.2 12 8.2Z"/>
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        מערכת ניהול
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                            Smart Finance
                        </span>
                    </h1>

                    <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        פאנל ניהול מתקדם למערכת ניהול פיננסי חכמת עם כלי בקרה ומעקב מקצועיים
                    </p>
                </div>

                {/* Action Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    {/* Login Card */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 transform transition-all duration-300 hover:scale-105 hover:shadow-3xl group">
                        <div className="text-center space-y-6">
                            {/* Login Icon */}
                            <div className="flex justify-center">
                                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-3">
                                    התחברות למערכת
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    התחבר עם פרטי המנהל הקיימים שלך ותגש לפאנל הניהול המלא
                                </p>
                            </div>

                            <button
                                onClick={() => navigate("/admin/login")}
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:from-green-500 hover:to-emerald-500 transform transition-all duration-300 hover:scale-[1.02] active:scale-95 group"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M10 17l5-5-5-5v10z"/>
                                    </svg>
                                    התחבר עכשיו
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Register Card */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 transform transition-all duration-300 hover:scale-105 hover:shadow-3xl group">
                        <div className="text-center space-y-6">
                            {/* Register Icon */}
                            <div className="flex justify-center">
                                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-3">
                                    הרשמה חדשה
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    צור חשבון מנהל חדש והגדר את ההרשאות והגישה למערכת
                                </p>
                            </div>

                            <button
                                onClick={() => navigate("/admin/register")}
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:from-blue-500 hover:to-cyan-500 transform transition-all duration-300 hover:scale-[1.02] active:scale-95"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    הרשם כמנהל
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="text-center mt-20 mb-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto border border-white/20">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-white font-medium">מערכת פעילה ומאובטחת</span>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            גישה מאובטחת לפאנל ניהול המערכת עם הצפנה ברמה בנקאית ומעקב פעילות מלא
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
