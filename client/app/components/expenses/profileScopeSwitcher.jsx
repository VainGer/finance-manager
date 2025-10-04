import { Text, View } from 'react-native';
import Select from '../common/Select';
import useChildrenData from '../../hooks/expenses/useChildrenData';

export default function ProfileScopeSwitcher() {
    const {
        children,
        selectedChild,
        setSelectedChild,
        loading,
    } = useChildrenData();

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
        <View className="mb-6">
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
