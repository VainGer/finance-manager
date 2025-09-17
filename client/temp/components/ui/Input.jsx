import { TextInput, View, Text } from "react-native";
import { useState } from "react";
import { I18nManager } from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**
 * Input - A reusable text input component with RTL support
 * 
 * @param {Object} props
 * @param {string} [props.value=""] - Input value
 * @param {Function} props.onChangeText - Function to call when text changes
 * @param {string} [props.placeholder=""] - Placeholder text
 * @param {boolean} [props.secureTextEntry=false] - Whether to hide text (for passwords)
 * @param {Function} [props.onFocus] - Function to call when input is focused
 * @param {Function} [props.onBlur] - Function to call when input loses focus
 * @param {string} [props.label] - Optional label text
 * @param {string} [props.error] - Optional error message
 * @param {string} [props.className=""] - Additional Tailwind classes
 * @param {Object} [props.style={}] - Additional styles
 * @param {string} [props.keyboardType="default"] - Keyboard type
 * @param {string} [props.icon] - Optional Ionicons icon name
 * @param {boolean} [props.multiline=false] - Whether input can have multiple lines
 * @param {string} [props.accessibilityLabel] - Accessibility label
 * @param {string} [props.accessibilityHint] - Accessibility hint
 * @returns {JSX.Element}
 */
export default function Input({
  value = "",
  onChangeText,
  placeholder = "",
  secureTextEntry = false,
  onFocus,
  onBlur,
  label,
  error,
  className = "",
  style = {},
  keyboardType = "default",
  icon,
  multiline = false,
  accessibilityLabel,
  accessibilityHint,
}) {
  const [focused, setFocused] = useState(false);
  const isRTL = I18nManager.isRTL;
  
  const handleFocus = () => {
    setFocused(true);
    if (onFocus) onFocus();
  };
  
  const handleBlur = () => {
    setFocused(false);
    if (onBlur) onBlur();
  };
  
  return (
    <View className="w-full">
      {label && (
        <Text
          className="text-slate-700 mb-2 font-medium text-right self-end"
          style={{ writingDirection: isRTL ? "rtl" : "ltr", textAlign: "right" }}
        >
          {label}
        </Text>
      )}
      
      <View className={`flex-row items-center border-2 rounded-2xl overflow-hidden ${
        error ? 'border-red-300 bg-red-50/30' : 
        focused ? 'border-blue-400 bg-blue-50/30' : 'border-slate-200 bg-white'
      }`}>
        {icon && (
          <View className="pl-3">
            <Ionicons name={icon} size={20} color={error ? "#f43f5e" : focused ? "#3b82f6" : "#64748b"} />
          </View>
        )}
        
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`flex-1 px-4 py-3 text-slate-800 ${isRTL ? 'text-right' : 'text-left'} ${className}`}
          style={{
            writingDirection: isRTL ? "rtl" : "ltr",
            textAlign: isRTL ? "right" : "left",
            ...style
          }}
          keyboardType={keyboardType}
          multiline={multiline}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
        />
      </View>
      
      {error && (
        <Text className="text-red-500 text-sm mt-1" style={{ writingDirection: isRTL ? "rtl" : "ltr" }}>
          {error}
        </Text>
      )}
    </View>
  );
}
