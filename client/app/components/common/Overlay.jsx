import { View, TouchableWithoutFeedback } from "react-native";

export default function Overlay({ children, onClose }) {
    return (
        <View className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="absolute top-0 left-0 right-0 bottom-0" />
            </TouchableWithoutFeedback>
            <View className="bg-white p-6 rounded-lg w-11/12 max-h-4/5">
                {children}
            </View>
        </View>
    );
}