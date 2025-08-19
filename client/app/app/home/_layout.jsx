import { Tabs } from "expo-router";
import { useEffect } from "react";
import { I18nManager } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {

    useEffect(() => {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
    }, []);

    return (
        <SafeAreaView className="bg-gray-500 h-full">
            <Tabs screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    height: 60,
                    paddingBottom: 0,
                    paddingTop: 0,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
                tabBarItemStyle: {
                    padding: 0,
                }
            }}>
                <Tabs.Screen name="graphs" options={{ title: "גרפים" }} />
                <Tabs.Screen name="expenseSummary" options={{ title: "סקירת הוצאות" }} />
                <Tabs.Screen name="expensesDisplay" options={{ title: "הוצאות" }} />
                <Tabs.Screen name="budgetSummary" options={{ title: "סקירת תקציב" }} />
            </Tabs>
        </SafeAreaView >
    );
}
