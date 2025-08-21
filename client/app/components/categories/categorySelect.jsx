import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { get } from "../../utils/api.js";

export default function CategorySelect({ refId, setSelectedCategory, initialValue = "" }) {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedValue, setSelectedValue] = useState(initialValue);

    useEffect(() => {

        const fetchCategories = async () => {
            setLoading(true);
            const response = await get(`expenses/category/get-names/${refId}`);
            setLoading(false);
            if (response.ok) {
                setCategories(response.categoriesNames || []);
                setError(null);
            } else {
                setError(response.error || 'אירעה שגיאה בעת טעינת הקטגוריות, נסה שוב מאוחר יותר');
                console.error('Error fetching categories:', response.error);
            }
        };
        if (refId) {
            fetchCategories();
        }
    }, [refId]);

    const handleValueChange = (value) => {
        setSelectedValue(value);
        setSelectedCategory(value);
    };

    return (
        <View className="w-full mb-4">
            {error && (
                <View className="bg-red-100 border border-red-400 rounded-md py-2 px-4 mb-2">
                    <Text className="text-sm text-center text-red-600">{error}</Text>
                </View>
            )}

            <View className="relative border border-gray-300 rounded-md bg-white">
                {loading ? (
                    <View className="items-center justify-center py-2">
                        <ActivityIndicator size="small" color="#6366f1" />
                    </View>
                ) : (
                    <Picker
                        selectedValue={selectedValue}
                        onValueChange={handleValueChange}
                        style={{
                            width: '100%',
                            direction: 'rtl',
                            textAlign: 'right',
                            height: 50
                        }}
                        dropdownIconColor="#4B5563"
                        enabled={!loading && categories.length > 0}
                    >
                        <Picker.Item
                            label="בחר קטגוריה"
                            value=""
                            color="#9CA3AF"
                        />
                        {categories.map((category) => (
                            <Picker.Item
                                key={category}
                                label={category}
                                value={category}
                            />
                        ))}
                    </Picker>
                )}
            </View>

            {!loading && categories.length === 0 && !error && (
                <Text className="text-sm text-gray-500 mt-1 text-center">
                    לא נמצאו קטגוריות
                </Text>
            )}
        </View>
    );
}
