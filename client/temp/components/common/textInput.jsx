import { TextInput } from "react-native";

export default function Input({ value, onChangeText, placeholder, secureTextEntry = false, maxLength }) {
    return (
        <TextInput
            secureTextEntry={secureTextEntry}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            className="border border-gray-300 rounded-md mb-4 p-2 w-full text-center"
            {...(maxLength ? { maxLength } : {})}
        />
    );
}