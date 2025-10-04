import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, Text, View } from 'react-native';
import MenuButton from '../../../components/common/menuButton.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useRouter } from 'expo-router';
import Button from '../../../components/common/button.jsx';
import UseBudgets from '../../../hooks/useBudgets.js';

export default function Index() {
    const router = useRouter();
    const { profile } = useAuth();
    const basePath = "/home/(budget)/";
    const { profileBudgets } = UseBudgets({ setLoading: () => { } });


    if (!profile.parentProfile && (!profile.newBudgets || profile.newBudgets.length === 0)
        && (!profileBudgets || profileBudgets.length === 0)) {
        return (
            <LinearGradient
                colors={["#f8fafc", "#eef2f7", "#e5eaf1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}
            >
                <View className="flex-1 h-full items-center justify-center">
                    <Text className="text-center text-slate-800 text-lg">
                        אין תקציבים זמינים, עליך קודם לקבל תקציב מהורה.
                    </Text>
                    <Button onPress={() => router.back()} className="mt-6 w-32">אישור</Button>
                </View>
            </LinearGradient>
        )
    }

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
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-1 items-center justify-center py-10 px-6">
                    {/* Title */}
                    <View className="items-center mb-10">
                        <Text className="text-2xl font-bold text-slate-800">ניהול תקציבים</Text>
                        <View className="h-1 w-12 bg-blue-500 rounded-full mt-2" />
                    </View>

                    {/* Budget icon */}
                    <View className="items-center mb-8">
                        <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-2">
                            <Ionicons name="wallet-outline" size={36} color="#3b82f6" />
                        </View>
                    </View>

                    {/* Menu options */}
                    <View className="w-full max-w-sm">
                        {(profile.newBudgets && profile.newBudgets.length > 0 || profile.parentProfile) && (
                            <MenuButton onPress={() => router.push(`${basePath}createProfileBudget`)}
                                icon="add-circle-outline" text="יצירת תקציב פרופיל" />
                        )}

                        {profile.parentProfile && profile.children.length > 0 && (
                            <MenuButton onPress={() => router.push(`${basePath}createChildrenBudget`)}
                                icon="add-circle-outline" text="יצירת תקציב לילד" />
                        )}
                        {profileBudgets && profileBudgets.length > 0 && (
                            <MenuButton onPress={() => router.push(`${basePath}deleteBudget`)}
                                icon="trash-outline" text="מחיקת תקציב" />
                        )}
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    )
}