import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
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
            </View>
        </View>
    )
}