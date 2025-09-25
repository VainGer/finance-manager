import { Stack } from "expo-router";
import { useEffect } from "react";
import { I18nManager, View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthProvider } from "../context/AuthContext.jsx";
import { ProfileDataProvider } from "../context/ProfileDataContext.jsx"; 

export default function RootLayout() {
  useEffect(() => {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaWrapper>
        <AuthProvider>
          <ProfileDataProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </ProfileDataProvider>
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