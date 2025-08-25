import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CategorySelect from '../../components/categories/categorySelect.jsx';
import Button from '../../components/common/button.jsx';

export default function CreateBusiness({ goBack, refId, error, success, addBusiness, onBusinessAdded }) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState(null);
    
    useEffect(() => {
        if (success && name === '' && onBusinessAdded) {
            onBusinessAdded(category); 
        }
    }, [success, name, category, onBusinessAdded]);

    const handleSubmit = () => {
        addBusiness(refId, category, name, setName);
    };

    return (
        <View className="p-4 bg-white rounded-lg">
            <Text className="text-lg font-semibold text-gray-800 mb-4 text-center">הוספת עסק חדש</Text>
            
            {error && (
                <View className="bg-red-100 border border-red-400 rounded-md py-2 px-4 mb-4">
                    <Text className="text-sm text-center text-red-600">{error}</Text>
        <View className="bg-white rounded-xl shadow p-6 w-full mx-auto max-w-md">
            {/* Title */}
            <View className="items-center mb-8">
                <Text className="text-3xl font-bold text-slate-800">הוספת עסק</Text>
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
                <View className="bg-green-100 border border-green-400 rounded-md py-2 px-4 mb-4">
                    <Text className="text-sm text-center text-green-600">{success}</Text>
                </View>
            )}
            
            <View className="mb-4">
                <Text className="text-gray-700 mb-2">בחר קטגוריה:</Text>
                <CategorySelect refId={refId} setSelectedCategory={setCategory} />
            </View>
            
            <View className="mb-4">
                <TextInput 
                    placeholder="שם בעל עסק" 
                    value={name} 
                    onChangeText={setName}
                    className="w-full px-4 py-3 text-right border border-gray-300 rounded-md"
                    style={{ textAlign: 'right' }}
                />
            </View>
            
            <View className="flex-row space-x-4 space-x-reverse">
                <View className="flex-1">
                    <Button
                        onPress={handleSubmit}
                        style="primary"
                        className="bg-blue-600"
                    >
                        הוסף בעל עסק
                    </Button>
                </View>
                
                <View className="flex-1">
                    <Button
                        onPress={goBack}
                        style="secondary"
                        textClass="text-gray-700 font-medium"
                    >
                        ביטול
                    </Button>
                </View>
                <View className="bg-green-50 border-2 border-green-200 rounded-xl py-3 px-4 mb-6">
                    <View className="flex-row-reverse items-center">
                        <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                        <Text className="text-base text-right text-green-600 mr-2 font-medium">{success}</Text>
                    </View>
                </View>
            )}
            
            {/* Category Selection */}
            <View className="mb-7">
                <Text className="text-slate-800 font-bold mb-3 text-lg text-right">בחר קטגוריה</Text>
                <View className="border-2 border-gray-300 rounded-xl overflow-hidden">
                    <CategorySelect refId={refId} setSelectedCategory={setCategory} />
                </View>
            </View>
            
            {/* Business Name Input */}
            <View className="mb-8">
                <Text className="text-slate-800 font-bold mb-3 text-lg text-right">שם העסק</Text>
                <TextInput 
                    value={name}
                    onChangeText={setName}
                    placeholder="הזן שם עסק חדש"
                    placeholderTextColor="#9CA3AF"
                    className="w-full px-5 py-4 text-right bg-white border-2 border-gray-300 rounded-xl"
                    style={{ textAlign: 'right', fontSize: 17 }}
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
                    onPress={handleSubmit}
                    className="bg-blue-500 py-4 rounded-2xl w-[48%] flex-row items-center justify-center"
                    activeOpacity={0.7}
                    disabled={!category || !name.trim()}
                    style={{ 
                        opacity: (!category || !name.trim()) ? 0.6 : 1,
                        elevation: 2
                    }}
                >
                    <Text className="text-white font-bold text-center ml-2">הוסף עסק</Text>
                    <Ionicons name="business" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    )
}