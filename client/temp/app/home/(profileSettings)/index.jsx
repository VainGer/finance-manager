import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Button from '../../../components/common/button';
import LoadingSpinner from '../../../components/common/loadingSpinner';
import { useRouter } from 'expo-router';

export default function ProfileSettings() {
    const router = useRouter();
    const basePath = '/home/(profileSettings)';
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
            </View>
        </View>
    );
}