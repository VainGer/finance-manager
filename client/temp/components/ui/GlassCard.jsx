import { BlurView } from "expo-blur";
import { View } from "react-native";

/**
 * GlassCard - A reusable glass effect card component with blur
 * 
 * @param {Object} props
 * @param {number} [props.intensity=22] - Blur intensity
 * @param {string} [props.tint="light"] - Blur tint color
 * @param {string} [props.className=""] - Additional Tailwind classes
 * @param {Object} [props.style={}] - Additional styles
 * @param {React.ReactNode} props.children - Child components
 * @param {boolean} [props.hasBorder=true] - Whether the card has a border
 * @returns {JSX.Element}
 */
export default function GlassCard({
  intensity = 22,
  tint = "light",
  className = "",
  style = {},
  children,
  hasBorder = true,
}) {
  return (
    <BlurView 
      intensity={intensity} 
      tint={tint} 
      className={`rounded-3xl overflow-hidden ${className}`}
      style={style}
    >
      <View 
        className={`p-5 ${hasBorder ? "border border-white/40 bg-white/30" : ""}`}
      >
        {children}
      </View>
    </BlurView>
  );
}
