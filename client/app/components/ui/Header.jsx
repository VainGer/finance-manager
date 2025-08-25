import { View } from "react-native";
import RTLText from "./RTLText";

/**
 * Header - A reusable header component with RTL support
 * 
 * @param {Object} props
 * @param {string} props.title - The main title text
 * @param {string} [props.subtitle] - Optional subtitle text
 * @param {string} [props.titleClassName="text-3xl font-bold text-slate-900"] - Classes for title
 * @param {string} [props.subtitleClassName="text-slate-600 mt-1"] - Classes for subtitle
 * @param {string} [props.containerClassName=""] - Classes for container
 * @param {React.ReactNode} [props.rightElement] - Optional element to display on the right
 * @param {React.ReactNode} [props.leftElement] - Optional element to display on the left
 * @param {boolean} [props.centerTitle=false] - Whether to center the title
 * @returns {JSX.Element}
 */
export default function Header({
  title,
  subtitle,
  titleClassName = "text-3xl font-bold text-slate-900",
  subtitleClassName = "text-slate-600 mt-1",
  containerClassName = "",
  rightElement,
  leftElement,
  centerTitle = false,
}) {
  return (
    <View className={`w-full mb-6 ${containerClassName}`}>
      <View className="flex-row items-center justify-between">
        {rightElement ? (
          <View className="ml-auto">{rightElement}</View>
        ) : <View />}
        
        <View className={centerTitle ? "items-center flex-1" : "flex-1"}>
          <RTLText
            className={titleClassName}
            align={centerTitle ? "center" : "auto"}
          >
            {title}
          </RTLText>
          
          {subtitle && (
            <RTLText
              className={subtitleClassName}
              align={centerTitle ? "center" : "auto"}
            >
              {subtitle}
            </RTLText>
          )}
        </View>
        
        {leftElement ? (
          <View className="mr-auto">{leftElement}</View>
        ) : <View />}
      </View>
    </View>
  );
}
