import { useEffect, useState, useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import BusinessSelect from '../business/businessSelect';
import CategorySelect from '../categories/categorySelect';
import Select from '../common/Select';
import Button from '../common/button';

export default function Filter({
    filterByMonth,
    filterByCategory,
    filterByBusiness,
    sortByDate,
    sortByAmount,
    clearFilters,
    applyFilters,
    availableDates = [],
    categories = [],
    businesses = []
}) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [sortConfig, setSortConfig] = useState({
        sortBy: 'date',
        sortOrder: 'desc',
    });
    const [businessList, setBusinessesList] = useState([]);


    const formattedMonths = useMemo(
        () =>
            availableDates.map(({ year, month, dateYM }) => ({
                key: dateYM,
                label: `${month} ${year}`,
            })),
        [availableDates]
    );


    const latestMonthKey = useMemo(
        () => (formattedMonths.length > 0 ? formattedMonths[0].key : null),
        [formattedMonths]
    );

    const handleCategorySelect = (category) => {
        const value = category || null;
        setSelectedCategory(value);
        setSelectedBusiness(null);
        filterByCategory(value);
    };

    const handleBusinessSelect = (business) => {
        const value = business || null;
        setSelectedBusiness(value);
        filterByBusiness(value);
    };

    const handleApplyFilters = () => {
        const isDescending = sortConfig.sortOrder === 'desc';
        if (sortConfig.sortBy === 'date') {
            sortByDate(isDescending);
        } else {
            sortByAmount(isDescending);
        }
    };

    const handleClearFilters = () => {
        setSelectedCategory(null);
        setSelectedBusiness(null);
        setSortConfig({ sortBy: 'date', sortOrder: 'desc' });


        if (latestMonthKey) {
            setSelectedMonth(latestMonthKey);
            filterByMonth(latestMonthKey);
            clearFilters(latestMonthKey);
        } else {
            clearFilters();
        }
    };

    useEffect(() => {
        if (latestMonthKey) {
            setSelectedMonth(latestMonthKey);
            filterByMonth(latestMonthKey);
        }
    }, [latestMonthKey]);

    useEffect(() => {
        const businessData =
            businesses.find((b) => b.category === selectedCategory)?.businesses || [];
        setSelectedBusiness('');
        setBusinessesList(businessData);
    }, [selectedCategory, businesses]);

    return (
        <View className="bg-gray-50 rounded-lg p-4 mb-6">
            <Text className="text-lg font-semibold mb-4">🔍 סינון וחיפוש</Text>

            <ScrollView>
                {/* Month Filter */}
                {formattedMonths.length > 0 && (
                    <View className="mb-4">
                        <Text className="text-sm font-medium text-gray-700 mb-2">חודש</Text>
                        <Select
                            items={formattedMonths.map((month) => ({
                                value: month.key,
                                label: month.label,
                            }))}
                            selectedValue={selectedMonth || 'all'}
                            onSelect={(value) => {
                                const monthValue = value === 'all' ? null : value;
                                setSelectedMonth(monthValue);
                                filterByMonth(monthValue);
                            }}
                            placeholder="בחר חודש"
                            title="בחירת חודש"
                            iconName="calendar-outline"
                            itemIconName="calendar"
                        />
                    </View>
                )}

                {/* Category Filter */}
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">קטגוריה</Text>
                    <CategorySelect
                        key={selectedCategory + categories.length}
                        categories={categories}
                        setSelectedCategory={handleCategorySelect}
                        initialValue={selectedCategory || ''}
                    />
                </View>

                {/* Business Filter */}
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">עסק</Text>
                    <BusinessSelect
                        key={selectedBusiness + businessList.length}
                        selectedCategory={selectedCategory}
                        businesses={businessList}
                        setSelectedBusiness={handleBusinessSelect}
                        initialValue={selectedBusiness || ''}
                    />
                </View>

                {/* Sort Field */}
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">מיון לפי</Text>
                    <Select
                        items={[
                            { value: 'date', label: 'תאריך' },
                            { value: 'amount', label: 'סכום' },
                        ]}
                        selectedValue={sortConfig.sortBy}
                        onSelect={(value) =>
                            setSortConfig((prev) => ({ ...prev, sortBy: value }))
                        }
                        placeholder="בחר שדה למיון"
                        title="מיון לפי"
                        iconName="filter-outline"
                    />
                </View>

                {/* Sort Direction */}
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">כיוון מיון</Text>
                    <Select
                        items={[
                            { value: 'desc', label: 'יורד (מהגבוה לנמוך)' },
                            { value: 'asc', label: 'עולה (מהנמוך לגבוה)' },
                        ]}
                        selectedValue={sortConfig.sortOrder}
                        onSelect={(value) =>
                            setSortConfig((prev) => ({ ...prev, sortOrder: value }))
                        }
                        placeholder="בחר כיוון מיון"
                        title="כיוון מיון"
                        iconName="swap-vertical-outline"
                    />
                </View>
            </ScrollView>

            {/* Action Buttons */}
            <View className="mt-4 flex flex-1 justify-between">
                <Button onPress={handleApplyFilters}>סנן</Button>
                <Button style="secondary" onPress={handleClearFilters}>
                    נקה סינון
                </Button>
            </View>
        </View>
    );
}
