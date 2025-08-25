import { Picker } from '@react-native-picker/picker';
import { Text, View, I18nManager } from 'react-native';
import { formatDate } from '../../utils/formatters.js';

export default function BudgetPeriodSelector({ periods, selectedPeriod, onSelectPeriod }) {
    const selectedIndex = periods.findIndex(
        p => p.startDate === selectedPeriod?.startDate && p.endDate === selectedPeriod?.endDate
    );

    return (
        <View className="w-11/12 bg-white rounded-lg border border-gray-300 p-2">
            <Text className="text-gray-700 font-medium mb-2 text-center">
                בחר תקופת תקציב:
            </Text>

            <View className="border border-gray-200 rounded overflow-hidden">
                <View
                    style={{ flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row' }}
                >
                    <Picker
                        selectedValue={selectedIndex.toString()}
                        onValueChange={(itemValue) => {
                            const index = parseInt(itemValue);
                            onSelectPeriod(periods[index]);
                        }}
                        style={{
                            width: '100%',
                        }}
                        dropdownIconColor="#4B5563"
                    >
                        {periods.map((period, index) => (
                            <Picker.Item
                                key={period.startDate}
                                label={`${formatDate(new Date(period.startDate))} - ${formatDate(new Date(period.endDate))}`}
                                value={index}
                            />
                        ))}
                    </Picker>

                </View>
            </View>
        </View>
    );
}
