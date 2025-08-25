import React from "react";
import { Pressable, Text, View, ActivityIndicator } from "react-native";

/**
 * Button - A reusable button component with various styles and states
 * 
 * @param {Object} props
 * @param {Function} props.onPress - Function to call when button is pressed
 * @param {React.ReactNode} props.children - Button content/text
 * @param {string} [props.variant="primary"] - Button style variant (primary, secondary, outline, danger)
 * @param {boolean} [props.loading=false] - Whether the button is in loading state
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {string} [props.className=""] - Additional Tailwind classes
 * @param {Object} [props.style={}] - Additional style object
 * @param {string} [props.size="default"] - Button size (small, default, large)
 * @returns {JSX.Element}
 */
export default function Button({
  onPress,
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  style = {},
  size = "default",
}) {
  // Determine the button styles based on variant
  let variantClasses = "";
  let textColorClass = "";
  
  switch (variant) {
    case "primary":
      variantClasses = "bg-slate-900";
      textColorClass = "text-white";
      break;
    case "secondary":
      variantClasses = "bg-slate-100";
      textColorClass = "text-slate-800";
      break;
    case "outline":
      variantClasses = "bg-transparent border border-slate-300";
      textColorClass = "text-slate-800";
      break;
    case "danger":
      variantClasses = "bg-red-600";
      textColorClass = "text-white";
      break;
    default:
      variantClasses = "bg-slate-900";
      textColorClass = "text-white";
  }
  
  // Determine size classes
  let sizeClasses = "";
  let textSizeClass = "";
  
  switch (size) {
    case "small":
      sizeClasses = "py-2 px-4";
      textSizeClass = "text-sm";
      break;
    case "large":
      sizeClasses = "py-5 px-8";
      textSizeClass = "text-lg";
      break;
    default:
      sizeClasses = "py-4 px-6";
      textSizeClass = "text-base";
  }
  
  // Handle disabled state
  if (disabled || loading) {
    variantClasses = "bg-slate-300";
    textColorClass = "text-slate-500";
  }
  
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`rounded-2xl items-center ${variantClasses} ${sizeClasses} ${className}`}
      style={({ pressed }) => ({
        opacity: (pressed && !disabled && !loading) ? 0.9 : 1,
        transform: [{ scale: (pressed && !disabled && !loading) ? 0.98 : 1 }],
        ...style,
      })}
    >
      {loading ? (
        <View className="flex-row items-center">
          <Text className={`font-semibold ${textSizeClass} ${textColorClass} mr-2`}>
            {typeof children === 'string' ? children : 'טוען...'}
          </Text>
          <ActivityIndicator size="small" color={variant === "secondary" || variant === "outline" ? "#1e293b" : "#ffffff"} />
        </View>
      ) : (
        <Text className={`font-semibold ${textSizeClass} ${textColorClass}`}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}
