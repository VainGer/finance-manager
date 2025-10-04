import { Stack } from "expo-router";
import { I18nManager } from "react-native";
import { useEffect } from "react";

export default function BusinessMenuLayout() {

    useEffect(() => {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
    }, []);

    return (
        <Stack screenOptions={{ headerShown: false }} />
    );
}
