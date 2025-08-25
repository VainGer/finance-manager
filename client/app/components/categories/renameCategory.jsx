import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../common/button';
import CategorySelect from './categorySelect';

export default function RenameCategory({ goBack, refId, renameCategory, error, success }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleRename = () => {
        renameCategory(selectedCategory, newCategoryName, setNewCategoryName, setSelectedCategory);
    };

    return (
        <View className="bg-white rounded-xl shadow p-6 w-full max-w-md mx-auto">
            {/* Title */}
            <View className="items-center mb-8">
                <Text className="text-3xl font-bold text-slate-800">שינוי שם קטגוריה</Text>
                <View className="h-1.5 w-16 bg-blue-500 rounded-full mt-3" />
            </View>
            
            {/* Status Messages */}
            {error && (
                <View className="bg-red-50 border border-red-200 rounded-lg py-2 px-3 mb-4">
                    <View className="flex-row-reverse items-center">
                        <Ionicons name="alert-circle" size={20} color="#DC2626" />
                        <Text className="text-sm text-right text-red-600 mr-2">{error}</Text>
                    </View>
                </View>
            )}

            {success && (
                <View className="bg-green-50 border border-green-200 rounded-lg py-3 px-4 mb-4">
                    <View className="flex-row-reverse items-center">
                        <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                        <Text className="text-sm text-right text-green-600 mr-2">{success}</Text>
                    </View>
                </View>
            )}
            
            {/* Category Selection */}
            <View className="mb-7">
                <Text className="text-slate-800 font-bold mb-3 text-lg text-right">בחר קטגוריה</Text>
                <View className="border-2 border-gray-300 rounded-xl overflow-hidden">
                    <CategorySelect 
                        refId={refId} 
                        setSelectedCategory={setSelectedCategory} 
                        initialValue={selectedCategory}
                    />
                </View>
            </View>
            
            {/* New Category Name */}
            <View className="mb-8">
                <Text className="text-slate-800 font-bold mb-3 text-lg text-right">שם קטגוריה חדש</Text>
                <TextInput 
                    className="w-full px-5 py-4 text-right bg-white border-2 border-gray-300 rounded-xl"
                    style={{ textAlign: 'right', fontSize: 17 }}
                    placeholder="הזן שם קטגוריה חדש"
                    value={newCategoryName} 
                    onChangeText={setNewCategoryName} 
                    placeholderTextColor="#9CA3AF"
                />
            </View>
            
            {/* Action Buttons */}
            <View className="flex-row justify-between mt-4">
                <TouchableOpacity
                    onPress={goBack}
                    className="bg-gray-100 py-4 rounded-2xl w-[48%] border border-gray-200"
                    activeOpacity={0.7}
                >
                    <Text className="text-gray-700 font-bold text-center">ביטול</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    onPress={handleRename}
                    className="bg-blue-500 py-4 rounded-2xl w-[48%] flex-row items-center justify-center"
                    activeOpacity={0.7}
                    disabled={!selectedCategory || !newCategoryName.trim()}
                    style={{ 
                        opacity: (!selectedCategory || !newCategoryName.trim()) ? 0.6 : 1,
                        elevation: 2
                    }}
                >
                    <Text className="text-white font-bold text-center ml-2">שנה שם קטגוריה</Text>
                    <Ionicons name="create" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
