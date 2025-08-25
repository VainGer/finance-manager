import { Text, View, TouchableOpacity, ScrollView, I18nManager } from 'react-native';
import { formatDate } from '../../utils/formatters.js';
import { Ionicons } from '@expo/vector-icons';

export default function BudgetPeriodSelector({ periods, selectedPeriod, onSelectPeriod }) {
    const selectedIndex = periods.findIndex(
        p => p.startDate === selectedPeriod?.startDate && p.endDate === selectedPeriod?.endDate
    );
    
    // Format the selected period dates for display
    const selectedStartDate = selectedPeriod ? formatDate(selectedPeriod.startDate) : '';
    const selectedEndDate = selectedPeriod ? formatDate(selectedPeriod.endDate) : '';
    
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

            {/* Horizontal scrollable period selector for multiple periods */}
            {periods.length > 0 && (
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ 
                        paddingBottom: 8, 
                        paddingHorizontal: 4,
                        justifyContent: periods.length <= 3 ? 'space-around' : 'flex-start',
                        width: periods.length <= 3 ? '100%' : 'auto'
                    }}
                    className="mb-2"
                >
                    {periods.map((period, index) => (
                        <TouchableOpacity
                            key={period.startDate.toString()}
                            onPress={() => onSelectPeriod(period)}
                            className={`mr-2 py-2 px-4 rounded-lg ${
                                selectedIndex === index 
                                ? 'bg-blue-100 border border-blue-300' 
                                : 'bg-slate-100 border border-slate-200'
                            }`}
                            style={{ 
                                minWidth: periods.length <= 2 ? '45%' : 120,
                                maxWidth: periods.length <= 2 ? '45%' : 160
                            }}
                        >
                            <Text className={`text-center ${
                                selectedIndex === index 
                                ? 'text-blue-800 font-bold' 
                                : 'text-slate-700'
                            }`}>
                                {`${formatDate(period.startDate)}`}
                            </Text>
                            <Text className={`text-center text-xs ${
                                selectedIndex === index 
                                ? 'text-blue-600' 
                                : 'text-slate-500'
                            }`}>
                                {`עד ${formatDate(period.endDate)}`}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
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
