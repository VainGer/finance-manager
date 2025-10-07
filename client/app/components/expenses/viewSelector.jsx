import { View } from 'react-native';
import Button from '../common/button'

export default function ViewSelector({ options, selected, onSelect }) {
    return (
        <View className="flex-row mx-auto mb-4 flex-wrap justify-center">
            {options.map((opt, idx) => {
                const isActive = opt.value === selected;

                return (
                    <View key={opt.value} className={idx !== options.length - 1 ? "mr-2 mb-2" : "mb-2"}>
                        <Button
                            onPress={() => onSelect(opt.value)}
                            style={isActive ? opt.activeStyle || "primary" : "outline"}
                            size="small"
                            textClass={isActive ? "text-white" : "text-gray-700"}
                            className="w-auto"
                        >
                            {opt.label}
                        </Button>
                    </View>
                );
            })}
        </View>
    );
}