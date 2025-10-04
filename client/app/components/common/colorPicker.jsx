import { View, TouchableOpacity, FlatList, Text } from "react-native";
import { useEffect, useState } from "react";

const COLORS = [
    { color: '#FF0000', name: 'אדום' },
    { color: '#00AA00', name: 'ירוק' },
    { color: '#0066FF', name: 'כחול' },
    { color: '#FFD700', name: 'צהוב' },
    { color: '#FF6B35', name: 'כתום' },
    { color: '#800080', name: 'סגול' },
    { color: '#FF1493', name: 'ורוד' },
    { color: '#20B2AA', name: 'טורקיז' },
    { color: '#4B0082', name: 'אינדיגו' },
    { color: '#708090', name: 'אפור' },
    { color: '#8B4513', name: 'חום' },
    { color: '#2E8B57', name: 'ירוק ים' },
    { color: '#FFFFFF', name: 'לבן' },
    { color: '#A52A2A', name: 'אדום חום' },
    { color: '#00CED1', name: 'טורקיז כהה' },
    { color: '#DAA520', name: 'זהב כהה' },
    { color: '#C0C0C0', name: 'כסף' },
    { color: '#ADFF2F', name: 'ירוק בהיר' },
];

export default function ColorPicker({ setColor, initialColor }) {
    const [selectedColor, setSelectedColor] = useState(null);

    useEffect(() => {
        if (initialColor) {
            const found = COLORS.find(c => c.color === initialColor);
            if (found) {
                setSelectedColor(found);
            }
        }
    }, [initialColor]);

    const handleSelect = (item) => {
        setColor(item.color);
        setSelectedColor(item);
    };

    const renderItem = ({ item }) => {
        const isSelected = selectedColor?.color === item.color;

        return (
            <TouchableOpacity
                onPress={() => handleSelect(item)}
                className="flex-1 m-1 aspect-square"
                activeOpacity={0.8}
            >
                <View
                    className={`flex-1 rounded-lg border-2 ${isSelected ? "border-black" : "border-gray-300"}`}
                    style={{ backgroundColor: item.color }}
                />
            </TouchableOpacity>
        );
    };

    return (
        <View className="h-max w-full">
            <FlatList
                data={COLORS}
                numColumns={6}
                scrollEnabled={false}
                keyExtractor={(item) => item.name}
                renderItem={renderItem}
            />
            {selectedColor && (
                <View className="flex-row items-center justify-center bg-gray-200 rounded-xl border border-gray-400 my-2 px-3 py-1">
                    <Text className="text-lg font-bold ml-2">צבע נבחר:</Text>
                    <Text className="text-lg font-semibold" style={{ color: selectedColor.color }}>
                        {selectedColor.name}
                    </Text>
                </View>
            )}
        </View>
    );
}
