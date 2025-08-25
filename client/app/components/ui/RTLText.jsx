import { Text, View } from "react-native";
import { I18nManager } from "react-native";

/**
 * RTLText - A text component with proper RTL support
 * 
 * @param {Object} props
 * @param {string} props.children - Text content
 * @param {string} [props.className=""] - Additional Tailwind classes
 * @param {Object} [props.style={}] - Additional styles
 * @param {boolean} [props.forceRTL=false] - Force RTL direction regardless of system setting
 * @param {string} [props.align="auto"] - Text alignment (auto, right, left, center)
 * @returns {JSX.Element}
 */
export default function RTLText({ 
  children, 
  className = "", 
  style = {}, 
  forceRTL = false,
  align = "auto" 
}) {
  const isRTL = forceRTL || I18nManager.isRTL;
  
  let textAlign = "auto";
  if (align === "right") textAlign = "right";
  else if (align === "left") textAlign = "left";
  else if (align === "center") textAlign = "center";
  else textAlign = isRTL ? "right" : "left";

  return (
    <Text
      className={className}
      style={{
        writingDirection: isRTL ? "rtl" : "ltr",
        textAlign,
        ...style
      }}
    >
      {children}
    </Text>
  );
}
