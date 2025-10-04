import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import LoadingSpinner from "../../../components/common/loadingSpinner";
import useEditCategories from "../../../hooks/useEditCategories";
import Button from "../../../components/common/button";

export default function CreateCategoryScreen() {
    const {
        addCategory,
        goBack,
        error,
        success,
        loading,
        resetState,
    } = useEditCategories();

    const [categoryName, setCategoryName] = useState("");

    useEffect(() => {
        return () => resetState();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }


    return (
        <View className="flex-1 bg-gray-50 items-center justify-center px-6">
            <View pointerEvents="none" className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-300/20" />
            <View pointerEvents="none" className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/20" />
            <View pointerEvents="none" className="absolute top-1/3 right-10 h-24 w-24 rounded-full bg-white/20 blur-md" />
            <View
                className="bg-white rounded-2xl shadow-lg p-6 w-full"
                style={{ maxWidth: 400, minHeight: 320 }}
            >
                {/* Title */}
                <View className="items-center mb-8">
                    <Text className="text-3xl font-bold text-slate-800">
                        הוספת קטגוריה
                    </Text>
                    <View className="h-1.5 w-16 bg-blue-500 rounded-full mt-3" />
                </View>

                {/* Status Messages */}
                {error && (
                    <View className="bg-red-50 border-2 border-red-200 rounded-xl py-3 px-4 mb-6">
                        <View className="flex-row-reverse items-center w-max mx-auto">
                            <Ionicons name="alert-circle" size={20} color="#DC2626" />
                            <Text className="text-base text-right text-red-600 mr-2 font-medium">
                                {error}
                            </Text>
                        </View>
                    </View>
                )}

                {success && (
                    <View className="bg-green-50 border-2 border-green-200 rounded-xl py-3 px-4 mb-6">
                        <View className="flex-row-reverse items-center w-max mx-auto">
                            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                            <Text className="text-base text-right text-green-600 mr-2 font-medium">
                                {success}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Form */}
                <View className="mb-8">
                    <Text className="text-slate-800 font-bold mb-4 text-lg text-center">
                        שם הקטגוריה
                    </Text>
                    <TextInput
                        value={categoryName}
                        onChangeText={setCategoryName}
                        placeholder="הזן שם קטגוריה חדש"
                        placeholderTextColor="#9CA3AF"
                        className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-xl text-center"
                        style={{ textAlign: "right", fontSize: 17 }}
                    />
                </View>

                {/* Action Buttons */}
                <View className="justify-between w-full mx-auto">
                    <Button className="py-3 rounded-lg" onPress={() => addCategory(categoryName, setCategoryName)}>
                        <View className="flex-row items-center">
                            <Ionicons name="add-circle" size={20} color="white" />
                            <Text className="text-white font-bold text-center ml-2">
                                הוסף קטגוריה
                            </Text>
                        </View>
                    </Button>
                    <Button className="py-3 rounded-lg" onPress={goBack} style="secondary">ביטול</Button>
                </View>
            </View>
        </View>
    );
}
