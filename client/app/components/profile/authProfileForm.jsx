import { useState } from 'react';
import { Text, View } from 'react-native';
import Button from '../common/button.jsx';
import Input from '../common/textInput.jsx';

export default function AuthProfileForm({ authProfile, selectedProfile, onBack, loading, error }) {

    const [pin, setPin] = useState('');

    return (
        <View className="flex-1 justify-center items-center w-3/4">
            {error && <Text className="text-red-500">{error}</Text>}
            <Text>Auth Profile Form</Text>
            <Input
                placeholder="הזן את הקוד הסודי"
                value={pin}
                onChangeText={setPin}
                secureTextEntry
                maxLength={4}
            />
            <Button className='mb-4' style="primary" onPress={() => authProfile(selectedProfile.profileName, pin)}>
                כניסה
            </Button>
            <Button className='mb-4' style="secondary" onPress={onBack}>חזרה לבחירת פרופיל</Button>
        </View>
    );
}