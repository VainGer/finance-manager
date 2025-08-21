import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { get } from "../../utils/api.js";

export default function BusinessSelect({ refId, category, setSelectedBusiness, initialValue = "" }) {
    const [businesses, setBusinesses] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedValue, setSelectedValue] = useState(initialValue);

    useEffect(() => {
        const fetchBusinesses = async () => {
            if (!category) {
                setBusinesses([]);
                setLoading(false);
                return;
            }
            
            setLoading(true);
            try {
                const response = await get(`expenses/business/get-businesses/${refId}/${category}`);
                if (response.ok) {
                    setBusinesses(response.businesses || []);
                    setError(null);
                } else {
                    setError(response.error || 'אירעה שגיאה בעת טעינת העסקים, נסה שוב מאוחר יותר');
                    console.error('Error fetching businesses:', response.error);
                }
            } catch (err) {
                setError('תקשורת עם השרת נכשלה');
                console.error('Network error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBusinesses();
    }, [refId, category]);

    const handleValueChange = (value) => {
        setSelectedValue(value);
        setSelectedBusiness(value);
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
                        enabled={!loading && businesses.length > 0}
                    >
                        <Picker.Item
                            label="בחר עסק"
                            value=""
                            color="#9CA3AF"
                        />
                        {businesses.map((business) => (
                            <Picker.Item
                                key={business}
                                label={business}
                                value={business}
                            />
                        ))}
                    </Picker>
                )}
            </View>

            {!loading && businesses.length === 0 && !error && category && (
                <Text className="text-sm text-gray-500 mt-1 text-center">
                    לא נמצאו עסקים
                </Text>
            )}
        </View>
    );
}