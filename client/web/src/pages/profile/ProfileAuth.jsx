import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useAuthProfile from '../../hooks/auth/useAuthProfile';
import PageLayout from '../../components/layout/PageLayout';
import NavigationHeader from '../../components/layout/NavigationHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import ProfileList from '../../components/profile/ProfileList';
import AuthForm from '../../components/profile/AuthForm';
import CreateProfile from '../../components/profile/CreateProfile';

export default function ProfileAuth() {
    const navigate = useNavigate();
    const { account, setProfile, scheduleTokenRefresh, rememberProfile, setRememberProfile, setIsTokenReady, setIsExpiredToken, logout } = useAuth();

    const { profiles, loading, error, authProfile, fetchProfilesData } = useAuthProfile({
        account,
        setProfile,
        scheduleTokenRefresh,
        setRememberProfile,
        setIsTokenReady,
        setIsExpiredToken
    });

    const [selectedProfile, setSelectedProfile] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const navigationButtons = [
        {
            label: 'התנתק',
            path: '/',
            style: 'outline',
            className: 'border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 transition-all duration-300',
            onClick: () => {
                sessionStorage.clear();
                localStorage.clear();
                navigate('/');
            }
        }
    ];

    return (
        <>
            <NavigationHeader leftButtons={navigationButtons} />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 relative overflow-hidden py-12 pt-28">
                {/* Background circles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-blue-100/40 to-blue-200/25 rounded-full blur-2xl"></div>
                    <div className="absolute top-1/3 -left-32 w-64 h-64 bg-gradient-to-br from-slate-100/50 to-gray-200/30 rounded-full blur-xl"></div>
                    <div className="absolute -bottom-20 -right-16 w-56 h-56 bg-gradient-to-br from-cyan-100/35 to-blue-100/25 rounded-full blur-xl"></div>
                    <div className="absolute bottom-1/4 -left-12 w-48 h-48 bg-gradient-to-br from-slate-100/40 to-blue-100/20 rounded-full blur-lg animate-pulse"></div>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-8 animate-fadeIn">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl mb-4 shadow-xl">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">
                            ניהול פרופילים
                        </h1>
                        <p className="text-lg text-slate-600 max-w-xl mx-auto">
                            בחר פרופיל כדי להתחיל לנהל את הכספים שלך  
                        </p>
                    </div>

                    {successMessage && (
                        <div className="mb-6">
                            <Alert type="success" message={successMessage} />
                        </div>
                    )}

                    {loading ? (
                        <div className="flex flex-col justify-center items-center min-h-[400px] animate-fadeIn">
                            <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl shadow-slate-200/50 p-12 text-center">
                                <div className="relative mb-8">
                                    <div className="flex justify-center gap-2 mb-4">
                                        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
                                        <div className="w-4 h-4 bg-slate-500 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-4 h-4 bg-cyan-500 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                    <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-slate-500 to-cyan-500 rounded-full mx-auto animate-pulse"></div>
                                </div>
                                <h3 className="text-xl font-semibold text-slate-800 mb-2">טוען פרופילים...</h3>
                                <p className="text-slate-600">מחפש את הפרופילים שלך</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {profiles.length > 0 && !selectedProfile && (
                                <ProfileList
                                    profiles={profiles}
                                    onSelect={setSelectedProfile}
                                />
                            )}

                            {(!profiles || profiles.length === 0) && (
                                <CreateProfile
                                    username={account.username}
                                    firstProfile={true}
                                    onProfileCreated={fetchProfilesData}
                                />
                            )}

                            {selectedProfile && (
                                <AuthForm
                                    selectedProfile={selectedProfile}
                                    error={error}
                                    onSubmit={authProfile}
                                    onCancel={() => setSelectedProfile(null)}
                                    loading={loading}
                                    remember={rememberProfile}
                                    setRemember={setRememberProfile}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
