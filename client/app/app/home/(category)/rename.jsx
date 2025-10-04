import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useEditCategories from "../../../hooks/useEditCategories";
import CategorySelect from "../../../components/categories/categorySelect";
import Button from "../../../components/common/button";
import LoadingSpinner from "../../../components/common/loadingSpinner";

export default function RenameCategoryScreen() {
  const {
    renameCategory,
    goBack,
    error,
    success,
    resetState,
    loading,
    categories,
    categoriesLoading,
    categoriesErrors,
  } = useEditCategories();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    return () => resetState();
  }, []);

  const handleRename = () => {
    renameCategory(
      selectedCategory,
      newCategoryName,
      setNewCategoryName,
      setSelectedCategory
    );
  };

  const displayError = error || (categoriesErrors?.[0] ?? null);

  if (loading && !categoriesLoading) {
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
          <Text className="text-3xl font-bold text-slate-800">שינוי שם קטגוריה</Text>
          <View className="h-1.5 w-16 bg-blue-500 rounded-full mt-3" />
        </View>

        {/* Status Messages */}
        {displayError && (
          <View className="bg-red-50 border border-red-200 rounded-lg py-2 px-3 mb-4">
            <View className="flex-row-reverse items-center w-max mx-auto">
              <Ionicons name="alert-circle" size={20} color="#DC2626" />
              <Text className="text-sm text-right text-red-600 mr-2">
                {displayError}
              </Text>
            </View>
          </View>
        )}

        {success && (
          <View className="bg-green-50 border border-green-200 rounded-lg py-3 px-4 mb-4">
            <View className="flex-row-reverse items-center w-max mx-auto">
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text className="text-sm text-right text-green-600 mr-2">
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
              initialValue={selectedCategory}
              categories={categories}
              loading={categoriesLoading}
              error={categoriesErrors?.[0] ?? null}
              setSelectedCategory={setSelectedCategory}
            />
          </View>
        </View>

        {/* New Category Name */}
        <View className="mb-8">
          <Text className="text-slate-800 font-bold mb-3 text-lg text-right">
            שם קטגוריה חדש
          </Text>
          <TextInput
            className="w-full px-5 py-4 text-right bg-white border-2 border-gray-300 rounded-xl"
            style={{ textAlign: "right", fontSize: 17 }}
            placeholder="הזן שם קטגוריה חדש"
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Action Buttons */}
        <View className="justify-between w-full mx-auto">
          <Button className="py-3 rounded-lg" onPress={() => handleRename()} style="primary" disabled={loading || categoriesLoading}>
            <View className="flex-row items-center">
              <Ionicons name="create" size={20} color="white" />
              <Text className="text-white font-bold text-center ml-2">
                שנה שם קטגוריה
              </Text>
            </View>
          </Button>
          <Button className="py-3 rounded-lg" onPress={goBack} style="secondary">ביטול</Button>
        </View>
      </View>
    </View>
  );
}
