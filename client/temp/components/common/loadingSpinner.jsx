import { ActivityIndicator, View, Text } from "react-native";

export default function LoadingSpinner({ 
    color = "primary", 
    size = "large", 
    fullScreen = true,
    message = "טוען נתונים..." 
}) {
    const colorMap = {
        primary: "#3b82f6",   // Tailwind blue-500
        secondary: "#64748b", // Tailwind slate-500
        success: "#10b981",   // Tailwind emerald-500
        warning: "#f59e0b",   // Tailwind amber-500
        danger: "#ef4444",    // Tailwind red-500
    };

    const spinnerColor = colorMap[color] || colorMap.primary;
    
    if (fullScreen) {
        return (
            <View className="absolute w-full h-full bg-slate-900/30 justify-center items-center inset-0 z-50">
                <View className="bg-white p-6 rounded-2xl shadow-md flex-row items-center justify-center">
                    <ActivityIndicator size={size} color={spinnerColor} />
                    {message && <Text className="text-slate-700 font-medium mr-3">{message}</Text>}
                </View>
            </View>
        );
    }
    
    return (
        <View className="flex-row items-center justify-center p-2">
            <ActivityIndicator size={size} color={spinnerColor} />
            {message && <Text className="text-slate-700 font-medium mr-3">{message}</Text>}
        </View>
    );
}
