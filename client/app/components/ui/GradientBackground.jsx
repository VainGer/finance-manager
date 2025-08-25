import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";

/**
 * GradientBackground - A reusable gradient background component
 * 
 * @param {Object} props
 * @param {Array} [props.colors] - Array of colors for the gradient
 * @param {Object} [props.start] - Start position {x, y}
 * @param {Object} [props.end] - End position {x, y}
 * @param {Object} [props.style] - Additional styles
 * @param {React.ReactNode} props.children - Child components
 * @param {boolean} [props.withDecorations] - Whether to include decorative elements
 * @returns {JSX.Element}
 */
export default function GradientBackground({
  colors = ["#f8fafc", "#eef2f7", "#e5eaf1"],
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style = { flex: 1 },
  children,
  withDecorations = false,
}) {
  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={style}
    >
      {withDecorations && (
        <>
          <View pointerEvents="none" className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-300/20" />
          <View pointerEvents="none" className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/20" />
          <View pointerEvents="none" className="absolute top-1/3 right-10 h-24 w-24 rounded-full bg-white/20 blur-md" />
        </>
      )}
      {children}
    </LinearGradient>
  );
}
