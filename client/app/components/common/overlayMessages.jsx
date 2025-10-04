import { View, Text } from "react-native";
import Overlay from "./Overlay";
import Button from "./button";

export default function OverlayMessages({ errors = [], successes = [], onClose }) {
    return (
        <Overlay onClose={onClose}>
            <View className="w-full max-w-md">
                {/* Success messages */}
                {successes.length > 0 && (
                    <View className="mb-4">
                        {successes.map((msg, idx) => (
                            <Text
                                key={`s-${idx}`}
                                className="text-green-600 mb-2 text-center text-lg font-semibold"
                            >
                                ✔ {msg}
                            </Text>
                        ))}
                    </View>
                )}

                {/* Error messages */}
                {errors.length > 0 && (
                    <View className="mb-4">
                        {errors.map((msg, idx) => (
                            <Text
                                key={`e-${idx}`}
                                className="text-red-600 mb-2 text-center text-lg font-semibold"
                            >
                                ✖ {msg}
                            </Text>
                        ))}
                    </View>
                )}

                <Button onPress={onClose} style="primary">
                    סגור
                </Button>
            </View>
        </Overlay>
    );
}
