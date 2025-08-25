import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RTLText from "./RTLText";
import { I18nManager } from "react-native";

/**
 * IconWithText - A component for displaying an icon with text (RTL-aware)
 * 
 * @param {Object} props
 * @param {string} props.iconName - Name of the Ionicons icon
 * @param {number} [props.iconSize=20] - Size of the icon
 * @param {string} [props.iconColor="#64748b"] - Color of the icon
 * @param {string} props.text - Text to display
 * @param {string} [props.textClassName="text-base text-slate-500"] - Classes for the text
 * @param {string} [props.containerClassName="mt-4"] - Classes for the container
 * @param {number} [props.spacing=8] - Spacing between icon and text
 * @param {boolean} [props.forceRTL=false] - Force RTL regardless of system setting
 * @returns {JSX.Element}
 */
export default function IconWithText({
  iconName,
  iconSize = 20,
  iconColor = "#64748b",
  text,
  textClassName = "text-base text-slate-500 leading-6",
  containerClassName = "mt-4",
  spacing = 8,
  forceRTL = false
}) {
  const isRTL = forceRTL || I18nManager.isRTL;
  
  // Set the right flexDirection and marginProp based on RTL
  const flexDirection = isRTL ? "flex-row-reverse" : "flex-row";
  const marginProp = isRTL ? { marginRight: spacing } : { marginLeft: spacing };
  const iconMarginProp = isRTL ? { marginLeft: spacing } : { marginRight: spacing };
  
  return (
    <View className={`${flexDirection} items-center ${containerClassName}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <Ionicons name={iconName} size={iconSize} color={iconColor} style={iconMarginProp} />
      <RTLText className={textClassName} forceRTL={forceRTL}>
        {text}
      </RTLText>
    </View>
  );
}
