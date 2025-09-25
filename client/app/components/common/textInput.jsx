import { TextInput } from "react-native";

export default function Input({ value, onChangeText, placeholder, secureTextEntry = false, maxLength, numeric = false }) {
    return (
        <TextInput
            secureTextEntry={secureTextEntry}
            value={value}
            onChangeText={onChangeText}
            keyboardType={numeric ? "numeric" : "default"}
            placeholder={placeholder}
            className="border border-gray-300 rounded-md mb-4 p-2 w-full text-center"
            {...(maxLength ? { maxLength } : {})}
        />
    );
}