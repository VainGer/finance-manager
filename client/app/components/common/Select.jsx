import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, Text, TouchableOpacity, View, } from 'react-native';


export default function Select({
    items = [],
    selectedValue = null,
    onSelect,
    placeholder = "בחר...",
    title = "בחר אפשרות",
    iconName = "chevron-down",
    itemIconName = null,
    loading = false,
    error = null,
    disabled = false,
    style = {},
    labelExtractor = item => typeof item === 'object' && item.label ? item.label : item,
    valueExtractor = item => typeof item === 'object' && item.value ? item.value : item,
    showCreateNew = false,
    onCreateNew = null,
}) {
    const [modalVisible, setModalVisible] = useState(false);

    const selectedItem = items.find(item => valueExtractor(item) === selectedValue);
    const selectedLabel = selectedItem ? labelExtractor(selectedItem) : '';

    const handleSelectItem = (item) => {
        const value = valueExtractor(item);
        onSelect(value);
        setModalVisible(false);
    };

    const isDisabled = (disabled || loading || !items || items.length === 0) && !showCreateNew;

    return (
        <View className="w-full" style={style}>
            {error && (
                <View className="bg-red-50 border border-red-200 rounded-lg py-2 px-3 mb-2">
                    <Text className="text-sm text-right text-red-600">{error}</Text>
                </View>
            )}

            <TouchableOpacity
                className="bg-slate-50 rounded-lg border border-slate-200 p-3.5"
                onPress={() => {
                    if (!isDisabled) {
                        setModalVisible(true);
                    }
                }}
                disabled={isDisabled}
                activeOpacity={0.7}
                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                    {itemIconName && (
                        <Ionicons
                            name={itemIconName}
                            size={20}
                            color="#64748b"
                            style={{ marginLeft: 16 }}
                        />
                    )}
                    <Text
                        style={{ textAlign: 'right' }}
                        className={selectedValue ? "text-slate-800" : "text-slate-400"}
                    >
                        {selectedLabel || placeholder}
                    </Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="small" color="#3b82f6" />
                ) : (
                    <Ionicons name={iconName} size={20} color="#64748b" />
                )}
            </TouchableOpacity>

            {!loading && items.length === 0 && !error && !disabled && (
                <Text className="text-sm text-slate-500 mt-2 text-right">
                    לא נמצאו אפשרויות
                </Text>
            )}

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
                            {title}
                        </Text>

                        {showCreateNew && onCreateNew && (
                            <TouchableOpacity
                                className="p-4 border-b border-slate-200 flex-row-reverse items-center bg-blue-50"
                                onPress={() => {
                                    setModalVisible(false);
                                    onCreateNew();
                                }}
                            >
                                <Ionicons name="add-circle-outline" size={20} color="#3b82f6" style={{ marginLeft: 10 }} />
                                <Text className="text-right flex-1 text-blue-600 font-bold">
                                    צור חדש...
                                </Text>
                            </TouchableOpacity>
                        )}
                        <FlatList
                            data={items}
                            keyExtractor={(item, index) => valueExtractor(item)?.toString() || index.toString()}
                            renderItem={({ item }) => {
                                const itemValue = valueExtractor(item);
                                const itemLabel = labelExtractor(item);
                                const isSelected = itemValue === selectedValue;

                                return (
                                    <TouchableOpacity
                                        className={`p-4 border-b border-slate-100 flex-row-reverse ${isSelected ? 'bg-blue-50' : ''}`}
                                        onPress={() => handleSelectItem(item)}
                                    >
                                        {itemIconName && (
                                            <Ionicons
                                                name={itemIconName}
                                                size={18}
                                                color={isSelected ? "#3b82f6" : "#64748b"}
                                                style={{ marginLeft: 10 }}
                                            />
                                        )}
                                        <Text
                                            className={`flex-1 ${isSelected ? 'text-blue-600 font-bold' : 'text-slate-800'}`}
                                        >
                                            {itemLabel}
                                        </Text>
                                        {isSelected && (
                                            <Ionicons name="checkmark" size={20} color="#3b82f6" />
                                        )}
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}