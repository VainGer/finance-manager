import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CategorySelect from '../categories/categorySelect';
import BusinessSelect from './businessSelect';

export default function RenameBusiness({ goBack, refId, error, success, renameBusiness, categories,
    businesses, getBusinessesLoading, getBusinessesError, getCategoriesLoading, getCategoriesError }) {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedBusiness, setSelectedBusiness] = useState("");
    const [newName, setNewName] = useState("");
    const [businessesList, setBusinessesList] = useState([]);
    const handleSubmit = () => {
        renameBusiness(refId, selectedCategory, selectedBusiness, newName);
    };

    useEffect(() => {
        const businessData = businesses.find(b => b.category === selectedCategory)?.businesses || [];
        setSelectedBusiness("");
        setBusinessesList(businessData);
    }, [selectedCategory]);

    return (
        <View className="bg-white rounded-xl shadow p-6 w-full mx-auto max-w-md">
            {/* Title */}
            <View className="items-center mb-6">
                <Text className="text-3xl font-bold text-slate-800">עדכון שם עסק</Text>
                <View className="h-1.5 w-16 bg-blue-500 rounded-full mt-3" />
            </View>

            {/* Status Messages */}
            {error && (
                <View className="bg-red-50 border-2 border-red-200 rounded-xl py-3 px-4 mb-6">
                    <View className="flex-row-reverse items-center">
                        <Ionicons name="alert-circle" size={20} color="#DC2626" />
                        <Text className="text-base text-right text-red-600 mr-2 font-medium">{error}</Text>
                    </View>
                </View>
            )}

            {success && (
                <View className="bg-green-50 border-2 border-green-200 rounded-xl py-3 px-4 mb-6">
                    <View className="flex-row-reverse items-center">
                        <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                        <Text className="text-base text-right text-green-600 mr-2 font-medium">{success}</Text>
                    </View>
                </View>
            )}

            {/* Category Selection */}
            <View className="mb-6">
                <Text className="text-slate-800 font-bold mb-3 text-lg text-right">בחר קטגוריה</Text>
                <View className="border-2 border-gray-300 rounded-xl overflow-hidden">
                    <CategorySelect
                        initialValue={selectedCategory}
                        categories={categories}
                        loading={getCategoriesLoading}
                        error={getCategoriesError}
                        setSelectedCategory={setSelectedCategory}
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
                            initialValue={selectedBusiness}
                            businesses={businessesList}
                            loading={getBusinessesLoading}
                            error={getBusinessesError}
                            setSelectedBusiness={setSelectedBusiness}
                        />
                    </View>
                </View>
            )}

            {/* New Name Input - Only shown when business is selected */}
            {selectedBusiness && (
                <View className="mb-6">
                    <Text className="text-slate-800 font-bold mb-3 text-lg text-right">שם עסק חדש</Text>
                    <TextInput
                        value={newName}
                        onChangeText={setNewName}
                        placeholder="הזן שם עסק חדש"
                        placeholderTextColor="#9CA3AF"
                        className="w-full px-5 py-4 text-right bg-white border-2 border-gray-300 rounded-xl"
                        style={{ textAlign: 'right', fontSize: 17 }}
                    />
                </View>
            )}

            {/* Action Buttons */}
            <View className="flex-row justify-between mt-6">
                <TouchableOpacity
                    onPress={goBack}
                    className="bg-gray-100 py-4 rounded-2xl w-[48%] border border-gray-200"
                    activeOpacity={0.7}
                >
                    <Text className="text-gray-700 font-bold text-center">ביטול</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleSubmit}
                    className="bg-blue-500 py-4 rounded-2xl w-[48%] flex-row items-center justify-center"
                    activeOpacity={0.7}
                    disabled={!selectedBusiness || !newName.trim()}
                    style={{
                        opacity: (!selectedBusiness || !newName.trim()) ? 0.6 : 1,
                        elevation: 2
                    }}
                >
                    <Text className="text-white font-bold text-center ml-2">עדכן שם</Text>
                    <Ionicons name="create" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}