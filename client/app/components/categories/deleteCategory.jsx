import { useState } from 'react';
import { Text, View } from 'react-native';
import Button from '../common/button';
import CategorySelect from './categorySelect';

export default function DeleteCategory({ goBack, refId, error, success, deleteCategory }) {
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
        deleteCategory(refId, selectedCategory);
    };

    const cancelDelete = () => {
        setShowConfirm(false);
    };
    const displayError = error || localError;

    if (success) {
        return (
            <View className="p-4 bg-white rounded-lg w-full">
                <View className="bg-green-100 border border-green-400 rounded-md py-4 px-4 mb-4">
                    <Text className="text-sm text-center text-green-600 font-medium">{success}</Text>
                </View>
                <Button
                    onPress={goBack}
                    style="primary"
                    textClass="text-white font-medium"
                >
                    חזרה לתפריט
                </Button>
            </View>
        );
    }

    return (
        <View className="p-4 bg-white rounded-lg w-full">
            {showConfirm ? (
                <View>
                    <Text className="text-lg font-semibold text-center text-red-600 mb-4">אישור מחיקת קטגוריה</Text>

                    <View className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                        <Text className="text-center text-red-700 mb-2">
                            האם אתה בטוח שברצונך למחוק את הקטגוריה "{selectedCategory}"?
                        </Text>
                        <Text className="text-center text-red-700 text-sm">
                            פעולה זו אינה ניתנת לביטול וכל התקציבים וההוצאות המשויכים לקטגוריה זו יימחקו.
                        </Text>
                    </View>

                    <View className="flex-row justify-between">
                        <View className="flex-1 mr-2">
                            <Button
                                onPress={cancelDelete}
                                style="secondary"
                                textClass="text-gray-700 font-medium"
                            >
                                ביטול
                            </Button>
                        </View>
                        <View className="flex-1 ml-2">
                            <Button
                                onPress={handleDelete}
                                style="custom"
                                bg="#dc2626"
                                textClass="text-white font-medium"
                            >
                                כן, מחק קטגוריה
                            </Button>
                        </View>
                    </View>
                </View>
            ) : (
                <View>
                    <Text className="text-lg font-semibold text-gray-800 mb-4">מחיקת קטגוריה</Text>
                    {displayError && (
                        <View className="bg-red-100 border border-red-400 rounded-md py-2 px-4 mb-4">
                            <Text className="text-sm text-center text-red-600">{displayError}</Text>
                        </View>
                    )}
                    <Text className="text-sm font-medium text-gray-700 mb-1">בחר קטגוריה למחיקה</Text>
                    <CategorySelect
                        refId={refId}
                        setSelectedCategory={setSelectedCategory}
                        initialValue={selectedCategory}
                    />
                    <View className="flex-row justify-between mt-4">
                        <View className="flex-1 mr-2">
                            <Button
                                onPress={goBack}
                                style="secondary"
                                textClass="text-gray-700 font-medium"
                            >
                                ביטול
                            </Button>
                        </View>
                        <View className="flex-1 ml-2">
                            <Button
                                onPress={handleSubmit}
                                style="custom"
                                bg="#dc2626"
                                textClass="text-white font-medium"
                            >
                                המשך למחיקה
                            </Button>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}
