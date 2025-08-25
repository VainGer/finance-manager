import { Text, View, Pressable, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import "../global.css";

export default function Index() {
  const router = useRouter();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <SafeAreaView className="flex-1">
        {/* Background Gradient */}
        <LinearGradient
          colors={['#0f172a', '#334155', '#0f172a']}
          style={{ flex: 1 }}
          locations={[0, 0.5, 1]}
        >
          {/* Background Pattern */}
          <View className="absolute inset-0 opacity-5">
            <View className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }} />
          </View>

          <View className="flex-1 justify-between px-6 py-8">
            {/* Header Section */}
            <View className="flex-1 justify-center items-center">
              {/* Logo */}
              <View className="w-20 h-20 bg-gradient-to-r from-slate-600 to-slate-800 rounded-2xl items-center justify-center mb-8 shadow-lg">
                <Text className="text-3xl">📊</Text>
              </View>

              {/* Main Title */}
              <Text className="text-4xl font-bold text-white text-center mb-4 leading-tight">
                להיות מקצועי
              </Text>
              <Text className="text-3xl font-bold text-center mb-6">
                <Text className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  עם הכסף שלך
                </Text>
              </Text>
              
              {/* Subtitle */}
              <Text className="text-lg text-slate-300 text-center mb-8 leading-6 max-w-sm">
                פלטפורמה מתקדמת לניהול פיננסי חכם עם עיבוד אוטומטי לחוויית משתמש מושלמת
              </Text>

              {/* Trust Badge */}
              <View className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-8 border border-white/20">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full items-center justify-center">
                    <Text className="text-white text-lg">✓</Text>
                  </View>
                  <View>
                    <Text className="text-white font-semibold text-sm">מאובטח ברמה בנקאית</Text>
                    <Text className="text-slate-300 text-xs">10,000+ משתמשים פעילים</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="w-full">
              {/* Primary CTA Button */}
              <Pressable
                onPress={() => router.push("/register")}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl px-8 py-4 mb-4 shadow-lg"
                style={{
                  shadowColor: "#3b82f6",
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 6,
                }}
              >
                <View className="flex-row items-center justify-center">
                  <Text className="text-white text-lg font-semibold mr-2">
                    להתחיל ניסיון חינם
                  </Text>
                  <Text className="text-white">→</Text>
                </View>
              </Pressable>

              {/* Secondary Login Button */}
              <Pressable
                onPress={() => router.push("/login")}
                className="bg-white/10 border border-white/20 rounded-xl px-8 py-4 backdrop-blur-sm"
                style={{
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 2,
                }}
              >
                <Text className="text-white text-lg font-semibold text-center">
                  התחברות
                </Text>
              </Pressable>

              {/* Footer */}
              <Text className="text-slate-400 text-center mt-6 text-sm">
                גרסה 1.0 • מנהל הכספים האישי שלך
              </Text>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    </>
  );
}
