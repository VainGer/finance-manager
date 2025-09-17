import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext.jsx";
import { I18nManager } from "react-native";
import { useEffect } from "react";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { View, StatusBar } from "react-native";

export default function RootLayout() {

  useEffect(() => {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor="black"
        translucent={true}
      />
      <SafeAreaWrapper>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
      </SafeAreaWrapper>
    </SafeAreaProvider>
  );
}

function SafeAreaWrapper({ children }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: "black",
      }}
    >
      {children}
    </View>
  );
}