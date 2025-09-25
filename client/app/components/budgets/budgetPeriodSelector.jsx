import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { formatDate } from '../../utils/formatters.js';

export default function BudgetPeriodSelector({ periods, selectedPeriod, onSelectPeriod }) {

    const selectedStartDate = selectedPeriod ? formatDate(selectedPeriod.startDate) : '';
    const selectedEndDate = selectedPeriod ? formatDate(selectedPeriod.endDate) : '';

    const selectedValue = selectedPeriod
        ? `${selectedPeriod.startDate}_${selectedPeriod.endDate}`
        : '';

    const handleValueChange = (itemValue) => {
        if (!itemValue) return;

        const [startDate, endDate] = itemValue.split('_');
        const selectedPeriod = periods.find(
            p => p.startDate === startDate && p.endDate === endDate
        );

        if (selectedPeriod) {
            onSelectPeriod(selectedPeriod);
        }
    };

    return (
        <View className="w-full bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
            <View className="flex-row justify-between items-center mb-3">
                <Ionicons name="calendar-outline" size={20} color="#334155" />
                <Text className="text-slate-800 font-bold text-base">
                    תקופת תקציב
                </Text>
            </View>

            {/* Display selected period */}
            {selectedPeriod && (
                <View className="bg-blue-50 p-3 rounded-lg mb-3 border border-blue-100">
                    <Text className="text-blue-800 text-center font-medium">
                        {`מ ${selectedStartDate} עד ${selectedEndDate}`}
                    </Text>
                </View>
            )}

            {/* Native Picker */}
            {periods.length > 0 && (
                <View className="bg-slate-100 border border-slate-200 rounded-lg mb-2">
                    <View className="flex-row justify-center items-center px-3 py-2">
                        <Text className="text-slate-700 font-medium mb-1">
                            בחר תקופת תקציב:
                        </Text>
                    </View>
                    <View className="bg-white">
                        <Picker
                            selectedValue={selectedValue}
                            onValueChange={handleValueChange}
                            dropdownIconColor="#64748b"
                            mode="dropdown"
                            style={{ direction: 'rtl' }}
                        >
                            {periods.map((period) => (
                                <Picker.Item
                                    key={`${period.startDate}_${period.endDate}`}
                                    label={`${formatDate(period.startDate)} - ${formatDate(period.endDate)}`}
                                    value={`${period.startDate}_${period.endDate}`}
                                    style={{ textAlign: 'right', color: '#334155' }}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>
            )}

            {periods.length > 0 && (
                <View className="items-end">
                    <Text className="text-xs text-slate-500">
                        {periods.length} תקופות תקציב זמינות
                    </Text>
                </View>
            )}
        </View>
    );
}
