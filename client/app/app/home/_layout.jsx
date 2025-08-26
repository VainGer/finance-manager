import { useEffect } from "react";
import { I18nManager, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Drawer } from "expo-router/drawer";
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../../components/common/navbar';
import { LinearGradient } from 'expo-linear-gradient';
export default function RootLayout() {
    const { profile } = useAuth();

    useEffect(() => {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
    }, []);

    const getBaseColor = () => {
        if (profile?.color) {
            return profile.color;
        }
        return '#8A2BE2';
    };

    const baseColor = getBaseColor();

    return (
        <SafeAreaView className="h-full" style={{ backgroundColor: '#f8fafc' }}>
            <Drawer
                screenOptions={{
                    header: () => <Navbar />,
                    headerShown: true,
                    drawerPosition: 'right',
                    drawerLabelStyle: {
                        fontWeight: '600',
                        textAlign: 'right',
                        fontSize: 16,
                    },
                    drawerItemStyle: {
                        borderRadius: 8,
                        marginHorizontal: 8,
                        marginVertical: 4,
                    },
                    drawerContentStyle: {
                        paddingTop: 24,
                        backgroundColor: '#f8fafc',
                    },
                    drawerActiveBackgroundColor: `${baseColor}20`,
                    drawerActiveTintColor: baseColor,
                    drawerInactiveTintColor: '#64748b',
                }}
            >
                <Drawer.Screen
                    name="(tabs)"
                    options={{ drawerLabel: "דף ראשי", title: "דף ראשי", }}
                />
                <Drawer.Screen name="addTransaction"
                    options={{
                        drawerLabel: 'הוסף הוצאה',
                        title: 'הוסף הוצאה',
                        drawerIcon: ({ color }) => <Ionicons name="add-outline" size={22} color={color} />

                    }}
                />
                <Drawer.Screen name="categoryMenu"
                    options={{
                        drawerLabel: 'ניהול קטגוריות',
                        title: 'ניהול קטגוריות',
                        drawerIcon: ({ color }) => <Ionicons name="pricetags-outline" size={22} color={color} />
                    }}
                />
                <Drawer.Screen name="businessMenu"
                    options={{
                        drawerLabel: 'ניהול עסקים',
                        title: 'ניהול עסקים',
                        drawerIcon: ({ color }) => <Ionicons name="briefcase-outline" size={22} color={color} />
                    }}
                />
                <Drawer.Screen name="budgetsMenu"
                    options={{
                        drawerLabel: 'ניהול תקציבים',
                        title: 'ניהול תקציבים',
                        drawerIcon: ({ color }) => <Ionicons name="wallet-outline" size={22} color={color} />
                    }}
                />
                <Drawer.Screen name="uploadTransactionsFromFile"
                    options={{
                        drawerLabel: 'העלאת עסקאות מקובץ',
                        title: 'העלאת עסקאות מקובץ',
                        drawerIcon: ({ color }) => <Ionicons name="cloud-upload-outline" size={22} color={color} />
                    }}
                />
                <Drawer.Screen name="profileSettings"
                    options={{
                        drawerLabel: 'הגדרות פרופיל',
                        title: 'הגדרות פרופיל',
                        drawerIcon: ({ color }) => <Ionicons name="settings-outline" size={22} color={color} />
                    }}
                />
            </Drawer>
        </SafeAreaView >
    );
}
