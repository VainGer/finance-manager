import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { formatCurrency } from "../../utils/formatters.js";

export default function UnexpectedCategoryDetails({ categories }) {
    if (!categories || categories.length === 0) return null;

    return (
        <View className="mx-4 m-4">
            {/* Section Header */}
            <View className="flex-1 items-center justify-center mb-3 bg-white p-6 rounded-xl">
                <Ionicons name="pie-chart-outline" size={26} color="#334155" />
                <Text className="text-slate-800 font-bold text-base">
                    הוצאות לא צפויות בקטגוריות
                </Text>
            </View>

            {/* Main Card */}
            <View className="w-full bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                <View className="px-4 pb-20">
                    {categories.map((category, index) => {
                        const spent = category.spent || 0;

                        return (
                            <View
                                key={`${category.name}-${index}`}
                                className="bg-white rounded-xl p-4 mb-3 border border-slate-100 shadow-sm"
                            >
                                {/* Header */}
                                <View className="flex-row justify-between items-center mb-3">
                                    <View className="flex-row items-center">
                                        <Ionicons
                                            name="alert-circle-outline"
                                            size={18}
                                            color="#F97316"
                                            className="mr-2"
                                        />
                                        <Text className="text-base font-medium text-amber-700">
                                            הוצאות לא צפויות
                                        </Text>
                                    </View>
                                    <Text className="text-lg font-bold text-slate-800">
                                        {category.name}
                                    </Text>
                                </View>

                                {/* Amount Card */}
                                <View className="bg-amber-50 rounded-lg p-3 mb-3 border border-amber-100">
                                    <View className="flex-row justify-between items-center">
                                        <View className="flex-row items-center">
                                            <Ionicons
                                                name="card-outline"
                                                size={20}
                                                color="#B45309"
                                                className="mr-2"
                                            />
                                            <Text className="text-sm font-medium text-amber-800">
                                                סכום ההוצאה
                                            </Text>
                                        </View>
                                        <Text
                                            className="font-bold text-amber-800"
                                            style={{ fontSize: 15 }}
                                        >
                                            {formatCurrency(spent)}
                                        </Text>
                                    </View>
                                </View>

                                {/* Visual Info Row */}
                                <View className="bg-white rounded-lg p-3 border border-amber-100 flex-row justify-between items-center">
                                    <View className="flex-row items-center">
                                        <Ionicons
                                            name="calendar-outline"
                                            size={18}
                                            color="#B45309"
                                            className="mr-2"
                                        />
                                        <Text className="text-xs text-amber-800">
                                            הוצאה בתקופה הנוכחית
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Ionicons
                                            name="trending-up-outline"
                                            size={18}
                                            color="#B45309"
                                            className="mr-1"
                                        />
                                        <Text className="text-xs text-amber-800 font-medium">
                                            לא נכלל בתקציב
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}
