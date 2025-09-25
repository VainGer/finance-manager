import { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../common/button';
import CategorySelect from './categorySelect';

export default function DeleteCategory({ goBack, refId, error, success, deleteCategory, getCategoriesLoading, getCategoriesError, categories }) {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [localError, setLocalError] = useState(null);

    const handleSubmit = () => {
        if (!selectedCategory || selectedCategory.trim() === '') {
            setLocalError('אנא בחר קטגוריה למחיקה');
            return;
        }
        setLocalError(null);
        setShowConfirm(true);
    };

    const handleDelete = () => {
        deleteCategory(refId, selectedCategory, setShowConfirm);
    };

    const cancelDelete = () => {
        setShowConfirm(false);
    };

    const displayError = error || localError;

    if (success) {
        return (
            <View className="bg-white rounded-xl shadow p-6 w-full max-w-md mx-auto">
                <View className="items-center mb-8">
                    <Ionicons name="checkmark-circle" size={80} color="#10b981" />
                    <Text className="text-3xl font-bold text-slate-800 mt-4">פעולה הושלמה</Text>
                    <View className="h-1.5 w-16 bg-green-500 rounded-full mt-3" />
                </View>

                <View className="bg-green-50 border-2 border-green-200 rounded-xl py-4 px-5 mb-8">
                    <Text className="text-green-700 text-center font-bold text-lg">{success}</Text>
                </View>

                <TouchableOpacity
                    onPress={goBack}
                    className="bg-blue-500 py-4 rounded-2xl w-3/4 flex-row items-center justify-center mx-auto"
                    activeOpacity={0.7}
                    style={{ elevation: 2 }}
                >
                    <Text className="text-white font-bold ml-2">חזרה לתפריט</Text>
                    <Ionicons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="bg-white rounded-xl shadow p-6 w-full max-w-md mx-auto">
            {showConfirm ? (
                <View>
                    {/* Confirmation Header */}
                    <View className="items-center mb-8">
                        <Ionicons name="alert-circle" size={60} color="#ef4444" />
                        <Text className="text-2xl font-bold text-red-600 mt-4">אישור מחיקת קטגוריה</Text>
                        <View className="h-1.5 w-16 bg-red-500 rounded-full mt-3" />
                    </View>

                    {/* Confirmation Warning */}
                    <View className="bg-red-50 border-2 border-red-200 rounded-xl p-5 mb-8">
                        <Text className="text-right text-red-700 font-bold mb-3 text-lg">
                            האם אתה בטוח שברצונך למחוק את הקטגוריה "{selectedCategory}"?
                        </Text>
                        <Text className="text-right text-red-600">
                            פעולה זו אינה ניתנת לביטול וכל התקציבים וההוצאות המשויכים לקטגוריה זו יימחקו.
                        </Text>
                    </View>

                    {/* Buttons */}
                    <View className="flex-row justify-between mt-4">
                        <TouchableOpacity
                            onPress={cancelDelete}
                            className="bg-gray-100 py-4 rounded-2xl w-[48%] border border-gray-200"
                            activeOpacity={0.7}
                        >
                            <Text className="text-gray-700 font-bold text-center">ביטול</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleDelete}
                            className="bg-red-600 py-4 rounded-2xl w-[48%] flex-row items-center justify-center"
                            activeOpacity={0.7}
                            style={{ elevation: 2 }}
                        >
                            <Ionicons name="trash" size={20} color="white" />
                            <Text className="text-white font-bold text-center ml-2">מחק קטגוריה</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View>
                    {/* Title */}
                    <View className="items-center mb-8">
                        <Text className="text-3xl font-bold text-slate-800">מחיקת קטגוריה</Text>
                        <View className="h-1.5 w-16 bg-red-500 rounded-full mt-3" />
                    </View>

                    {/* Error Message */}
                    {displayError && (
                        <View className="bg-red-50 border-2 border-red-200 rounded-xl py-3 px-4 mb-6">
                            <Text className="text-base text-right text-red-600 font-medium">{displayError}</Text>
                        </View>
                    )}

                    {/* Category Selection */}
                    <View className="mb-8">
                        <Text className="text-slate-800 font-bold mb-3 text-lg text-right">בחר קטגוריה למחיקה</Text>
                        <View className="border-2 border-gray-300 rounded-xl overflow-hidden">
                            <CategorySelect
                                loading={getCategoriesLoading} error={getCategoriesError} categories={categories}
                                setSelectedCategory={setSelectedCategory}
                                initialValue={selectedCategory}
                            />
                        </View>
                    </View>

                    {/* Buttons */}
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
                            className="bg-red-600 py-4 rounded-2xl w-[48%] flex-row items-center justify-center"
                            activeOpacity={0.7}
                            style={{ elevation: 2 }}
                        >
                            <Text className="text-white font-bold text-center ml-2">מחיקה</Text>
                            <Ionicons name="trash" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}
