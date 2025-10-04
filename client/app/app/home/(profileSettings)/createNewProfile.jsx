import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import LoadingSpinner from '../../../components/common/loadingSpinner';
import CreateProfile from '../../../components/profile/createProfile';
import { useAuth } from '../../../context/AuthContext';

export default function CreateNewProfile() {
    const router = useRouter();
    const { account } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleGoBack = () => {
        router.back();
    };

    return (
        <LinearGradient
            colors={["#f8fafc", "#eef2f7", "#e5eaf1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            <View pointerEvents="none" className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-300/20" />
            <View pointerEvents="none" className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/20" />
            <View pointerEvents="none" className="absolute top-1/3 right-10 h-24 w-24 rounded-full bg-white/20 blur-md" />
            {/* אלמנטים דקורטיביים עדינים ברקע */}
            <View pointerEvents="none" className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-300/20" />
            <View pointerEvents="none" className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/20" />
            <View pointerEvents="none" className="absolute top-1/3 right-10 h-24 w-24 rounded-full bg-white/20 blur-md" />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1 w-full"
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    className="flex-1 w-full"
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 items-center justify-center p-4">
                        {loading && <LoadingSpinner />}

                        <BlurView intensity={24} tint="light" className="w-full rounded-3xl overflow-hidden" style={{ maxWidth: 450 }}>
                            <View className="bg-white/70 border border-white/40 p-5 items-center">
                                <CreateProfile
                                    username={account.username}
                                    firstProfile={false}
                                    setOnCreateLoading={setLoading}
                                    goBack={handleGoBack}
                                />
                            </View>
                        </BlurView>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}