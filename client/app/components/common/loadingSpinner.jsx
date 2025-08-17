import { ActivityIndicator, View } from "react-native";

export default function LoadingSpinner({ color = "blue" }) {
    const colorMap = {
        blue: "#2563eb",   // Tailwind blue-600
        green: "#16a34a",  // Tailwind green-600
        red: "#dc2626"     // Tailwind red-600
    };

    return (
        <View className="absolute w-full h-full bg-black/50 justify-center items-center inset-0 z-50">
            <ActivityIndicator size="large" color={colorMap[color] || colorMap.blue} />
        </View>
    );
}
