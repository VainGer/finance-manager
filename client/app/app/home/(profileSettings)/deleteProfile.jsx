import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import Button from '../../../components/common/button';
import LoadingSpinner from '../../../components/common/loadingSpinner';
import OverlayMessages from '../../../components/common/overlayMessages';
import { useAuth } from '../../../context/AuthContext';
import useProfileSettings from '../../../hooks/useProfileSettings';
import Index from '../../index'
export default function DeleteProfile() {
    const { profile, setProfile } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [pin, setPin] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);

    const { deleteProfile, errors, successes, resetMessages } = useProfileSettings({ setLoading, setProfile });

    const handleConfirm = async () => {
        resetMessages();
        const success = await deleteProfile(pin);
        if (success) {
            setShowOverlay(true);
        } else {
            setShowOverlay(true);
        }
    };

    const handleCloseOverlay = () => {
        setShowOverlay(false);
        resetMessages();
        if (successes.length > 0 && successes[0].includes("נמחק בהצלחה")) {
            router.replace('/');
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (showOverlay) {
        return (
            <OverlayMessages
                errors={errors}
                successes={successes}
                onClose={handleCloseOverlay}
            />
        );
    }

    return (
        <ScrollView className="flex-1 bg-slate-50 p-4">
            <View className="bg-white rounded-2xl border border-red-200 shadow-lg overflow-hidden">
                {/* Header */}
                <View className="bg-red-600 p-6">
                    <View className="flex-row items-center" style={{ gap: 12 }}>
                        <View className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <Ionicons name="warning" size={24} color="white" />
                        </View>
                        <Text className="text-xl font-bold text-white">מחיקת פרופיל</Text>
                    </View>
                </View>

                {/* Content */}
                <View className="p-6">
                    {!showConfirm ? (
                        <View style={{ gap: 24 }}>
                            {/* Warning Section */}
                            <View className="bg-red-50 rounded-xl p-6 border border-red-200">
                                <View className="flex-row items-start" style={{ gap: 16 }}>
                                    <View className="w-10 h-10 bg-red-100 rounded-lg items-center justify-center flex-shrink-0">
                                        <Ionicons name="alert-circle-outline" size={28} color="#DC2626" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-lg font-bold text-red-800 mb-2 text-right">אזהרה חמורה</Text>
                                        <View className="space-y-2">
                                            <Text className="text-red-700 text-right">מחיקת הפרופיל תמחק לצמיתות את כל הנתונים הבאים:</Text>
                                            <View className="pr-4 space-y-1">
                                                <Text className="text-sm text-red-700 text-right">• כל ההוצאות והעסקאות</Text>
                                                <Text className="text-sm text-red-700 text-right">• קטגוריות מותאמות אישית</Text>
                                                <Text className="text-sm text-red-700 text-right">• היסטוריית תקציבים</Text>
                                                <Text className="text-sm text-red-700 text-right">• הגדרות פרופיל אישיות</Text>
                                            </View>
                                            <Text className="font-bold text-red-800 mt-3 text-right">
                                                ⚠️ פעולה זו אינה ניתנת לביטול!
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Action Button */}
                            <View className="pt-4 items-center">
                                <Button style="danger" onPress={() => setShowConfirm(true)}>
                                    <View className="flex-row items-center" style={{ gap: 8 }}>
                                        <Ionicons name="trash-outline" size={20} color="white" />
                                        <Text className="text-white font-bold">המשך למחיקת פרופיל</Text>
                                    </View>
                                </Button>
                            </View>
                        </View>
                    ) : (
                        <View style={{ gap: 24 }}>
                            {/* Critical Warning */}
                            <View className="bg-red-50 rounded-xl p-6 border-2 border-red-300">
                                <View className="text-center items-center">
                                    <View className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Ionicons name="warning" size={32} color="#DC2626" />
                                    </View>
                                    <Text className="text-xl font-bold text-red-800 mb-2">אישור מחיקה סופי</Text>
                                    <Text className="text-red-700 text-lg font-semibold mb-1">
                                        אתה עומד למחוק את הפרופיל "{profile.profileName}"
                                    </Text>
                                    <Text className="text-red-600 text-sm">
                                        כל הנתונים יימחקו לצמיתות ולא ניתן יהיה לשחזר אותם!
                                    </Text>
                                </View>
                            </View>

                            {/* PIN Input */}
                            <View style={{ gap: 8 }}>
                                <Text className="text-sm font-semibold text-slate-700 text-right">הזן את קוד הפרופיל לאישור המחיקה</Text>
                                <TextInput
                                    className="w-full p-4 text-center text-2xl border-2 border-red-300 rounded-xl bg-white shadow-sm"
                                    placeholder="●●●●"
                                    value={pin}
                                    onChangeText={setPin}
                                    maxLength={4}
                                    keyboardType="number-pad"
                                    secureTextEntry
                                />
                            </View>

                            {/* Action Buttons */}
                            <View className="pt-6 border-t border-red-200" style={{ gap: 12 }}>
                                <Button style="danger" onPress={handleConfirm} disabled={pin.length !== 4}>אשר מחיקה סופית</Button>
                                <Button style="secondary" onPress={() => setShowConfirm(false)}>ביטול המחיקה</Button>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}