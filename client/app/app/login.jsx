import { useState } from "react";
import { Text, View, Platform, KeyboardAvoidingView, I18nManager, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

import Button from "../components/common/button.jsx";
import Input from "../components/common/textInput.jsx";
import LoadingSpinner from "../components/common/loadingSpinner.jsx";
import useLogin from "../hooks/auth/useLogin.js";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { error, loading, login } = useLogin({ setPassword });
  const isRTL = I18nManager.isRTL;

  return (
    <LinearGradient
      colors={["#f8fafc", "#eef2f7", "#e5eaf1"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        {loading && <LoadingSpinner />}

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" className="px-6">
            <View className="flex-1 items-center justify-center">
              {/* לוגו */}
              <View className="w-16 h-16 rounded-2xl bg-white items-center justify-center mb-6"
                    style={{ shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 10, elevation: 6 }}>
                <Ionicons name="lock-closed-outline" size={26} color="#0f172a" />
              </View>

              {/* כותרות */}
              <Text className="text-3xl font-extrabold text-slate-900 text-center"
                    style={{ writingDirection: isRTL ? "rtl" : "ltr" }}>
                התחברות
              </Text>
              <Text className="text-slate-600 text-center mt-1"
                    style={{ writingDirection: isRTL ? "rtl" : "ltr" }}>
                ברוך הבא! הזן פרטים כדי להמשיך
              </Text>

              {/* כרטיס טופס */}
              <BlurView intensity={24} tint="light" className="w-full mt-6 rounded-3xl overflow-hidden">
                <View className="bg-white/70 border border-white/40 p-5">
                  {/* שגיאה */}
                  {error ? (
                    <View className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-3">
                      <Text className="text-red-600 text-sm text-right"
                            style={{ writingDirection: isRTL ? "rtl" : "ltr" }}>
                        {error}
                      </Text>
                    </View>
                  ) : null}

                  {/* שם משתמש – לייבל מימין */}
                  <View className="mb-3">
                    <Text
                      className="text-slate-700 mb-2 font-medium text-right self-end"
                      style={{ writingDirection: isRTL ? "rtl" : "ltr", textAlign: "right" }}
                    >
                      שם משתמש
                    </Text>
                    <Input
                      placeholder="שם משתמש"
                      value={username}
                      onChangeText={setUsername}
                    />
                  </View>

                  {/* סיסמה – לייבל מימין */}
                  <View className="mb-4">
                    <Text
                      className="text-slate-700 mb-2 font-medium text-right self-end"
                      style={{ writingDirection: isRTL ? "rtl" : "ltr", textAlign: "right" }}
                    >
                      סיסמה
                    </Text>
                    <Input
                      placeholder="סיסמה"
                      secureTextEntry={true}
                      value={password}
                      onChangeText={setPassword}
                    />
                  </View>

                  {/* כפתור */}
                  <Button onPress={() => login(username, password)}>
                    התחבר
                  </Button>

                  <Text className="text-xs text-slate-500 text-center mt-3"
                        style={{ writingDirection: isRTL ? "rtl" : "ltr" }}>
                    שכחת סיסמה? פנה לתמיכה
                  </Text>
                </View>
              </BlurView>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
