import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Text, View, Image } from "react-native";
import { useState } from "react";
import Button from "../components/common/button.jsx";
import FeatureCarousel from "../components/common/FeatureCarousel.jsx";
import MotiSplashScreen from "../components/common/MotiSplashScreen.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingSpinner from "../components/common/loadingSpinner.jsx";
import "../global.css";



export default function Index() {
  const router = useRouter();
  const { autoLogin, isLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Show splash screen first
  if (showSplash) {
    return <MotiSplashScreen onFinish={handleSplashComplete} />;
  }

  const toLoginAction = async () => {
    const result = await autoLogin();
    if (result) {
      router.push('/home/(tabs)/budgetSummary');
    } else {
      router.push('/login');
    }
  }

  const getJerusalemHour = () => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Jerusalem',
      hour: 'numeric',
      hour12: false,
    });
    return parseInt(formatter.format(new Date()), 10);
  };

  const greeting = () => {
    const hour = getJerusalemHour();

    if (hour >= 5 && hour < 12) return "בוקר טוב";
    if (hour >= 12 && hour < 17) return "צהריים טובים";
    if (hour >= 17 && hour < 21) return "ערב טוב";
    return "לילה טוב";
  };

  greeting();
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <LinearGradient
      colors={["#f8fafc", "#eef2f7", "#e5eaf1"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      {/* אלמנטים דקורטיביים עדינים ברקע */}
      <View pointerEvents="none" className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-300/20" />
      <View pointerEvents="none" className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/20" />
      <View pointerEvents="none" className="absolute top-1/3 right-10 h-24 w-24 rounded-full bg-white/20 blur-md" />

      <View className="h-full pt-8 mt-12">
        {/* אזור עליון: לוגו + טקסט פתיחה */}
        <View className="flex-1 items-center justify-center px-6">
          {/* סמל עם גרדיאנט וצל משופר */}

          <View className="flex-col items-center justify-center my-8">
            <Image
              className="w-52 h-52"
              source={require("../assets/images/icon.png")}
            />
            <Text className="text-wrap text-4xl text-center text-slate-800 font-bold">Smart Finance</Text>
          </View>


          <Text
            className="text-2xl font-bold text-slate-900 tracking-tight text-center"
          >
            {greeting()}
          </Text>

          {/* תת-כותרת עם RTL נכון ואייקון משמאל */}
          <View className="flex items-center mt-4" style={{ direction: 'rtl' }}>
            <Text
              className="text-base text-slate-500 leading-6 text-center max-w-xs"
            >
              נהל את הכספים שלך בצורה חכמה ופשוטה
            </Text>
            <Ionicons name="trending-up" size={24} color="#64748b" />
          </View>

          {/* === הקרוסלה במקום ה"Highlights" הישנים === */}
          <View>
            <FeatureCarousel />
          </View>
        </View>

        {/* אזור תחתון: כפתורים – זכוכית */}
        <BlurView intensity={22} tint="light" style={{ flex: 1 }} className="mt-16">
          <View className="flex-1 items-center justify-center">
            <View className="w-11/12 max-w-sm rounded-3xl border border-white/40 bg-white backdrop-blur p-5 shadow-xl">
              <Text
                className="text-center text-slate-800 text-base font-semibold mb-4"
                style={{ writingDirection: "rtl", textAlign: "center" }}
              >
                התחבר או צור חשבון כדי להתחיל
              </Text>

              <View className="flex flex-col justify-center content-center items-center">
                <Button onPress={() => toLoginAction()}>
                  לכניסה
                </Button>

                <Text className="mb-4 text-slate-500">
                  או
                </Text>

                <Button onPress={() => router.push("/register")}>
                  להרשמה
                </Button>
              </View>
            </View>
          </View>
        </BlurView>
      </View>
    </LinearGradient>
  );
}
