import { Stack, useRouter, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { I18nManager, View, Text } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../context/AuthContext.jsx";
import { ProfileDataProvider } from "../context/ProfileDataContext.jsx";
import Overlay from "../components/common/Overlay.jsx";
import Button from "../components/common/button.jsx";
import { useProfileData } from "../context/ProfileDataContext.jsx";
function RootLayoutNav() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

function AuthGate() {
  const { account, profile, isExpiredToken, storageChecked } = useAuth();
  const { newDataReady } = useProfileData();
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [showNewDataOverlay, setShowNewDataOverlay] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isExpiredToken) {
      setShowSessionExpired(true);
    }
  }, [isExpiredToken]);

  useEffect(() => {
    if (newDataReady) {
      setShowNewDataOverlay(true);
    }
  }, [newDataReady]);

  const allowedWithoutAccount = ['/', '/login', '/register'];
  const allowedWithoutProfile = [...allowedWithoutAccount, '/authProfile'];

  useEffect(() => {
    if (!storageChecked) return;
    if (!account && !allowedWithoutAccount.includes(pathname)) {
      router.replace('/login');
    } else if (account && !profile && !allowedWithoutProfile.includes(pathname)) {
      router.replace('/authProfile');
    }
  }, [account, profile, storageChecked, pathname]);

  const ExpiredSession = () => (
    <Overlay>
      <Text className="text-center text-lg mb-4 mx-auto">הסשן שלך פג תוקף
        אנא התחבר מחדש כדי להמשיך לשימוש באפליקציה.
      </Text>
      <Button
        onPress={() => {
          router.replace('/');
          setShowSessionExpired(false);
        }}
      >
        התחברות מחדש
      </Button>
    </Overlay>
  );

  const NewDataOverlay = () => (
    <Overlay>
      <Text className="text-xl font-bold text-center mb-4">תובנות AI חדשות מוכנות וממתינות לצפייה</Text>
      <Text className="text-center text-gray-700 mb-4">
        הניתוח התקציבי החדש זמין לצפייה.
      </Text>
      <Text className="text-center text-gray-700 mb-6">
        לצפייה עבור לסקירת הוצאות ובחר ב"תובנות AI"
      </Text>
      <View className="flex-row gap-3">
        <Button
          onPress={() => {
            setShowNewDataOverlay(false);
          }}
        >
          אישור
        </Button>
      </View>
    </Overlay>
  );

  return (
    <>
      {showSessionExpired && <ExpiredSession />}
      {showNewDataOverlay && <NewDataOverlay />}
      <RootLayoutNav />
    </>
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
            <AuthGate />
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