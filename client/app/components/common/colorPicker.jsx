import { View, TouchableOpacity, FlatList } from "react-native";

export default function ColorPicker({ setColor }) {

    const colors = [
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
        { color: '#ADFF2F', name: 'ירוק בהיר' }
    ]
    return (
        <FlatList
            data={colors}
            numColumns={6}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => setColor(item.color)}
                    className="flex-1 m-2 aspect-square h-10"
                >
                    <View
                        className="flex-1 rounded-lg border-2 border-gray-400 w-full h-full"
                        style={{ backgroundColor: item.color }}
                    />
                </TouchableOpacity>
            )}
        />

    );
}
