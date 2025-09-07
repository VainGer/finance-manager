import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

export default function CategorySelect({ categories = [], loading = false, error = null, setSelectedCategory, initialValue = "" }) {
    const [selectedValue, setSelectedValue] = useState(initialValue);
    const [modalVisible, setModalVisible] = useState(false);

    const selectItem = (value) => {
        setSelectedValue(value);
        setSelectedCategory(value);
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
                onPress={() => {
                    if (!loading && categories && categories.length > 0) {
                        setModalVisible(true);
                    }
                }}
                disabled={loading || !categories || categories.length === 0}
                activeOpacity={0.7}
                style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                    <Ionicons name="pricetag-outline" size={20} color="#64748b" style={{ marginLeft: 8 }} />
                    <Text
                        style={{ textAlign: 'right' }}
                        className={selectedValue ? "text-slate-800" : "text-slate-400"}
                    >
                        {selectedValue || "בחר קטגוריה"}
                    </Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="small" color="#3b82f6" />
                ) : (
                    <Ionicons name="chevron-down" size={20} color="#64748b" />
                )}
            </TouchableOpacity>

            {!loading && categories.length === 0 && !error && (
                <Text className="text-sm text-slate-500 mt-2 text-right">
                    לא נמצאו קטגוריות
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
                            בחר קטגוריה
                        </Text>

                        <FlatList
                            data={categories}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className={`p-4 border-b border-slate-100 flex-row-reverse items-center ${selectedValue === item ? 'bg-blue-50' : ''}`}
                                    onPress={() => selectItem(item)}
                                >
                                    <Ionicons
                                        name="pricetag"
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