import { View, Text } from "react-native";

/**
 * Divider - A divider line with optional text
 * 
 * @param {Object} props
 * @param {string} [props.text] - Optional text to display in the center
 * @param {string} [props.lineColor="bg-white/50"] - Color class for the divider lines
 * @param {string} [props.textColor="text-slate-500"] - Color class for the text
 * @param {string} [props.className=""] - Additional classes for the container
 * @returns {JSX.Element}
 */
export default function Divider({ 
  text, 
  lineColor = "bg-white/50", 
  textColor = "text-slate-500",
  className = "my-3" 
}) {
  if (!text) {
    return <View className={`h-[1px] ${lineColor} ${className}`} />;
  }

  return (
    <View className={`flex-row items-center ${className}`}>
      <View className={`flex-1 h-[1px] ${lineColor}`} />
      <Text className={`mx-3 text-xs ${textColor}`}>{text}</Text>
      <View className={`flex-1 h-[1px] ${lineColor}`} />
    </View>
  );
}
