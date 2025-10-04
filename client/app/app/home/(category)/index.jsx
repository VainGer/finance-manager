import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, Text, View } from 'react-native';
import MenuButton from '../../../components/common/menuButton.jsx';
import { useRouter } from 'expo-router';

export default function Index() {
    const router = useRouter();
    const basePath = "/home/(category)/";

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
                        <Text className="text-2xl font-bold text-slate-800">ניהול קטגוריות</Text>
                        <View className="h-1 w-12 bg-green-500 rounded-full mt-2" />
                    </View>

                    {/* Category icon */}
                    <View className="items-center mb-8">
                        <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-2">
                            <Ionicons name="pricetags-outline" size={36} color="#10b981" />
                        </View>
                    </View>

                    {/* Menu options */}
                    <View className="w-full max-w-sm">
                        <MenuButton onPress={() => router.push(`${basePath}create`)}
                            icon="add-circle-outline" text="הוספת קטגוריה" />
                        <MenuButton onPress={() => router.push(`${basePath}rename`)}
                            icon="create-outline" text="שינוי שם קטגוריה" />
                        <MenuButton onPress={() => router.push(`${basePath}delete`)}
                            icon="trash-outline" text="מחיקת קטגוריה" />
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}