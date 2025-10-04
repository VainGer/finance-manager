import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { I18nManager, View, Text } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthProvider } from "../context/AuthContext.jsx";
import { ProfileDataProvider } from "../context/ProfileDataContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useRouter } from 'expo-router';
import Overlay from "../components/common/Overlay.jsx";
import Button from "../components/common/button.jsx";
import { usePathname } from "expo-router";

function RootLayoutNav() {
  const { account, profile, isExpiredToken, storageChecked } = useAuth();
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isExpiredToken) {
      setShowSessionExpired(true);
    }
  }, [isExpiredToken]);

  const allowedWithoutAccount = ['/', '/login', '/register'];
  const allowedWithoutProfile = allowedWithoutAccount.concat(['/authProfile']);

  useEffect(() => {
    if (!storageChecked) return;

    if (!account && !allowedWithoutAccount.includes(pathname)) {
      router.replace('/login');
    } else if (account && !profile && !allowedWithoutProfile.includes(pathname)) {
      router.replace('/authProfile');
    }
  }, [account, profile, storageChecked, pathname]);

  if (showSessionExpired) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Overlay>
          <Text className="text-lg mb-4 mx-auto">הסשן שלך פג תוקף, אנא התחבר שוב</Text>
          <Button
            onPress={() => {
              router.replace('/login');
              setShowSessionExpired(false);
            }}
          >
            לכניסה
          </Button>
        </Overlay>
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
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