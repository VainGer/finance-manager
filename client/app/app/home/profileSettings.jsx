import { View, Text } from 'react-native';
import Button from '../../components/common/button';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProfileEdit from '../../components/profile/settings/profileEdit';
import CreateProfile from "../../components/profile/createProfile";

export default function ProfileSettings() {
    const [displayToRender, setDisplayToRender] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { profile } = useAuth();

    const renderDisplay = () => {
        switch (displayToRender) {
            case 'profile':
                return <ProfileEdit profile={profile} goBack={() => setDisplayToRender(null)} />
            case 'createProfile':
                return <CreateProfile username={profile.username} firstProfile={false} setOnCreateLoading={setLoading} goBack={() => setDisplayToRender(null)} />
            default:
                return null;
        }
    }

    useEffect(() => {
        renderDisplay();
    }, [displayToRender])

    return (
        <View>
            {!displayToRender &&
                <View>
                    <Button onPress={() => setDisplayToRender('profile')}>פרופיל</Button>
                    <Button>חשבון</Button>
                    <Button onPress={() => setDisplayToRender('createProfile')}>צור פרופיל חדש</Button>
                    <Button>הוספת תקציב לילד</Button>
                    <Button>אודות</Button>
                </View>
            }
            {displayToRender && <View className="h-full w-full flex justify-center items-center">{renderDisplay()}</View>}
        </View>
    );
}