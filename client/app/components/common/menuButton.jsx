import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useState, useMemo } from "react";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function MenuButton({
    onPress,
    icon,
    text,
    variant = "default",
    ViewClassName = "flex-row items-center bg-white border border-slate-200 rounded-xl shadow-lg mb-4 py-4 px-4",
    TextClassName = "text-slate-800 font-bold",
}) {
    const [pressed, setPressed] = useState(false);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: withSpring(pressed ? 0.97 : 1) }],
        };
    }, [pressed]);


    const finalViewClass = useMemo(() => {
        if (icon === "trash-outline" || variant === "danger") {
            return ViewClassName.replace("border-slate-200", "border-red-500");
        }
        return ViewClassName;
    }, [ViewClassName, icon, variant]);

    const finalTextClass = useMemo(() => {
        if (icon === "trash-outline" || variant === "danger") {
            return TextClassName.replace("text-slate-800", "text-red-500");
        }
        return TextClassName;
    }, [TextClassName, icon, variant]);

    return (
        <AnimatedPressable
            style={animatedStyle}
            onPress={onPress}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            className={finalViewClass}
        >

            <View className="w-8 items-center justify-center ml-20 mr-4">
                <Ionicons
                    name={icon}
                    size={20}
                    color={icon === "trash-outline" || variant === "danger" ? "#ef4444" : "#3b82f6"}
                />
            </View>

            <Text className={finalTextClass}>{text}</Text>
        </AnimatedPressable>
    );
}
