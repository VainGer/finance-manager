import { Ionicons } from '@expo/vector-icons';
import { Drawer } from "expo-router/drawer";
import { useEffect } from "react";
import { I18nManager, View, Dimensions } from "react-native";
import Navbar from '../../components/common/navbar';
import { useAuth } from '../../context/AuthContext';
export default function RootLayout() {
    const { profile } = useAuth();
    const windowWidth = Dimensions.get('window').width;
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
        <>
            <View style={{ height: '100%', backgroundColor: '#f8fafc' }}>
                <Drawer
                    screenOptions={{
                        header: () => <Navbar />,
                        headerShown: true,
                        drawerPosition: 'right',
                        drawerLabelStyle: {
                            fontWeight: '600',
                            textAlign: 'left',
                            fontSize: 14,
                        },
                        drawerItemStyle: {
                            borderRadius: 8,
                            marginLeft: windowWidth * 0.16,
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
                        options={{
                            drawerLabel: "דף ראשי",
                            title: "דף ראשי",
                            drawerIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />,
                            unmountOnBlur: true,
                        }}
                    />
                    <Drawer.Screen name="addTransaction"
                        options={{
                            drawerLabel: 'הוסף הוצאה',
                            title: 'הוסף הוצאה',
                            drawerIcon: ({ color }) => <Ionicons name="add-outline" size={22} color={color} />,
                            unmountOnBlur: true,
                        }}
                    />
                    <Drawer.Screen name="categoryMenu"
                        options={{
                            drawerLabel: 'ניהול קטגוריות',
                            title: 'ניהול קטגוריות',
                            drawerIcon: ({ color }) => <Ionicons name="pricetags-outline" size={22} color={color} />,
                            unmountOnBlur: true,
                        }}
                    />
                    <Drawer.Screen name="businessMenu"
                        options={{
                            drawerLabel: 'ניהול עסקים',
                            title: 'ניהול עסקים',
                            drawerIcon: ({ color }) => <Ionicons name="briefcase-outline" size={22} color={color} />,
                            unmountOnBlur: true,
                        }}
                    />
                    <Drawer.Screen name="budgetsMenu"
                        options={{
                            drawerLabel: 'ניהול תקציבים',
                            title: 'ניהול תקציבים',
                            drawerIcon: ({ color }) => <Ionicons name="wallet-outline" size={22} color={color} />,
                            unmountOnBlur: true,
                        }}
                    />
                    <Drawer.Screen name="uploadTransactionsFromFile"
                        options={{
                            drawerLabel: 'העלאת עסקאות מקובץ',
                            title: 'העלאת עסקאות מקובץ',
                            drawerIcon: ({ color }) => <Ionicons name="cloud-upload-outline" size={22} color={color} />,
                            unmountOnBlur: true,
                        }}
                    />
                    <Drawer.Screen name="(profileSettings)"
                        options={{
                            drawerLabel: 'הגדרות פרופיל',
                            title: 'הגדרות פרופיל',
                            drawerIcon: ({ color }) => <Ionicons name="settings-outline" size={22} color={color} />,
                            unmountOnBlur: true,
                        }}
                    />
                </Drawer>
            </View>
        </>
    );
}
