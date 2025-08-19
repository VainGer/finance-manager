import { Picker } from '@react-native-picker/picker';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function Filter({ filters, setFilters, categories, businesses }) {
    return (
        <View className="bg-gray-50 rounded-lg p-4 mb-6">
            <Text className="text-lg font-semibold mb-4">🔍 סינון וחיפוש</Text>
            
            <ScrollView>
                {/* Category Filter */}
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                        קטגוריה
                    </Text>
                    <View className="border border-gray-300 rounded-md">
                        <Picker
                            selectedValue={filters.category}
                            onValueChange={(value) => setFilters({ ...filters, category: value, business: 'all' })}
                            style={{ width: '100%' }}
                            dropdownIconColor="#4B5563"
                        >
                            <Picker.Item label="כל הקטגוריות" value="all" />
                            {categories.map(category => (
                                category !== 'all' && <Picker.Item key={category} label={category} value={category} />
                            ))}
                        </Picker>
                    </View>
                </View>

                {/* Business Filter */}
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                        עסק
                    </Text>
                    <View className="border border-gray-300 rounded-md">
                        <Picker
                            selectedValue={filters.business}
                            onValueChange={(value) => setFilters({ ...filters, business: value, category: 'all' })}
                            style={{ width: '100%' }}
                            dropdownIconColor="#4B5563"
                        >
                            <Picker.Item label="כל העסקים" value="all" />
                            {businesses.map(business => (
                                business !== 'all' && <Picker.Item key={business} label={business} value={business} />
                            ))}
                        </Picker>
                    </View>
                </View>

                {/* Sort By */}
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                        מיון לפי
                    </Text>
                    <View className="border border-gray-300 rounded-md">
                        <Picker
                            selectedValue={filters.sortBy}
                            onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
                            style={{ width: '100%' }}
                            dropdownIconColor="#4B5563"
                        >
                            <Picker.Item label="תאריך" value="date" />
                            <Picker.Item label="סכום" value="amount" />
                            <Picker.Item label="תיאור" value="description" />
                        </Picker>
                    </View>
                </View>

                {/* Sort Order */}
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                        סדר מיון
                    </Text>
                    <View className="border border-gray-300 rounded-md">
                        <Picker
                            selectedValue={filters.sortOrder}
                            onValueChange={(value) => setFilters({ ...filters, sortOrder: value })}
                            style={{ width: '100%' }}
                            dropdownIconColor="#4B5563"
                        >
                            <Picker.Item label="יורד (חדש לישן)" value="desc" />
                            <Picker.Item label="עולה (ישן לחדש)" value="asc" />
                        </Picker>
                    </View>
                </View>
            </ScrollView>

            {/* Clear Filters Button */}
            <View className="mt-4">
                <Pressable
                    onPress={() => setFilters({
                        category: 'all',
                        business: 'all',
                        sortBy: 'date',
                        sortOrder: 'desc'
                    })}
                    className="px-4 py-2 bg-gray-500 rounded"
                    style={({ pressed }) => [
                        pressed ? { backgroundColor: '#4B5563' } : {}
                    ]}
                >
                    <Text className="text-white text-center">נקה סינונים</Text>
                </Pressable>
            </View>
        </View>
    );
}