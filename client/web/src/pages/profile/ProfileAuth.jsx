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
        <PageLayout>
            <NavigationHeader leftButtons={navigationButtons} />

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">
                            ניהול פרופילים
                        </h1>
                        <p className="text-lg text-slate-600">
                            בחר פרופיל כדי להתחיל לנהל את הכספים שלך
                        </p>
                    </div>

                    {successMessage && (
                        <div className="mb-6">
                            <Alert type="success" message={successMessage} />
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center min-h-[400px]">
                            <LoadingSpinner />
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
        </PageLayout>
    );
}
