import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import CategorySelect from '../../components/categories/categorySelect.jsx';

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
        <View className="bg-white rounded-xl shadow p-6 w-full mx-auto" style={{ minHeight: 380 }}>
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
    );
}