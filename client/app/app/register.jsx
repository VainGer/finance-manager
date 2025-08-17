import { View, Text, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from 'react';
import useRegister from "../hooks/auth/useRegister.js";
import Button from "../components/common/button.jsx";
import TextInput from '../components/common/textInput.jsx';
import LoadingSpinner from "../components/common/loadingSpinner.jsx";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { error, loading, register } = useRegister({ setPassword, setUsername, setConfirmPassword });
    return (
        <SafeAreaView className="bg-white dark:bg-black h-full">
            <View className="flex-1 justify-center items-center bg-white">
                {loading && <LoadingSpinner />}
                <Text>Register Screen</Text>
                {error && <Text>{error}</Text>}
                <TextInput
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                />
                <TextInput
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                />
                <Button onPress={() => register(username, password, confirmPassword)} disabled={loading}>
                    הרשמה
                </Button>
            </View>
        </SafeAreaView>
    );
}
