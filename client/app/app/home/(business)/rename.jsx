import { useState, useEffect } from "react";
import { View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useEditBusinesses from "../../../hooks/useEditBusiness";
import CategorySelect from "../../../components/categories/categorySelect";
import BusinessSelect from "../../../components/business/businessSelect";
import LoadingSpinner from "../../../components/common/loadingSpinner";
import Button from "../../../components/common/button";

export default function RenameBusinessScreen() {
  const {
    renameBusiness,
    goBack,
    error,
    success,
    resetState,
    loading,
    categories,
    categoriesLoading,
    categoriesErrors,
    businesses,
    businessesLoading,
    businessesErrors,
  } = useEditBusinesses();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [newName, setNewName] = useState("");
  const [businessesList, setBusinessesList] = useState([]);

  useEffect(() => {
    return () => resetState();
  }, []);

  useEffect(() => {
    const businessData =
      businesses.find((b) => b.category === selectedCategory)?.businesses || [];
    setSelectedBusiness("");
    setBusinessesList(businessData);
  }, [selectedCategory, businesses]);

  const handleSubmit = () => {
    renameBusiness(selectedCategory, selectedBusiness, newName);
  };

  const displayError =
    error || categoriesErrors?.[0] || businessesErrors?.[0] || null;

  if (loading || categoriesLoading || businessesLoading) {
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
          <Text className="text-3xl font-bold text-slate-800">עדכון שם עסק</Text>
          <View className="h-1.5 w-16 bg-blue-500 rounded-full mt-3" />
        </View>

        {/* Status/Error Messages */}
        {displayError && (
          <View className="bg-red-50 border-2 border-red-200 rounded-xl py-3 px-4 mb-6">
            <View className="flex-row-reverse items-center justify-center">
              <Ionicons name="alert-circle" size={20} color="#DC2626" />
              <Text className="text-base text-right text-red-600 mr-2 font-medium">
                {displayError}
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
        <View className="mb-6">
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

        {/* Business Selection */}
        {selectedCategory && (
          <View className="mb-6">
            <Text className="text-slate-800 font-bold mb-3 text-lg text-right">
              בחר עסק
            </Text>
            <View className="border-2 border-gray-300 rounded-xl overflow-hidden">
              <BusinessSelect
                selectedCategory={selectedCategory}
                initialValue={selectedBusiness}
                businesses={businessesList}
                loading={businessesLoading}
                error={businessesErrors?.[0] ?? null}
                setSelectedBusiness={setSelectedBusiness}
              />
            </View>
          </View>
        )}

        {/* New Name Input */}
        {selectedBusiness && (
          <View className="mb-8">
            <Text className="text-slate-800 font-bold mb-3 text-lg text-right">
              שם עסק חדש
            </Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="הזן שם עסק חדש"
              placeholderTextColor="#9CA3AF"
              className="w-full px-5 py-4 text-right bg-white border-2 border-gray-300 rounded-xl"
              style={{ textAlign: "right", fontSize: 17 }}
            />
          </View>
        )}

        {/* Buttons */}
        <View className="justify-between w-full mx-auto">
          <Button
            className="py-3 rounded-lg mb-2"
            style="primary"
            onPress={handleSubmit}
            disabled={!selectedBusiness || !newName.trim() || loading}
          >
            <View className="flex-row items-center">
              <Ionicons name="create" size={20} color="white" />
              <Text className="text-white font-bold text-center ml-2">עדכן שם</Text>
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
