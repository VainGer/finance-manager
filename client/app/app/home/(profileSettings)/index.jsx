import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Button from '../../../components/common/button';
import LoadingSpinner from '../../../components/common/loadingSpinner';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';

export default function ProfileSettings() {
    const router = useRouter();
    const basePath = '/home/(profileSettings)';
    const { clearProfile, logout } = useAuth();

    const logOutProfile = () => {
        router.replace('/authProfile');
        setTimeout(() => {
            clearProfile();
        }, 1000);
    }

    const logOutAccount = () => {
        router.replace('/login');
        setTimeout(() => {
            logout();
        }, 1000);
    }

    return (
        <View className="flex-1 justify-center items-center">
            <View className="mt-4 w-3/4">
                <Button onPress={() => {
                    router.push(basePath + '/profileEdit')
                }}>עריכת פרופיל</Button>
                <Button onPress={() => {
                    router.push(basePath + '/changeAccountPassword')
                }}
                >שינוי סיסמת חשבון</Button>
                <Button onPress={() => {
                    router.push(basePath + '/createNewProfile')
                }}
                >צור פרופיל חדש</Button>
                <Button style="danger" onPress={() => {
                    router.push(basePath + '/deleteProfile')
                }}>מחק פרופיל</Button>
                <Button onPress={logOutProfile}>
                    התנתקות מהפרופיל
                </Button>
                <Button onPress={logOutAccount}>
                    התנתקות מהחשבון
                </Button>
            </View>
        </View>
    );
}