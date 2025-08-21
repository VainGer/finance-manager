import { useEffect } from "react";
import { I18nManager } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Drawer } from "expo-router/drawer";
import Navbar from '../../components/common/navbar';
export default function RootLayout() {

    useEffect(() => {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
    }, []);

    return (
        <SafeAreaView className="bg-gray-500 h-full">
            <Drawer
                screenOptions={{
                    header: () => <Navbar />,
                    drawerPosition: 'right',
                    drawerLabelStyle: {
                        fontWeight: '500',
                        textAlign: 'right',
                    },
                    drawerContentStyle: {
                        paddingTop: 20,
                    },
                }}
            >
                <Drawer.Screen
                    name="(tabs)"
                    options={{ drawerLabel: "דף ראשי", title: "דף ראשי",  }}
                />
                <Drawer.Screen name="addTransaction"
                    options={{
                        drawerLabel: 'הוסף הוצאה',
                        title: 'הוסף הוצאה',
                    }}
                />
                <Drawer.Screen name="categoryMenu"
                    options={{
                        drawerLabel: 'ניהול קטגוריות',
                        title: 'ניהול קטגוריות',
                    }}
                />
                <Drawer.Screen name="businessMenu"
                    options={{
                        drawerLabel: 'ניהול עסקים',
                        title: 'ניהול עסקים',
                    }}
                />
                <Drawer.Screen name="budgetsMenu"
                    options={{
                        drawerLabel: 'ניהול תקציבים',
                        title: 'ניהול תקציבים',
                    }}
                />
                <Drawer.Screen name="uploadTransactionsFromFile"
                    options={{
                        drawerLabel: 'העלאת עסקאות מקובץ',
                        title: 'העלאת עסקאות מקובץ',
                    }}
                />
                <Drawer.Screen name="profileSettings"
                    options={{
                        drawerLabel: 'הגדרות פרופיל',
                        title: 'הגדרות פרופיל',
                    }}
                />
            </Drawer>
        </SafeAreaView >
    );
}
