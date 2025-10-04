import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { I18nManager, Text, View } from "react-native";
import Button from "../components/common/button.jsx";
import FeatureCarousel from "../components/common/FeatureCarousel.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingSpinner from "../components/common/loadingSpinner.jsx";

import "../global.css";



export default function Index() {
  const router = useRouter();
  const isRTL = I18nManager.isRTL;
  const { autoLogin, isLoading } = useAuth();

  const toLoginAction = async () => {
    const result = await autoLogin();
    if (result) {
      router.push('/home/(tabs)/budgetSummary');
    } else {
      router.push('/login');
    }
  }



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
          <LinearGradient
            colors={["#1e293b", "#334155"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-24 h-24 items-center justify-center mb-10 rounded-3xl"
          >
            <Ionicons name="wallet" size={42} color="#ffffff" />
          </LinearGradient>

          {/* כותרות – טיפוגרפיה מודרנית עם RTL נכון */}
          <Text
            className="text-5xl font-bold text-slate-900 tracking-tight text-center mb-2"
          >
            ברוך הבא
          </Text>
          <Text
            className="text-2xl font-semibold text-slate-600 text-center mb-6"
          >
            למנהל הכספים
          </Text>

          {/* תת-כותרת עם RTL נכון ואייקון משמאל */}
          <View className="flex items-center mt-4" style={{ direction: 'rtl' }}>
            <Text
              className="text-base text-slate-500 leading-6 text-center max-w-xs"
            >
              נהל את הכספים שלך בצורה חכמה ופשוטה
            </Text>
          <Ionicons className="mr-4" name="trending-up" size={24} color="#64748b" />
          </View>

          {/* === הקרוסלה במקום ה"Highlights" הישנים === */}
          <View className="mt-4 w-full">
            <FeatureCarousel />
          </View>
        </View>

        {/* אזור תחתון: כפתורים – זכוכית */}
        <BlurView intensity={22} tint="light" style={{ flex: 1 }}>
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

            <View className="flex-row-reverse items-center mt-6" style={{ direction: 'rtl' }}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" style={{ marginRight: 4 }} />
              <Text className="text-slate-400 text-center text-sm" style={{ writingDirection: "rtl" }}>
                גרסה 1.0 • מנהל הכספים שלך
              </Text>
            </View>
          </View>
        </BlurView>
      </View>
    </LinearGradient>
  );
}
