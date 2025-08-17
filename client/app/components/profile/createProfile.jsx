import * as DocumentPicker from 'expo-document-picker';
import { useEffect, useState } from 'react';
import { Modal, Switch, Text, View } from 'react-native';
import WheelColorPicker from 'react-native-wheel-color-picker';
import useCreateProfile from '../../hooks/auth/useCreateProfile.js';
import Button from '../common/button.jsx';
import Input from '../common/textInput.jsx';
import LoadingSpinner from '../common/loadingSpinner.jsx';

export default function CreateProfile({ username, firstProfile, setOnCreateLoading }) {
    const [profileName, setProfileName] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [color, setColor] = useState('#000000');
    const [openColorWheel, setOpenColorWheel] = useState(false);
    const [pin, setPin] = useState('');
    const [parentProfile, setParentProfile] = useState(false);
    const { loading, error, createProfile, setError } = useCreateProfile({ username, profileName, pin, avatar, color, firstProfile });

    useEffect(() => {
        setOnCreateLoading(loading);
    }, [loading]);

    const pickAvatar = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'image/*',
                copyToCacheDirectory: true,
            });
            if (result.assets && result.assets.length > 0) {
                setAvatar(result.assets[0]);
            } else if (result.type === 'success') {
                setAvatar(result);
            } else {
                console.log('User cancelled document picker');
            }
        } catch (err) {
            console.error('Error picking document:', err);
            setError('שגיאה בטעינת התמונה');
        }
    };

    return (
        <View className="flex-1 justify-center items-center p-4 w-3/4">
            <Text className="text-2xl font-bold mb-4">Create Profile</Text>
            <Input
                label="Profile Name"
                value={profileName}
                onChangeText={setProfileName}
                placeholder="הכנס שם פרופיל"
            />
            <Input
                label="PIN"
                value={pin}
                onChangeText={setPin}
                placeholder="הכנס קוד סודי (4 תווים)"
                secureTextEntry
            />
            <Button onPress={pickAvatar} >הוסף תמונת פרופיל</Button>
            <Button
                onPress={() => setOpenColorWheel(true)}
                bg={color}
            >
                בחר צבע פרופיל
            </Button>
            <Modal visible={openColorWheel} transparent={true} animationType="fade">
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white p-4 rounded-lg w-5/6 h-2/3 m-4">
                        <WheelColorPicker
                            color={color}
                            onColorChange={c => setColor(c)}
                            thumbSize={40}
                            sliderSize={40}
                        />
                        <Button
                            className="mt-4"
                            onPress={() => setOpenColorWheel(false)}
                        >
                            בחר צבע
                        </Button>
                    </View>
                </View>
            </Modal>
            {!firstProfile &&
                <View className="flex-row items-center">
                    <Switch value={parentProfile} onValueChange={setParentProfile} /> <Text>פרופיל הורה</Text>
                </View>}
            <Button className='w-1/2' onPress={createProfile} >צור פרופיל</Button>
            {error && <Text className="text-red-500">{error}</Text>}
        </View>)
}