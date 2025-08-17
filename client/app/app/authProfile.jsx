import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingSpinner from '../components/common/loadingSpinner.jsx';
import ProfileList from '../components/profile/ProfileList.jsx';
import AuthProfileForm from '../components/profile/authProfileForm.jsx';
import useAuthProfile from '../hooks/auth/useAuthProfile.js';
import CreateProfile from '../components/profile/createProfile.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthProfile() {
    const { account, setProfile } = useAuth();
    const { profiles, loading, error, authProfile } = useAuthProfile({ account, setProfile });
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [onCreateLoading, setOnCreateLoading] = useState(false);
    const [pin, setPin] = useState('');

    return (
        <SafeAreaView className="bg-white dark:bg-black h-full">
            {loading || onCreateLoading && <LoadingSpinner />}
            <View className="flex-1 justify-center items-center bg-white">
                {profiles.length > 0 && !selectedProfile && (
                    <View className="w-full items-center justify-center">
                        <ProfileList profiles={profiles} onSelect={setSelectedProfile} />
                    </View>
                )}
                {selectedProfile && (
                    <AuthProfileForm loading={loading} error={error} authProfile={authProfile}
                        selectedProfile={selectedProfile} onBack={() => setSelectedProfile(null)} />
                )}
                {profiles.length === 0 && !loading && !error && (
                    <CreateProfile firstProfile={true} username={account.username} setOnCreateLoading={setOnCreateLoading} />
                )}
            </View>
        </SafeAreaView>
    );
}
