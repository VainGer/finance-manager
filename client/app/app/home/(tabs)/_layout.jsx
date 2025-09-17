import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from "expo-router";
import { useEffect } from "react";
import { I18nManager } from "react-native";

export default function RootLayout() {

    useEffect(() => {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
    }, []);

    return (
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
            },
            tabBarActiveTintColor: '#3b82f6', // Blue color for active tab
            tabBarInactiveTintColor: '#64748b', // Slate color for inactive tab
        }}>
            <Tabs.Screen 
                name="charts" 
                options={{ 
                    title: "גרפים",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="bar-chart" size={size} color={color} />
                    ),
                }} 
            />
            <Tabs.Screen 
                name="expenseSummary" 
                options={{ 
                    title: "סקירת הוצאות",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="finance" size={size} color={color} />
                    ),
                }} 
            />
            <Tabs.Screen 
                name="expensesDisplay" 
                options={{ 
                    title: "הוצאות",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="money" size={size} color={color} />
                    ),
                }} 
            />
            <Tabs.Screen 
                name="budgetSummary" 
                options={{ 
                    title: "סקירת תקציב",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="chart-pie" size={size} color={color} />
                    ),
                }} 
            />
        </Tabs>
    );
}
