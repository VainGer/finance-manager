import { useEffect, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import CategorySelect from "../../../components/categories/categorySelect";
import useEditBusinesses from "../../../hooks/useEditBusiness";
import LoadingSpinner from "../../../components/common/loadingSpinner";
import Button from "../../../components/common/button";

export default function CreateBusinessScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState(null);

  const {
    addBusiness,
    error,
    success,
    loading,
    categories,
    categoriesLoading,
    categoriesErrors,
    goBack,
    resetState,
  } = useEditBusinesses({ goBack: () => router.back() });

  useEffect(() => {
    return () => resetState();
  }, []);

  const handleSubmit = () => {
    addBusiness(category, name, setName);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View className="flex-1 bg-gray-50 items-center justify-center px-6">
      <View pointerEvents="none" className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-300/20" />
      <View pointerEvents="none" className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/20" />
      <View pointerEvents="none" className="absolute top-1/3 right-10 h-24 w-24 rounded-full bg-white/20 blur-md" />
      <View className="bg-white rounded-2xl shadow-lg p-6 w-full" style={{ maxWidth: 400 }}>
        {/* Title */}
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-slate-800">הוספת עסק</Text>
          <View className="h-1.5 w-16 bg-blue-500 rounded-full mt-3" />
        </View>

        {/* Status Messages */}
        {error && (
          <View className="bg-red-50 border-2 border-red-200 rounded-xl py-3 px-4 mb-6">
            <View className="flex-row-reverse items-center justify-center">
              <Ionicons name="alert-circle" size={20} color="#DC2626" />
              <Text className="text-base text-right text-red-600 mr-2 font-medium">
                {error}
              </Text>
            </View>
          </View>
        )}

        {success && (
          <View className="bg-green-50 border-2 border-green-200 rounded-xl py-3 px-4 mb-6">
            <View className="flex-row-reverse items-center justify-center">
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text className="text-base text-right text-green-600 mr-2 font-medium">
                {success}
              </Text>
            </View>
          </View>
        )}

        {/* Category Selection */}
        <View className="mb-7">
          <Text className="text-slate-800 font-bold mb-3 text-lg text-right">
            בחר קטגוריה
          </Text>
          <View className="border-2 border-gray-300 rounded-xl overflow-hidden">
            <CategorySelect
              initialValue={category}
              categories={categories}
              loading={categoriesLoading}
              error={categoriesErrors?.[0] ?? null}
              setSelectedCategory={setCategory}
            />
          </View>
        </View>

        {/* Business Name Input */}
        <View className="mb-8">
          <Text className="text-slate-800 font-bold mb-3 text-lg text-right">
            שם העסק
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="הזן שם עסק חדש"
            placeholderTextColor="#9CA3AF"
            className="w-full px-5 py-4 text-right bg-white border-2 border-gray-300 rounded-xl"
            style={{ textAlign: "right", fontSize: 17 }}
          />
        </View>

        {/* Buttons */}
        <View className="justify-between w-full mx-auto">
          <Button
            className="py-3 rounded-lg mb-2"
            style="primary"
            onPress={handleSubmit}
            disabled={!category || !name.trim()}
          >
            <View className="flex-row items-center">
              <Ionicons name="business" size={20} color="white" />
              <Text className="text-white font-bold text-center ml-2">
                הוסף עסק
              </Text>
            </View>
          </Button>

          <Button className="py-3 rounded-lg" style="secondary" onPress={goBack}>
            ביטול
          </Button>
        </View>
      </View>
    </View>
  );
}
