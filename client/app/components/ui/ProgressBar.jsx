import { View } from "react-native";
import RTLText from "./RTLText";

/**
 * ProgressBar - A reusable progress bar component
 * 
 * @param {Object} props
 * @param {number} props.value - Current value (0-100)
 * @param {number} [props.max=100] - Maximum value
 * @param {string} [props.color="bg-blue-500"] - Bar color class
 * @param {string} [props.bgColor="bg-slate-200"] - Background color class
 * @param {boolean} [props.showPercent=false] - Whether to show percentage
 * @param {string} [props.height="h-2"] - Height class
 * @param {string} [props.label] - Optional label text
 * @param {string} [props.containerClassName=""] - Container class name
 * @returns {JSX.Element}
 */
export default function ProgressBar({
  value,
  max = 100,
  color = "bg-blue-500",
  bgColor = "bg-slate-200",
  showPercent = false,
  height = "h-2",
  label,
  containerClassName = "",
}) {
  const percent = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);
  
  return (
    <View className={`w-full ${containerClassName}`}>
      {label && (
        <View className="flex-row justify-between mb-1">
          <RTLText className="text-sm text-slate-700">{label}</RTLText>
          {showPercent && (
            <RTLText className="text-sm text-slate-700">{percent}%</RTLText>
          )}
        </View>
      )}
      
      <View className={`w-full ${height} ${bgColor} rounded-full overflow-hidden`}>
        <View
          className={`${height} ${color} rounded-full`}
          style={{ width: `${percent}%` }}
        />
      </View>
      
      {!label && showPercent && (
        <RTLText className="text-xs text-slate-500 mt-1 text-right">
          {percent}%
        </RTLText>
      )}
    </View>
  );
}
