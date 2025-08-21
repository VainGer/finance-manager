import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { post } from '../../utils/api';
import Button from '../common/button';

export default function AddCategory({ goBack, addCategory, error, success }) {
    const [categoryName, setCategoryName] = useState('');
    return (
        <View className="p-4 bg-white rounded-lg w-3/4 ">
            <Text className="text-lg font-semibold text-gray-800 mb-4 text-center">הוספת קטגוריה</Text>
            {error && (
                <View className="bg-red-100 border border-red-400 rounded-md py-2 px-4 mb-4">
                    <Text className="text-sm text-center text-red-600">{error}</Text>
                </View>
            )}

            {success && (
                <View className="bg-green-100 border border-green-400 rounded-md py-2 px-4 mb-4">
                    <Text className="text-sm text-center text-green-600">{success}</Text>
                </View>
            )}

            <View className="mb-4">
                <TextInput
                    value={categoryName}
                    onChangeText={setCategoryName}
                    placeholder="שם הקטגוריה"
                    className="w-full px-4 py-3 text-right border border-gray-300 rounded-md"
                    style={{ textAlign: 'right' }}
                />
            </View>

            <View className="flex-row space-x-4 space-x-reverse">
                <View className="flex-1">
                    <Button
                        onPress={() => addCategory(categoryName, setCategoryName)}
                        style="primary"
                        className='bg-blue-600'
                    >
                        הוסף קטגוריה
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
            </View>
        </View>
    );
}
