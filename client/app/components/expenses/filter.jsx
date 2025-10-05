import { useEffect, useState } from 'react';
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
        sortOrder: 'desc'
    });
    const [businessList, setBusinessesList] = useState([]);

    const formattedMonths = availableDates ? availableDates.map(({ year, month, dateYM }) => {
        return {
            key: dateYM,
            label: `${month} ${year}`
        };
    }) : [];

    const handleCategorySelect = (category) => {
        const categoryValue = category || null;
        setSelectedCategory(category);
        setSelectedBusiness(null);
        filterByCategory(categoryValue);
    };

    const handleBusinessSelect = (business) => {
        const businessValue = business || null;
        setSelectedBusiness(business);
        filterByBusiness(businessValue);
    };

    const handleApplyFilters = () => {
        const isDescending = sortConfig.sortOrder === 'desc';
        if (sortConfig.sortBy === 'date') {
            sortByDate(isDescending);
        } else {
            sortByAmount(isDescending);
        }
        if (typeof applyFilters === 'function') {
            applyFilters();
        }
    };

    const handleClearFilters = () => {
        setSelectedCategory(null);
        setSelectedBusiness(null);
        setSelectedMonth(null);
        setSortConfig({ sortBy: 'date', sortOrder: 'desc' });
        clearFilters();
    };

    useEffect(() => {
        const businessData = businesses.find(b => b.category === selectedCategory)?.businesses || [];
        setSelectedBusiness("");
        setBusinessesList(businessData);
    }, [selectedCategory]);

    return (
        <View
            className="bg-gray-50 rounded-lg p-4 mb-6">
            <Text className="text-lg font-semibold mb-4">🔍 סינון וחיפוש</Text>

            <ScrollView>
                {/* Category Filter using CategorySelect */}
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                        קטגוריה
                    </Text>
                    <CategorySelect key={selectedCategory + categories.length}
                        categories={categories}
                        setSelectedCategory={handleCategorySelect}
                        initialValue={selectedCategory || ''}
                    />
                </View>

                {/* Business Filter using BusinessSelect */}
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                        עסק
                    </Text>
                    <BusinessSelect key={selectedBusiness + businessList.length}
                        selectedCategory={selectedCategory}
                        businesses={businessList}
                        setSelectedBusiness={handleBusinessSelect}
                        initialValue={selectedBusiness || ''}
                    />
                </View>

                {/* Month Filter */}
                {formattedMonths && formattedMonths.length > 0 && (
                    <View className="mb-4">
                        <Text className="text-sm font-medium text-gray-700 mb-2">
                            חודש
                        </Text>
                        <Select
                            items={[
                                { value: "all", label: "כל החודשים" },
                                ...formattedMonths.map(month => ({
                                    value: month.key,
                                    label: month.label
                                }))
                            ]}
                            selectedValue={selectedMonth || "all"}
                            onSelect={(value) => {
                                const monthValue = value === "all" ? null : value;
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

                {/* Sort Options */}
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                        מיון לפי
                    </Text>
                    <Select
                        items={[
                            { value: 'date', label: 'תאריך' },
                            { value: 'amount', label: 'סכום' }
                        ]}
                        selectedValue={sortConfig.sortBy}
                        onSelect={(value) => {
                            const newSortConfig = { ...sortConfig, sortBy: value };
                            setSortConfig(newSortConfig);
                        }}
                        placeholder="בחר שדה למיון"
                        title="מיון לפי"
                        iconName="filter-outline"
                    />
                </View>

                {/* Sort Direction */}
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                        כיוון מיון
                    </Text>
                    <Select
                        items={[
                            { value: 'desc', label: 'יורד (מהגבוה לנמוך)' },
                            { value: 'asc', label: 'עולה (מהנמוך לגבוה)' }
                        ]}
                        selectedValue={sortConfig.sortOrder}
                        onSelect={(value) => {
                            const newSortConfig = { ...sortConfig, sortOrder: value };
                            setSortConfig(newSortConfig);
                        }}
                        placeholder="בחר כיוון מיון"
                        title="כיוון מיון"
                        iconName="swap-vertical-outline"
                    />
                </View>
            </ScrollView>

            {/* Filter Action Buttons */}
            <View className="mt-4 flex flex-1 justify-between">

                <Button onPress={handleApplyFilters}>סנן</Button>

                <Button style="secondary" onPress={handleClearFilters}>נקה סינון</Button>
            </View>
        </View>
    );
}