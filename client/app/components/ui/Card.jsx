import { View, ScrollView } from "react-native";
import GlassCard from "./GlassCard";
import RTLText from "./RTLText";
import { BlurView } from "expo-blur";

/**
 * Card - A simple card component with variants
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.variant="default"] - Card variant (default, glass, outline, elevated)
 * @param {string} [props.className=""] - Additional Tailwind classes
 * @param {Object} [props.style={}] - Additional styles
 * @param {string} [props.title] - Optional card title
 * @param {string} [props.subtitle] - Optional card subtitle
 * @param {React.ReactNode} [props.headerRight] - Optional right header content
 * @param {boolean} [props.scrollable=false] - Whether content is scrollable
 * @param {number} [props.maxHeight] - Maximum height for scrollable content
 * @returns {JSX.Element}
 */
export default function Card({
  children,
  variant = "default",
  className = "",
  style = {},
  title,
  subtitle,
  headerRight,
  scrollable = false,
  maxHeight,
}) {

  const header = (title || headerRight) ? (
    <View className="mb-3">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          {title && (
            <RTLText className="text-lg font-semibold text-slate-900">
              {title}
            </RTLText>
          )}
          {subtitle && (
            <RTLText className="text-sm text-slate-500 mt-0.5">
              {subtitle}
            </RTLText>
          )}
        </View>
        {headerRight && (
          <View>{headerRight}</View>
        )}
      </View>
    </View>
  ) : null;


  const content = scrollable ? (
    <ScrollView 
      style={{ maxHeight: maxHeight || 300 }}
      showsVerticalScrollIndicator={true}
    >
      {children}
    </ScrollView>
  ) : children;


  switch (variant) {
    case "glass":
      return (
        <GlassCard className={className} style={style}>
          {header}
          {content}
        </GlassCard>
      );
    
    case "outline":
      return (
        <View className={`border border-slate-200 rounded-2xl p-4 ${className}`} style={style}>
          {header}
          {content}
        </View>
      );
    
    case "elevated":
      return (
        <View 
          className={`bg-white rounded-2xl p-4 ${className}`} 
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
            ...style
          }}
        >
          {header}
          {content}
        </View>
      );
    
    default:
      return (
        <View className={`bg-white rounded-2xl p-4 ${className}`} style={style}>
          {header}
          {content}
        </View>
      );
  }
}
