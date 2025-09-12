import { View, Text, Pressable } from "react-native";

export default function OverlayMessages({ errors, successes, onClose }) {
    return (
        <View className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
            <View className="bg-white rounded-2xl p-6 w-full max-w-md">
                {successes.map((msg, idx) => (
                    <Text key={`s-${idx}`} className="text-green-600 mb-2">
                        ✔ {msg}
                    </Text>
                ))}
                {errors.map((msg, idx) => (
                    <Text key={`e-${idx}`} className="text-red-600 mb-2">
                        ✖ {msg}
                    </Text>
                ))}
                <Pressable
                    className="mt-4 bg-blue-500 py-2 px-4 rounded-xl self-center"
                    onPress={onClose}
                >
                    <Text className="text-white">סגור</Text>
                </Pressable>
            </View>
        </View>
    );
}
