import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext.jsx";
import { I18nManager } from "react-native";
import { useEffect } from "react";

export default function RootLayout() {

  useEffect(() => {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  }, []);

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
