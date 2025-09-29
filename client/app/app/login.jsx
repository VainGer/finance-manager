import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  I18nManager,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Button from "../components/common/button.jsx";
import LoadingSpinner from "../components/common/loadingSpinner.jsx";
import Input from "../components/common/textInput.jsx";
import useLogin from "../hooks/auth/useLogin.js";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { error, loading, login } = useLogin({ setPassword });
  const isRTL = I18nManager.isRTL;

  return (
    <>
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

        <View style={{
          flex: 1,
          paddingBottom: 10
        }}>
          {loading && <LoadingSpinner />}

          {/* כפתור חזרה */}
          <TouchableOpacity
            className="absolute top-4 left-4 z-10 p-2 rounded-full bg-white/70"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              className="px-6"
            >
              <View className="flex-1 items-center justify-center py-8">
                {/* לוגו */}
                <LinearGradient
                  colors={["#1e293b", "#334155"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="w-16 h-16 items-center justify-center mb-6 rounded-3xl"
                  style={{
                    shadowColor: "#0f172a",
                    shadowOpacity: 0.3,
                    shadowOffset: { width: 0, height: 4 },
                    shadowRadius: 10,
                    elevation: 8
                  }}
                >
                  <Ionicons name="lock-closed-outline" size={26} color="#ffffff" />
                </LinearGradient>

                {/* כותרות */}
                <Text
                  className="text-3xl font-extrabold text-slate-900 text-center mb-1"
                  style={{ writingDirection: isRTL ? "rtl" : "ltr" }}
                >
                  התחברות
                </Text>
                <Text
                  className="text-slate-600 text-center mb-6"
                  style={{ writingDirection: isRTL ? "rtl" : "ltr" }}
                >
                  ברוך הבא! הזן פרטים כדי להמשיך
                </Text>

                {/* כרטיס טופס */}
                <BlurView intensity={24} tint="light" className="w-full rounded-3xl overflow-hidden">
                  <View className="bg-white/70 border border-white/40 p-5">
                    {/* שגיאה */}
                    {error ? (
                      <View className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-4">
                        <Text
                          className="text-red-600 text-sm text-right"
                          style={{ writingDirection: isRTL ? "rtl" : "ltr" }}
                        >
                          {error}
                        </Text>
                      </View>
                    ) : null}

                    {/* שם משתמש */}
                    <View className="mb-4">
                      <Text
                        className="text-slate-700 mb-2 font-medium text-right"
                        style={{ writingDirection: isRTL ? "rtl" : "ltr" }}
                      >
                        שם משתמש
                      </Text>
                      <Input
                        placeholder="שם משתמש"
                        value={username}
                        onChangeText={setUsername}
                      />
                    </View>

                    {/* סיסמה */}
                    <View className="mb-6">
                      <Text
                        className="text-slate-700 mb-2 font-medium text-right"
                        style={{ writingDirection: isRTL ? "rtl" : "ltr" }}
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

                    {/* קישורים */}
                    <View className="mt-4">
                      <Text
                        className="text-slate-500 text-center text-sm mb-2"
                        style={{ writingDirection: isRTL ? "rtl" : "ltr" }}
                      >
                        שכחת סיסמה? פנה לתמיכה
                      </Text>

                      <TouchableOpacity onPress={() => router.push("/register")}>
                        <Text
                          className="text-slate-600 text-center text-sm"
                          style={{ writingDirection: isRTL ? "rtl" : "ltr" }}
                        >
                          אין לך חשבון? <Text className="text-blue-600 font-medium">הירשם כאן</Text>
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </BlurView>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </LinearGradient>
    </>
  );
}
