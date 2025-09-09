import { View, Text } from 'react-native';
import Button from '../../components/common/button';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProfileEdit from '../../components/profile/settings/profileEdit';
import CreateProfile from "../../components/profile/createProfile";
import LoadingSpinner from '../../components/common/loadingSpinner';

export default function ProfileSettings() {
    const [displayToRender, setDisplayToRender] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { profile, setProfile } = useAuth();

    const renderDisplay = () => {
        switch (displayToRender) {
            case 'profile':
                return <ProfileEdit
                    profile={profile} setLoading={setLoading}
                    goBack={() => setDisplayToRender(null)} />
            case 'createProfile':
                return <CreateProfile
                    username={profile.username} firstProfile={false} s
                    etOnCreateLoading={setLoading} goBack={() => setDisplayToRender(null)} />
            default:
                return null;
        }
    }

    useEffect(() => {
        renderDisplay();
    }, [displayToRender])

    if (loading) return (<LoadingSpinner />)

    return (
        <View className="flex-1 justify-center items-center">
            {!displayToRender && (
                <View className="mt-4 w-3/4">
                    <Button onPress={() => setDisplayToRender('profile')}>פרופיל</Button>
                    <Button>חשבון</Button>
                    <Button onPress={() => setDisplayToRender('createProfile')}>צור פרופיל חדש</Button>
                    <Button>הוספת תקציב לילד</Button>
                    <Button>אודות</Button>
                    <Button style="danger">מחק פרופיל</Button>
                </View>
            )}
            {displayToRender && <View className="h-full w-full flex justify-center items-center">{renderDisplay()}</View>}
        </View>
    );
}