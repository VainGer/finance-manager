import { Text, View } from 'react-native';
import Select from '../common/Select';

export default function ProfileScopeSwitcher(props = {}) {


    const { children, loading, selectedChild, setSelectedChild } = props;

    if (!children || children.length === 0) return null;

    const handleProfileSwitch = (value) => {
        if (value === 'parent') {
            setSelectedChild(null);
        } else {
            setSelectedChild(children.find(c => c.name === value.name));
        }
    };

    const selectItems = [
        { value: 'parent', label: 'פרופיל ראשי' },
        ...children.map(child => ({
            value: child,
            label: child.name,
        })),
    ];

    const selectedValue = selectedChild ? selectedChild : 'parent';

    return (
        <View className="mb-6 mt-4">
            <Text className="text-lg font-bold text-gray-800 mb-2">👤 בחירת פרופיל</Text>
            <Select
                items={selectItems}
                selectedValue={selectedValue}
                onSelect={handleProfileSwitch}
                placeholder="בחר פרופיל"
                title="בחירת פרופיל"
                itemIconName="person-outline"
                loading={loading}
            />
        </View>
    );
}
