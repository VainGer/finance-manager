import { View, ActivityIndicator } from "react-native";

/**
 * LoadingSpinner - A reusable loading spinner component
 * 
 * @param {Object} props
 * @param {string} [props.size="large"] - Size of the spinner (small, large)
 * @param {string} [props.color="#0f172a"] - Color of the spinner
 * @param {boolean} [props.fullScreen=false] - Whether to display full screen overlay
 * @param {string} [props.className=""] - Additional Tailwind classes
 * @returns {JSX.Element}
 */
export default function LoadingSpinner({ 
  size = "large", 
  color = "#0f172a",
  fullScreen = false,
  className = "" 
}) {
  if (fullScreen) {
    return (
      <View className={`absolute inset-0 items-center justify-center bg-black/10 z-50 ${className}`}>
        <View className="bg-white p-6 rounded-3xl shadow-lg">
          <ActivityIndicator size={size} color={color} />
        </View>
      </View>
    );
  }
  
  return (
    <View className={`items-center justify-center ${className}`}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}
