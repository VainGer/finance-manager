import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Button from '../../../components/common/button';
import LoadingSpinner from '../../../components/common/loadingSpinner';
import OverlayMessages from '../../../components/common/overlayMessages';
import TextInput from '../../../components/common/textInput';
import { useAuth } from '../../../context/AuthContext';
import useProfileSettings from '../../../hooks/useProfileSettings';

export default function ChangeAccountPassword() {
    const { setProfile } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showOverlay, setShowOverlay] = useState(false);

    const { changeAccountPassword, errors, successes, resetMessages } = useProfileSettings({ setLoading, setProfile });

    const handleSave = async () => {
        resetMessages();
        const success = await changeAccountPassword(passwordForm);
        if (success) {
            setShowOverlay(true);
        } else {
            setShowOverlay(true);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    const handleCloseOverlay = () => {
        setShowOverlay(false);
        resetMessages();
        if (successes.length > 0) {
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            handleCancel();
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
            <View className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                {/* Header */}
                <View className="bg-slate-700 p-6">
                    <View className="flex-row items-center" style={{ gap: 12 }}>
                        <View className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <Ionicons name="key-outline" size={24} color="white" />
                        </View>
                        <View>
                            <Text className="text-xl font-bold text-white text-right">שינוי סיסמת חשבון</Text>
                            <Text className="text-white/80 text-sm text-right">עדכן את סיסמת הכניסה למערכת</Text>
                        </View>
                    </View>
                </View>

                {/* Content */}
                <View className="p-6">
                    <View style={{ gap: 24 }}>
                        {/* Current Password */}
                        <View style={{ gap: 8 }}>
                            <Text className="text-sm font-semibold text-slate-700 text-right">סיסמה נוכחית</Text>
                            <TextInput
                                placeholder="הזן את הסיסמה הנוכחית"
                                secureTextEntry
                                value={passwordForm.currentPassword}
                                onChangeText={(text) => setPasswordForm(prev => ({ ...prev, currentPassword: text }))}
                            />
                        </View>

                        {/* New Password */}
                        <View style={{ gap: 8 }}>
                            <Text className="text-sm font-semibold text-slate-700 text-right">סיסמה חדשה</Text>
                            <TextInput
                                placeholder="מינימום 6 תווים"
                                secureTextEntry
                                value={passwordForm.newPassword}
                                onChangeText={(text) => setPasswordForm(prev => ({ ...prev, newPassword: text }))}
                            />
                        </View>

                        {/* Confirm Password */}
                        <View style={{ gap: 8 }}>
                            <Text className="text-sm font-semibold text-slate-700 text-right">אישור סיסמה חדשה</Text>
                            <TextInput
                                placeholder="הזן שוב את הסיסמה החדשה"
                                secureTextEntry
                                value={passwordForm.confirmPassword}
                                onChangeText={(text) => setPasswordForm(prev => ({ ...prev, confirmPassword: text }))}
                            />
                        </View>

                        {/* Action Buttons */}
                        <View className="pt-6 border-t border-slate-200" style={{ gap: 12 }}>
                            <Button style="success" onPress={handleSave}>שמור סיסמה חדשה</Button>
                            <Button style="secondary" onPress={handleCancel}>ביטול</Button>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}