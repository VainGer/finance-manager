import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useEditBusinesses from "../../../hooks/useEditBusiness";
import CategorySelect from "../../../components/categories/categorySelect";
import BusinessSelect from "../../../components/business/businessSelect";
import LoadingSpinner from "../../../components/common/loadingSpinner";
import Button from "../../../components/common/button";

export default function DeleteBusinessScreen() {
  const {
    loading,
    deleteBusiness,
    error,
    success,
    goBack,
    resetState,
    categories,
    categoriesLoading,
    categoriesErrors,
    businesses,
    businessesLoading,
    businessesErrors,
  } = useEditBusinesses();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    return () => resetState();
  }, []);

  const displayError = error || categoriesErrors?.[0] || businessesErrors?.[0] || null;

  const handleDelete = () => {
    deleteBusiness(selectedCategory, selectedBusiness);
  };


  if (loading || categoriesLoading || businessesLoading) {
    return <LoadingSpinner />;
  }

  // ✅ Success Screen
  if (success) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-6">
        <View className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
          <View className="items-center mb-8">
            <Ionicons name="checkmark-circle" size={80} color="#10b981" />
            <Text className="text-3xl font-bold text-slate-800 mt-4">פעולה הושלמה</Text>
            <View className="h-1.5 w-16 bg-green-500 rounded-full mt-3" />
          </View>

          <View className="bg-green-50 border-2 border-green-200 rounded-xl py-4 px-5 mb-8">
            <Text className="text-green-700 text-center font-bold text-lg">{success}</Text>
          </View>

          <Button className="py-3 rounded-lg" onPress={goBack} style="primary">
            <View className="flex-row items-center justify-center">
              <Ionicons name="arrow-forward" size={20} color="white" />
              <Text className="text-white font-bold ml-2">חזרה לתפריט</Text>
            </View>
          </Button>
        </View>
      </View>
    );
  }

  // ⚠️ Confirmation Screen
  if (showConfirm && !error) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-6">
        <View className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
          <View className="items-center mb-8">
            <Ionicons name="alert-circle" size={60} color="#ef4444" />
            <Text className="text-2xl font-bold text-red-600 mt-4">אישור מחיקה</Text>
            <View className="h-1.5 w-16 bg-red-500 rounded-full mt-3" />
          </View>

          <View className="bg-red-50 border-2 border-red-200 rounded-xl p-5 mb-8">
            <Text className="text-center text-red-700 font-bold mb-3 text-lg">
              האם אתה בטוח שברצונך למחוק את העסק "{selectedBusiness}"?
            </Text>
            <Text className="text-center text-red-600">
              פעולה זו אינה ניתנת לביטול.
            </Text>
          </View>

          <View>
            <Button className="py-3 rounded-lg" style="danger" onPress={handleDelete}>
              <View className="flex-row items-center">
                <Ionicons name="trash" size={20} color="white" />
                <Text className="text-white font-bold text-center ml-2">מחק עסק</Text>
              </View>
            </Button>
            <Button className="py-3 rounded-lg" style="secondary" onPress={() => setShowConfirm(false)}>
              ביטול
            </Button>
          </View>
        </View>
      </View>
    );
  }

  // 🧱 Main Screen
  return (
    <View className="flex-1 bg-gray-50 items-center justify-center px-6">
      <View pointerEvents="none" className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-300/20" />
      <View pointerEvents="none" className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/20" />
      <View pointerEvents="none" className="absolute top-1/3 right-10 h-24 w-24 rounded-full bg-white/20 blur-md" />
      <View className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        {/* Title */}
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-slate-800">מחיקת עסק</Text>
          <View className="h-1.5 w-16 bg-red-500 rounded-full mt-3" />
        </View>

        {/* Errors */}
        {displayError && (
          <View className="bg-red-50 border-2 border-red-200 rounded-xl py-3 px-4 mb-6">
            <Text className="text-base text-center text-red-600 font-medium">{displayError}</Text>
          </View>
        )}

        {/* Category Selection */}
        <View className="mb-6">
          <Text className="text-slate-800 font-bold mb-3 text-lg text-right">בחר קטגוריה</Text>
          <View className="border-2 border-gray-300 rounded-xl overflow-hidden">
            <CategorySelect
              categories={categories}
              setSelectedCategory={setSelectedCategory}
              loading={categoriesLoading}
              error={categoriesErrors?.[0] ?? null}
              initialValue={selectedCategory}
            />
          </View>
        </View>

        {/* Business Selection */}
        {selectedCategory && (
          <View className="mb-8">
            <Text className="text-slate-800 font-bold mb-3 text-lg text-right">בחר עסק</Text>
            <View className="border-2 border-gray-300 rounded-xl overflow-hidden">
              <BusinessSelect
                selectedCategory={selectedCategory}
                businesses={businesses.find(b => b.category === selectedCategory)?.businesses || []}
                loading={businessesLoading}
                error={businessesErrors?.[0] ?? null}
                setSelectedBusiness={setSelectedBusiness}
                initialValue={selectedBusiness}
              />
            </View>
          </View>
        )}

        {/* Buttons */}
        <View className="justify-between w-full mx-auto">
          <Button
            className="py-3 rounded-lg"
            style="danger"
            disabled={!selectedBusiness}
            onPress={() => setShowConfirm(true)}
          >
            <View className="flex-row items-center">
              <Ionicons name="trash" size={20} color="white" />
              <Text className="text-white font-bold text-center ml-2">מחק עסק</Text>
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
