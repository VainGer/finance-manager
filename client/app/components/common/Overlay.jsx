import { Modal, View, TouchableWithoutFeedback } from "react-native";

export default function Overlay({ children, onClose, visible = true, animationType = "fade" }) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType={animationType}
            onRequestClose={onClose}
        >
            <View className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                {/* Close on backdrop press */}
                <TouchableWithoutFeedback onPress={onClose}>
                    <View className="absolute top-0 left-0 right-0 bottom-0" />
                </TouchableWithoutFeedback>

                {/* Content */}
                <View className="bg-white p-6 rounded-2xl w-11/12 max-h-[80%]">
                    {children}
                </View>
            </View>
        </Modal>
    );
}
