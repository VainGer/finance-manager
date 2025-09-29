import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useState } from 'react';
import Button from '../../../components/common/button';
import useProfileSettings from '../../../hooks/useProfileSettings';
import LoadingSpinner from '../../../components/common/loadingSpinner';

export default function ProfileSettings() {
    const router = useRouter();
    const basePath = '/home/(profileSettings)';
    const [loading, setLoading] = useState(false);
    const { handleLogout, handleClearProfile } = useProfileSettings({ setLoading });

    const textClass = "text-slate-800 font-bold mx-4";

    if (loading) {
        return <LoadingSpinner />;
    }
    return (
        <LinearGradient
            colors={["#f8fafc", "#eef2f7", "#e5eaf1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-1 items-center justify-center py-10 px-6">
                    {/* Title */}
                    <View className="items-center mb-10">
                        <Text className="text-2xl font-bold text-slate-800">הגדרות פרופיל</Text>
                        <View className="h-1 w-12 bg-blue-500 rounded-full mt-2" />
                    </View>

                    {/* Profile icon */}
                    <View className="items-center mb-8">
                        <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-2">
                            <Ionicons name="person-circle-outline" size={36} color="#3b82f6" />
                        </View>
                    </View>

                    {/* Menu options */}
                    <View className="w-full max-w-sm">
                        <Button
                            className="mb-4 py-4 bg-white border border-slate-200 rounded-xl shadow-sm"
                            textClass="text-slate-800 font-bold"
                            onPress={() => router.push(basePath + '/profileEdit')}
                        >
                            <View className="flex-row items-center justify-center">
                                <Ionicons name="create-outline" size={20} color="#3b82f6" className="ml-2" />
                                <Text className={textClass}>עריכת פרופיל</Text>
                            </View>
                        </Button>

                        <Button
                            className="mb-4 py-4 bg-white border border-slate-200 rounded-xl shadow-sm"
                            textClass="text-slate-800 font-bold"
                            onPress={() => router.push(basePath + '/changeAccountPassword')}
                        >
                            <View className="flex-row items-center justify-center">
                                <Ionicons name="key-outline" size={20} color="#3b82f6" className="ml-2" />
                                <Text className={textClass}>שינוי סיסמת חשבון</Text>
                            </View>
                        </Button>

                        <Button
                            className="mb-4 py-4 bg-white border border-slate-200 rounded-xl shadow-sm"
                            textClass="text-slate-800 font-bold"
                            onPress={() => router.push(basePath + '/createNewProfile')}
                        >
                            <View className="flex-row items-center justify-center">
                                <Ionicons name="add-circle-outline" size={20} color="#3b82f6" className="ml-2" />
                                <Text className={textClass}>צור פרופיל חדש</Text>
                            </View>
                        </Button>

                        <Button
                            className="mb-4 py-4 bg-white border border-slate-200 rounded-xl shadow-sm"
                            textClass="text-slate-800 font-bold"
                            onPress={handleClearProfile}
                        >
                            <View className="flex-row items-center justify-center">
                                <Ionicons name="swap-horizontal-outline" size={20} color="#3b82f6" className="ml-2" />
                                <Text className={textClass}>התנתקות מהפרופיל</Text>
                            </View>
                        </Button>

                        <Button
                            className="mb-4 py-4 bg-white border border-slate-200 rounded-xl shadow-sm"
                            textClass="text-slate-800 font-bold"
                            onPress={handleLogout}
                        >
                            <View className="flex-row items-center justify-center">
                                <Ionicons name="power-outline" size={20} color="#3b82f6" className="ml-2" />
                                <Text className={textClass}>התנתקות מהחשבון</Text>
                            </View>
                        </Button>

                        <Button
                            className="py-4 bg-white border border-red-200 rounded-xl shadow-sm"
                            textClass="text-red-600 font-bold"
                            onPress={() => router.push(basePath + '/deleteProfile')}
                        >
                            <View className="flex-row items-center justify-center">
                                <Ionicons name="trash-outline" size={20} color="#ef4444" className="ml-2" />
                                <Text className={textClass.replace("text-slate-800", "text-red-600")}>מחק פרופיל</Text>
                            </View>
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}