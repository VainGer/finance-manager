import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, TouchableOpacity, Modal, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { get } from "../../utils/api.js";

export default function BusinessSelect({ refId, category, setSelectedBusiness, initialValue = "" }) {
    const [businesses, setBusinesses] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedValue, setSelectedValue] = useState(initialValue);
    const [modalVisible, setModalVisible] = useState(false);

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

    const selectItem = (value) => {
        setSelectedValue(value);
        setSelectedBusiness(value);
        setModalVisible(false);
    };

    return (
        <View className="w-full">
            {error && (
                <View className="bg-red-50 border border-red-200 rounded-lg py-2 px-3 mb-2">
                    <Text className="text-sm text-right text-red-600">{error}</Text>
                </View>
            )}

            <TouchableOpacity 
                className="bg-slate-50 rounded-lg border border-slate-200 p-3.5"
                onPress={() => !loading && businesses.length > 0 && setModalVisible(true)}
                disabled={loading || businesses.length === 0 || !category}
                activeOpacity={0.7}
                style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                    <Ionicons name="storefront-outline" size={20} color="#64748b" style={{ marginLeft: 8 }} />
                    <Text 
                        style={{ textAlign: 'right' }} 
                        className={selectedValue ? "text-slate-800" : "text-slate-400"}
                    >
                        {selectedValue || "בחר עסק"}
                    </Text>
                </View>
                
                {loading ? (
                    <ActivityIndicator size="small" color="#3b82f6" />
                ) : (
                    <Ionicons name="chevron-down" size={20} color="#64748b" />
                )}
            </TouchableOpacity>

            {!loading && businesses.length === 0 && !error && category && (
                <Text className="text-sm text-slate-500 mt-2 text-right">
                    לא נמצאו עסקים
                </Text>
            )}
            
            {!category && (
                <Text className="text-sm text-slate-500 mt-2 text-right">
                    בחר קטגוריה תחילה
                </Text>
            )}

            {/* Dropdown Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable 
                    style={{ 
                        flex: 1, 
                        backgroundColor: 'rgba(0,0,0,0.5)', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        padding: 20
                    }}
                    onPress={() => setModalVisible(false)}
                >
                    <View 
                        className="bg-white rounded-xl w-full max-h-80 p-2"
                        style={{ elevation: 5 }}
                    >
                        <Text className="text-slate-800 font-bold text-lg p-3 text-right border-b border-slate-100">
                            בחר עסק
                        </Text>
                        
                        <FlatList
                            data={businesses}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className={`p-4 border-b border-slate-100 flex-row-reverse items-center ${selectedValue === item ? 'bg-blue-50' : ''}`}
                                    onPress={() => selectItem(item)}
                                >
                                    <Ionicons 
                                        name="storefront" 
                                        size={18} 
                                        color={selectedValue === item ? "#3b82f6" : "#64748b"} 
                                        style={{ marginLeft: 10 }}
                                    />
                                    <Text 
                                        className={`text-right flex-1 ${selectedValue === item ? 'text-blue-600 font-bold' : 'text-slate-800'}`}
                                    >
                                        {item}
                                    </Text>
                                    {selectedValue === item && (
                                        <Ionicons name="checkmark" size={20} color="#3b82f6" />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}
