import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthAdmin from "../../hooks/admin/useAuthAdmin";

export default function AdminRegister() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [secret, setSecret] = useState("");
    const { register, loading, error, success } = useAuthAdmin();

    const handleRegister = async (e) => {
        e.preventDefault();
        const registerResult = await register(username, password, secret);
        if (registerResult) {
            navigate("/admin/login");
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rtl relative overflow-hidden">
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
            
            <div className="relative z-10 bg-white/95 backdrop-blur-sm border border-white/20 p-10 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:shadow-3xl py-12">
                {/* Admin Icon */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gradient-to-r from-slate-600 to-slate-800 p-4 rounded-2xl shadow-lg">
                        <svg 
                            className="w-12 h-12 text-white" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-center mb-8 text-slate-800">
                    הרשמת מנהל
                </h1>

                {error && (
                    <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded-xl mb-6 text-sm animate-shake">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            {error}
                        </div>
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-200 text-green-700 p-3 rounded-xl mb-6 text-sm">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            {success}
                        </div>
                    </div>
                )}

                <form onSubmit={handleRegister} className="flex flex-col gap-6">
                    {/* Username Input */}
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="שם משתמש"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 pr-12 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="relative group">
                        <input
                            type="password"
                            placeholder="סיסמה"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 pr-12 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                            </svg>
                        </div>
                    </div>

                    {/* Secret Input */}
                    <div className="relative group">
                        <input
                            type="password"
                            placeholder="סיסמת מנהל סודית"
                            value={secret}
                            onChange={(e) => setSecret(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 pr-12 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z"/>
                            </svg>
                        </div>
                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`relative bg-gradient-to-r from-slate-700 to-slate-800 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:from-slate-600 hover:to-slate-700 transform transition-all duration-300 ${
                            loading ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.02] active:scale-95"
                        } overflow-hidden group`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-center gap-2">
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    נרשם...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    הירשם
                                </>
                            )}
                        </div>
                    </button>
                </form>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-slate-600 text-sm font-light">
                        Smart Finance - מערכת ניהול פיננסי מתקדמת
                    </p>
                    <p className="text-slate-500 text-xs mt-1">
                        גרסת מנהל מערכת
                    </p>
                </div>
            </div>
        </div>
    );
}
