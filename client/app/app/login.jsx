import { useState } from 'react';
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/common/button.jsx";
import Input from '../components/common/textInput.jsx';
import LoadingSpinner from "../components/common/loadingSpinner.jsx";
import useLogin from "../hooks/auth/useLogin.js";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { error, loading, login } = useLogin({ setPassword });
    return (
        <SafeAreaView className="bg-white dark:bg-black h-full">
            <View className="flex-1 justify-center items-center bg-white">
                {loading && <LoadingSpinner />}
                <View className="w-3/4">
                    <Text>Login Screen</Text>
                    {error && <Text className="text-red-500">{error}</Text>}
                    <Input placeholder="שם משתמש" value={username} onChangeText={setUsername} />
                    <Input placeholder="סיסמה" secureTextEntry={true} value={password} onChangeText={setPassword} />
                    <Button onPress={() => login(username, password)}>התחבר</Button>
                </View>
            </View>
        </SafeAreaView>
    );
}
