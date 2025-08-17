import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Button from "../components/common/button.jsx";

import "../global.css"
export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView className="bg-white dark:bg-black h-full">
      <View className="bg-white flex-1 items-center justify-center h-3/4">
        <Text>Welcome section</Text>
      </View>
      {/* to login/register */}
      <View className="bg-white flex-1 items-center justify-center">
        <View className="w-1/2 flex flex-col gap-2">
          <Button onPress={() => router.push("/login")}>
            לכניסה
          </Button>
          <Button onPress={() => router.push("/register")}>
            להרשמה
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
