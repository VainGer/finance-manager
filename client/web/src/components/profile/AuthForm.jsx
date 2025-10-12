import Button from '../common/Button';
import FormInput from '../common/FormInput';
import ErrorAlert from '../common/ErrorAlert';
import SecurityBadge from '../common/SecurityBadge';
import { useState } from 'react';

export default function AuthForm({
    selectedProfile,
    error,
    onSubmit,
    onCancel,
    loading,
    remember,
    setRemember
}) {
    const [pinInput, setPinInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(selectedProfile.profileName, pinInput, remember);
    };

    return (
        <div className="flex justify-center animate-slideUp">
            <div className="w-full max-w-sm">
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-6 relative overflow-hidden">
                    {/* Decorative background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>
                    
                    {/* Enhanced Profile Header */}
                    <div className="text-center mb-6 relative z-10">
                        {/* Profile Avatar with colors */}
                        <div className="relative inline-block mb-3">
                            <div 
                                className="w-16 h-16 rounded-xl flex items-center justify-center shadow-xl border-3 border-white relative overflow-hidden"
                                style={{ backgroundColor: selectedProfile.color || '#1e293b' }}
                            >
                                {selectedProfile.avatar ? (
                                    <img 
                                        src={selectedProfile.avatar} 
                                        alt={`${selectedProfile.profileName}'s avatar`} 
                                        className="w-full h-full rounded-lg object-cover" 
                                    />
                                ) : (
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">
                            {selectedProfile.profileName}
                        </h1>
                        <p className="text-sm text-slate-600 flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            הזן קוד סודי להמשך
                        </p>
                    </div>

                    {error && <ErrorAlert message={error} className="mb-6" />}

                    <form className='space-y-5 relative z-10' onSubmit={handleSubmit}>
                        {/* Enhanced PIN Input */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-slate-700 text-center">
                                קוד סודי (4 ספרות)
                            </label>
                            <div className="flex justify-center">
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={pinInput}
                                        onChange={(e) => setPinInput(e.target.value)}
                                        maxLength="4"
                                        className="w-36 h-14 text-center text-2xl tracking-[1rem] font-mono bg-slate-50/70 border-2 border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 rounded-xl outline-none transition-all placeholder:text-slate-400"
                                        placeholder="••••"
                                        style={{
                                            textAlign: 'center',
                                            direction: 'ltr',
                                            paddingLeft: '0.5rem'
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Compact Remember me checkbox */}
                        <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-200/50">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="rememberProfile"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                    className="w-4 h-4 accent-slate-700 rounded"
                                />
                                <label htmlFor="rememberProfile" className="text-sm text-slate-700 flex-1 cursor-pointer">
                                    זכור פרופיל זה במכשיר זה
                                </label>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 mr-7">
                                בפעם הבאה תוכל להיכנס ישירות ללא קוד
                            </p>
                        </div>

                        <div className="flex gap-3 pt-1">
                            <Button
                                type="button"
                                onClick={onCancel}
                                style="outline"
                                className="flex-1 border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 py-2 text-sm"
                            >
                                <span className="flex items-center justify-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    חזרה
                                </span>
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading || pinInput.length !== 4}
                                style="primary"
                                className="flex-1 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed py-2 text-sm"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-1">
                                        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        מאמת...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-1">
                                        כניסה
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>

                    <SecurityBadge className="mt-8 relative z-10" />
                </div>
            </div>
        </div>
    );
}
