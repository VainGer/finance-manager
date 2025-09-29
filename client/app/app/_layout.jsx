import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { I18nManager, View, Text } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthProvider } from "../context/AuthContext.jsx";
import { ProfileDataProvider } from "../context/ProfileDataContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useRouter } from 'expo-router';
import { useProfileData } from "../context/ProfileDataContext.jsx";
import Overlay from "../components/common/Overlay.jsx";
import Button from "../components/common/button.jsx";


function RootLayoutNav() {

  const { isExpiredToken } = useAuth();
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (isExpiredToken) {
      setShowSessionExpired(true);
    }
  }, [isExpiredToken]);

  if (showSessionExpired) {
    return <View className="flex-1 justify-center items-center bg-white">
      <Overlay >
        <Text className="text-lg mb-4 mx-auto">הסשן שלך פג תוקף, אנא התחבר שוב</Text>
        <Button onPress={() => { router.replace('/'); setShowSessionExpired(false); }}>לכניסה</Button>
      </Overlay>
    </View>;
  }



  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}

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
            <RootLayoutNav />
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