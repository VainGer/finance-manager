import { Ionicons } from "@expo/vector-icons";
import { useState } from 'react';
import { I18nManager, Switch, Text, View } from 'react-native';
import Button from '../common/button.jsx';
import Input from '../common/textInput.jsx';

export default function AuthProfileForm({ authProfile, selectedProfile, onBack,
    loading, error, setStoreProfile, storeProfile }) {
    const [pin, setPin] = useState('');
    const isRTL = I18nManager.isRTL;

    return (
        <View className="w-full">
            <View className="mb-6">
                <View className="flex-row items-center justify-between mb-4">
                    <Ionicons name="lock-closed" size={22} color={selectedProfile.color || '#1e293b'} />
                    <Text
                        className="text-xl font-bold text-slate-800"
                        style={{ writingDirection: isRTL ? "rtl" : "ltr" }}
                    >
                        {selectedProfile.profileName}
                    </Text>
                </View>

                {error && (
                    <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                        <Text
                            className="text-red-600 text-sm text-right"
                            style={{ writingDirection: isRTL ? "rtl" : "ltr" }}
                        >
                            {error}
                        </Text>
                    </View>
                )}

                <Text
                    className="text-slate-700 mb-2 font-medium text-right"
                    style={{ writingDirection: isRTL ? "rtl" : "ltr" }}
                >
                    הקוד הסודי שלך
                </Text>

                <Input
                    placeholder="הזן קוד סודי"
                    value={pin}
                    onChangeText={setPin}
                    secureTextEntry
                    keyboardType="numeric"
                />
                <View className="flex-row items-center justify-between mt-3">
                    <Text
                        className="text-slate-700 font-medium"
                        style={{ writingDirection: isRTL ? "rtl" : "ltr" }}
                    >
                        זכור אותי
                    </Text>
                    <Switch
                        value={storeProfile}
                        onValueChange={setStoreProfile}
                        thumbColor="#ffffff"
                        trackColor={{ false: "#ccc", true: "#4ade80" }}
                    />
                </View>
            </View>

            <Button
                onPress={() => authProfile(selectedProfile.profileName, pin, storeProfile)}
                disabled={loading}
            >
                כניסה לפרופיל
            </Button>

            <Button
                style="secondary"
                onPress={onBack}
                className="mt-3"
            >
                חזרה לבחירת פרופיל
            </Button>
        </View>
    );
}