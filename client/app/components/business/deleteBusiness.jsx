import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CategorySelect from '../categories/categorySelect';
import BusinessSelect from './businessSelect';

export default function DeleteBusiness({ goBack, refId, error, success, deleteBusiness, categories, businesses,
    getBusinessesLoading, getBusinessesError, getCategoriesLoading, getCategoriesError }) {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedBusiness, setSelectedBusiness] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = () => {
        if (!selectedBusiness) return;
        deleteBusiness(refId, selectedCategory, selectedBusiness);
    };

    if (success) {
        return (
            <View className="bg-white rounded-xl shadow p-6 w-full mx-auto max-w-md">
                <View className="items-center mb-6">
                    <Text className="text-3xl font-bold text-slate-800">מחיקת עסק</Text>
                    <View className="h-1.5 w-16 bg-green-500 rounded-full mt-3" />
                </View>

                <View className="bg-green-50 border-2 border-green-200 rounded-xl py-4 px-5 mb-6">
                    <View className="flex-row-reverse items-center justify-center">
                        <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                        <Text className="text-lg text-center text-green-600 mr-2 font-medium">{success}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={goBack}
                    className="bg-blue-500 py-4 rounded-2xl w-full flex-row items-center justify-center mt-2"
                    activeOpacity={0.7}
                    style={{ elevation: 2 }}
                >
                    <Text className="text-white font-bold text-center ml-2">חזרה לתפריט</Text>
                    <Ionicons name="arrow-back" size={20} color="white" />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="bg-white rounded-xl shadow p-6 w-full mx-auto max-w-md">
            {/* Title */}
            <View className="items-center mb-6">
                <Text className="text-3xl font-bold text-slate-800">מחיקת עסק</Text>
                <View className="h-1.5 w-16 bg-red-500 rounded-full mt-3" />
            </View>

            {/* Error Message */}
            {error && (
                <View className="bg-red-50 border-2 border-red-200 rounded-xl py-3 px-4 mb-6">
                    <View className="flex-row-reverse items-center">
                        <Ionicons name="alert-circle" size={20} color="#DC2626" />
                        <Text className="text-base text-right text-red-600 mr-2 font-medium">{error}</Text>
                    </View>
                </View>
            )}

            {/* Category Selection */}
            <View className="mb-6">
                <Text className="text-slate-800 font-bold mb-3 text-lg text-right">בחר קטגוריה</Text>
                <View className="border-2 border-gray-300 rounded-xl overflow-hidden">
                    <CategorySelect
                        categories={categories}
                        setSelectedCategory={setSelectedCategory}
                        loading={getCategoriesLoading}
                        error={getCategoriesError}
                        initialValue={selectedCategory}
                    />
                </View>
            </View>

            {/* Business Selection - Only shown when category is selected */}
            {selectedCategory && (
                <View className="mb-6">
                    <Text className="text-slate-800 font-bold mb-3 text-lg text-right">בחר עסק</Text>
                    <View className="border-2 border-gray-300 rounded-xl overflow-hidden">
                        <BusinessSelect
                            selectedCategory={selectedCategory}
                            businesses={businesses.find(b => b.category === selectedCategory)?.businesses || []}
                            loading={getBusinessesLoading}
                            error={getBusinessesError}
                            setSelectedBusiness={setSelectedBusiness}
                        />
                    </View>
                </View>
            )}

            {/* Confirmation UI */}
            {selectedBusiness && showConfirm && (
                <View className="mb-6">
                    <View className="bg-red-50 border-2 border-red-200 rounded-xl py-6 px-5 mb-4">
                        <Text className="text-xl font-bold text-right text-red-700 mb-2">אזהרה!</Text>
                        <Text className="text-base text-right text-red-600">
                            האם אתה בטוח שברצונך למחוק את העסק "{selectedBusiness}"?
                        </Text>
                        <Text className="text-base text-right text-red-600 mt-2">
                            פעולה זו אינה ניתנת לביטול.
                        </Text>
                    </View>

                    <View className="flex-row justify-between mt-4">
                        <TouchableOpacity
                            onPress={() => setShowConfirm(false)}
                            className="bg-gray-100 py-4 rounded-2xl w-[48%] border border-gray-200"
                            activeOpacity={0.7}
                        >
                            <Text className="text-gray-700 font-bold text-center">ביטול</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleDelete}
                            className="bg-red-500 py-4 rounded-2xl w-[48%] flex-row items-center justify-center"
                            activeOpacity={0.7}
                            style={{ elevation: 2 }}
                        >
                            <Text className="text-white font-bold text-center ml-2">מחק עסק</Text>

                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Action Buttons */}
            {!showConfirm && (
                <View className="flex-row justify-between mt-6">
                    <TouchableOpacity
                        onPress={goBack}
                        className="bg-gray-100 py-4 rounded-2xl w-[48%] border border-gray-200"
                        activeOpacity={0.7}
                    >
                        <Text className="text-gray-700 font-bold text-center">ביטול</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setShowConfirm(true)}
                        className="bg-red-500 py-4 rounded-2xl w-[48%] flex-row items-center justify-center"
                        activeOpacity={0.7}
                        disabled={!selectedBusiness}
                        style={{
                            opacity: !selectedBusiness ? 0.6 : 1,
                            elevation: 2
                        }}
                    >
                        <Ionicons name="trash" size={20} color="white" />
                        <Text className="text-white font-bold text-center ml-2"> מחק עסק</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}