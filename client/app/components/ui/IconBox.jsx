import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**
 * IconBox - A reusable component for displaying an icon in a styled box
 * 
 * @param {Object} props
 * @param {string} props.iconName - Name of the Ionicons icon
 * @param {number} [props.iconSize=32] - Size of the icon
 * @param {string} [props.iconColor="#ffffff"] - Color of the icon
 * @param {Array} [props.colors] - Colors for gradient background
 * @param {string} [props.className=""] - Additional Tailwind classes for container
 * @param {Object} [props.style={}] - Additional styles for container
 * @param {boolean} [props.useGradient=true] - Whether to use gradient or solid background
 * @param {string} [props.solidColor="#ffffff"] - Solid background color if not using gradient
 * @returns {JSX.Element}
 */
export default function IconBox({
  iconName,
  iconSize = 32,
  iconColor = "#ffffff",
  colors = ["#1e293b", "#334155"],
  className = "w-16 h-16 rounded-2xl items-center justify-center",
  style = {},
  useGradient = true,
  solidColor = "#ffffff"
}) {
  const shadowStyle = { 
    shadowColor: "#1e293b", 
    shadowOpacity: 0.3, 
    shadowOffset: { width: 0, height: 8 }, 
    shadowRadius: 16, 
    elevation: 12,
    ...style
  };

  if (useGradient) {
    return (
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={className}
        style={shadowStyle}
      >
        <Ionicons name={iconName} size={iconSize} color={iconColor} />
      </LinearGradient>
    );
  }

  return (
    <View 
      className={className}
      style={{ 
        backgroundColor: solidColor,
        ...shadowStyle 
      }}
    >
      <Ionicons name={iconName} size={iconSize} color={iconColor} />
    </View>
  );
}
