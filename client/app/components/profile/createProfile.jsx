import { useEffect, useState } from 'react';
import { Modal, Switch, Text, View } from 'react-native';
import WheelColorPicker from 'react-native-wheel-color-picker';
import useCreateProfile from '../../hooks/auth/useCreateProfile.js';
import { pickImage } from '../../utils/imageProcessing.js';
import Button from '../common/button.jsx';
import Input from '../common/textInput.jsx';
import ColorPicker from '../common/colorPicker.jsx';

export default function CreateProfile({ username, firstProfile, setOnCreateLoading, goBack }) {
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

    useEffect(() => {
        if (color) {
            setOpenColorWheel(false);
        }
    }, [color])

    const pickAvatar = async () => {
        const image = await pickImage(setError);
        if (image) {
            setAvatar(image);
        }
    };

    return (
        <View className="flex-1 justify-center items-center p-4 w-3/4">
            <Text className="text-2xl font-bold mb-4">יצירת פרופיל חדש</Text>
            <Input
                className="w-1/2"
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
            <Button onPress={pickAvatar} >{avatar ? avatar.name : "הוסף תמונת פרופיל"}</Button>
            <Button
                onPress={() => setOpenColorWheel(true)}
                bg={color}
            >
                בחר צבע פרופיל
            </Button>
            <Modal visible={openColorWheel} transparent={true} animationType="fade">
                <View className="flex-1 justify-center items-center bg-black/50 h-max">
                    <View className="bg-white p-4 rounded-lg w-5/6 h-2/3 m-4">
                        <ColorPicker setColor={setColor} />
                    </View>
                </View>
            </Modal>
            {!firstProfile &&
                <View className="flex-row items-center my-2">
                    <Switch value={parentProfile} onValueChange={setParentProfile} />
                    <Text className="ml-2">פרופיל הורה</Text>
                </View>}
            <Button className='w-1/2' onPress={createProfile} >צור פרופיל</Button>
            <Button className='w-1/2' onPress={goBack} >ביטול</Button>
            {error && <Text className="text-red-500">{error}</Text>}
        </View>)
}