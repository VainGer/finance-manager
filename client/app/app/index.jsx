import { Text, View, Button } from "react-native";
import "../global.css"
export default function Index() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-lg font-bold">Edit app/index.tsx to edit this screen.</Text>
      <Button title="Click Me" onPress={() => alert("Button Pressed")} />
    </View>
  );
}
