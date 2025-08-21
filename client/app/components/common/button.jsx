import { useState } from "react";
import { Pressable, Text } from "react-native";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Button({
    onPress,
    children,
    style = "primary",
    size = "medium",
    disabled = false,
    className = "",
    bg,
    textClass = "text-white"
}) {
    const [pressed, setPressed] = useState(false);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: withSpring(pressed ? 0.97 : 1) }],
        };
    }, [pressed]);

    const getSizeClasses = (size) => {
        switch (size) {
            case "small":
                return "px-3 py-1.5 rounded-md";
            case "medium":
                return "px-6 py-2 rounded-lg";
            case "large":
                return "px-8 py-3 rounded-lg";
            default:
                return "px-6 py-2 rounded-lg";
        }
    };

    const getButtonStyle = (style) => {
        if (bg) {
            return `${bg}`;
        }
        switch (style) {
            case "primary":
                return "bg-blue-500";
            case "secondary":
                return "bg-gray-300";
            case "success":
                return "bg-green-500";
            case "danger":
                return "bg-red-500";
            case "warning":
                return "bg-yellow-500";
            case "info":
                return "bg-indigo-500";
            case "outline":
                return "border border-blue-500";
            case "link":
                return "bg-transparent text-blue-500 underline";
            default:
                return "bg-blue-500";
        }
    };

    const buttonClass = `
        ${getButtonStyle(style)} 
        ${style !== "link" ? getSizeClasses(size) : ""}
        items-center justify-center
        font-medium
        ${className.includes("w-") ? "" : "w-full"}
        ${disabled ? "opacity-50" : ""}
        ${className}
        mb-4
    `.trim();


    return (
        <AnimatedPressable
            onPress={onPress}
            disabled={disabled}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            className={buttonClass}
            style={[
                animatedStyle,
                bg ? { backgroundColor: bg } : null
            ]}
        >
            {typeof children === "string" ? (
                <Text className={`${textClass}`}>{children}</Text>
            ) : (
                children
            )}
        </AnimatedPressable>
    );
}
