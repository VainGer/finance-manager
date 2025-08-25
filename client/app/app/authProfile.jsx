import { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, I18nManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import LoadingSpinner from '../components/common/loadingSpinner.jsx';
import ProfileList from '../components/profile/ProfileList.jsx';
import AuthProfileForm from '../components/profile/authProfileForm.jsx';
import useAuthProfile from '../hooks/auth/useAuthProfile.js';
import CreateProfile from '../components/profile/createProfile.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthProfile() {
    const { account, setProfile } = useAuth();
    const { profiles, loading, error, authProfile } = useAuthProfile({ account, setProfile });
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [onCreateLoading, setOnCreateLoading] = useState(false);
    const [pin, setPin] = useState('');
    const router = useRouter();
    const isRTL = I18nManager.isRTL;

    return (
        <LinearGradient
            colors={["#f8fafc", "#eef2f7", "#e5eaf1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            {/* אלמנטים דקורטיביים עדינים ברקע */}
            <View pointerEvents="none" className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-300/20" />
            <View pointerEvents="none" className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/20" />
            <View pointerEvents="none" className="absolute top-1/3 right-10 h-24 w-24 rounded-full bg-white/20 blur-md" />
            
            <SafeAreaView className="flex-1">
                {loading || onCreateLoading && <LoadingSpinner />}
                
                {/* כפתור חזרה */}
                <TouchableOpacity 
                    className="absolute top-4 left-4 z-10 p-2 rounded-full bg-white/70" 
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#0f172a" />
                </TouchableOpacity>

                <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
                    <View className="flex-1 items-center justify-center py-8">
                        {/* לוגו */}
                        <LinearGradient
                            colors={["#1e293b", "#334155"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="w-16 h-16 items-center justify-center mb-6 rounded-3xl"
                            style={{ 
                                shadowColor: "#0f172a", 
                                shadowOpacity: 0.3, 
                                shadowOffset: { width: 0, height: 4 }, 
                                shadowRadius: 10, 
                                elevation: 8 
                            }}
                        >
                            <Ionicons name="people-outline" size={26} color="#ffffff" />
                        </LinearGradient>

                        {/* כותרות */}
                        <Text 
                            className="text-3xl font-extrabold text-slate-900 text-center mb-1"
                            style={{ writingDirection: isRTL ? "rtl" : "ltr" }}
                        >
                            פרופילים
                        </Text>
                        <Text 
                            className="text-slate-600 text-center mb-6"
                            style={{ writingDirection: isRTL ? "rtl" : "ltr" }}
                        >
                            {profiles.length > 0 
                                ? "בחר פרופיל כדי להמשיך" 
                                : "צור פרופיל חדש כדי להתחיל"}
                        </Text>

                        {/* תוכן */}
                        <BlurView intensity={24} tint="light" className="w-full rounded-3xl overflow-hidden">
                            <View className="bg-white/70 border border-white/40 p-5">
                                {/* רשימת פרופילים */}
                                {profiles.length > 0 && !selectedProfile && (
                                    <View className="w-full items-center justify-center">
                                        <ProfileList profiles={profiles} onSelect={setSelectedProfile} />
                                    </View>
                                )}
                                
                                {/* טופס אימות פרופיל */}
                                {selectedProfile && (
                                    <AuthProfileForm 
                                        loading={loading} 
                                        error={error} 
                                        authProfile={authProfile}
                                        selectedProfile={selectedProfile} 
                                        onBack={() => setSelectedProfile(null)} 
                                    />
                                )}
                                
                                {/* יצירת פרופיל חדש */}
                                {profiles.length === 0 && !loading && !error && (
                                    <CreateProfile 
                                        firstProfile={true} 
                                        username={account.username} 
                                        setOnCreateLoading={setOnCreateLoading} 
                                    />
                                )}
                            </View>
                        </BlurView>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}
