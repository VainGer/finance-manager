import { useMemo, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProfileData } from '../../context/ProfileDataContext';
import Select from '../../components/common/Select';
import { formatDate } from '../../utils/formatters';

export default function AIInsight() {
    const { aiData } = useProfileData();
    const histories = aiData || [];
    const [selectedId, setSelectedId] = useState(histories[0]?._id || null);

    const selectedHistory = useMemo(
        () => histories.find((h) => h._id === selectedId) || histories[0],
        [selectedId, histories]
    );

    if (!selectedHistory) {
        return (
            <View className="bg-white rounded-xl p-6 m-4 items-center justify-center border border-slate-100 shadow-sm">
                <Ionicons name="document-text-outline" size={36} color="#94A3B8" />
                <Text className="text-gray-600 text-center mt-2">אין דוחות ניתוח להצגה כרגע.</Text>
            </View>
        );
    }

    const { summary, categories, nextMonthPlan, dataQuality } = selectedHistory.coachOutput;
    const selectItems = histories.map((h) => ({
        value: h._id,
        label: `${formatDate(new Date(h.startDate))} - ${formatDate(new Date(h.endDate))}`,
    }));

    // Separate normal vs unexpected categories
    const regularCategories = categories.filter(c => !c.unexpected);
    const unexpectedCategories = categories.filter(c => c.unexpected);

    return (
        <View className="px-4 pb-20">
            {/* Header */}
            <View className="flex-row justify-center items-center mb-5">
                <Ionicons name="sparkles-outline" size={22} color="#4F46E5" />
                <Text className="text-2xl font-bold text-gray-800 ml-2">
                    תובנות AI מבוססות תקציב
                </Text>
            </View>

            {/* Period Selector */}
            <Select
                items={selectItems}
                selectedValue={selectedId}
                onSelect={setSelectedId}
                placeholder="בחר תקופה"
                title="בחירת תקופה לניתוח"
                iconName="calendar-outline"
                itemIconName="time-outline"
            />

            {/* Summary */}
            <View className="bg-white rounded-xl p-4 mt-5 border border-slate-100 shadow-sm">
                <View className="flex-row items-center mb-3">
                    <Ionicons name="stats-chart-outline" size={20} color="#1e40af" />
                    <Text className="text-lg font-bold text-blue-800 ml-2">סיכום גלובלי</Text>
                </View>

                {[
                    { icon: "wallet-outline", label: "תקציב", value: summary.global.budget, color: "#334155" },
                    { icon: "card-outline", label: "הוצאה", value: summary.global.spent, color: "#b91c1c" },
                    { icon: "cash-outline", label: "נותר", value: summary.global.remaining, color: "#15803d" },
                    { icon: "speedometer-outline", label: "ניצול", value: `${summary.global.utilizationPct.toFixed(2)}%`, color: "#334155" },
                ].map((item, idx) => (
                    <View key={idx} className="bg-slate-50 rounded-lg p-3 mb-2 flex-row justify-between items-center">
                        <View className="flex-row items-center">
                            <Ionicons name={item.icon} size={18} color={item.color} />
                            <Text className="text-sm font-medium text-slate-700 ml-1">{item.label}</Text>
                        </View>
                        <Text className="font-bold text-slate-800">{item.value.toLocaleString?.() || item.value}</Text>
                    </View>
                ))}

                {/* Top Signals */}
                {summary.topSignals?.length > 0 && (
                    <View className="mt-3">
                        {summary.topSignals.map((signal, idx) => {
                            const color =
                                signal.type === 'over_budget' ? '#EF4444' :
                                    signal.type === 'anomaly' ? '#F97316' :
                                        signal.type === 'unplanned' ? '#3B82F6' :
                                            '#EAB308';
                            const icon =
                                signal.type === 'over_budget' ? 'alert-circle-outline' :
                                    signal.type === 'anomaly' ? 'pulse-outline' :
                                        signal.type === 'unplanned' ? 'sparkles-outline' :
                                            'warning-outline';
                            return (
                                <View key={idx} className="flex-row items-center mb-1">
                                    <Ionicons name={icon} size={16} color={color} />
                                    <Text className="text-sm ml-2" style={{ color }}>
                                        {signal.message}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                )}
            </View>

            {/* Regular Categories */}
            <CategorySection title="תובנות לפי קטגוריה" data={regularCategories} />

            {/* Unexpected Categories */}
            {unexpectedCategories.length > 0 && (
                <CategorySection
                    title="הוצאות בלתי צפויות"
                    data={unexpectedCategories}
                    highlight
                />
            )}

            {/* Next Month Plan */}
            {nextMonthPlan && (
                <View className="mt-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <View className="flex-row items-center mb-3">
                        <Ionicons name="calendar-outline" size={20} color="#166534" />
                        <Text className="text-lg font-bold text-green-700 ml-2">תוכנית לחודש הבא</Text>
                    </View>

                    {nextMonthPlan.proposedBudgets.map((b, idx) => (
                        <View key={idx} className="bg-slate-50 rounded-lg p-3 mb-2">
                            <Text className="font-bold text-slate-800">{b.category}</Text>
                            <Text className="text-sm text-gray-600">
                                {b.current} ₪ ➡ {b.proposed} ₪ — {b.rationale}
                            </Text>
                        </View>
                    ))}

                    {nextMonthPlan.reminders?.length > 0 && (
                        <View className="mt-3">
                            <View className="flex-row items-center mb-1">
                                <Ionicons name="notifications-outline" size={16} color="#4b5563" />
                                <Text className="text-sm font-bold text-gray-700 ml-1">תזכורות:</Text>
                            </View>
                            {nextMonthPlan.reminders.map((r, idx) => (
                                <Text key={idx} className="text-sm text-gray-600 ml-5">• {r}</Text>
                            ))}
                        </View>
                    )}
                </View>
            )}

            {/* Data Quality */}
            {dataQuality?.length > 0 && (
                <View className="mt-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <View className="flex-row items-center mb-3">
                        <Ionicons name="alert-outline" size={20} color="#b45309" />
                        <Text className="text-lg font-bold text-yellow-700 ml-2">סוגיות באיכות הנתונים</Text>
                    </View>
                    {dataQuality.map((dq, idx) => (
                        <View key={idx} className="bg-slate-50 rounded-lg p-3 mb-2">
                            <Text className="font-bold text-slate-800">{dq.issue}</Text>
                            <Text className="text-sm text-gray-600">{dq.detail}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

function CategorySection({ title, data, highlight = false }) {
    return (
        <View className="mt-6">
            <View className="flex-row items-center mb-3">
                <Ionicons
                    name={highlight ? "flash-outline" : "folder-open-outline"}
                    size={20}
                    color={highlight ? "#3B82F6" : "#1f2937"}
                />
                <Text
                    className="text-lg font-bold ml-2"
                    style={{ color: highlight ? "#1D4ED8" : "#111827" }}
                >
                    {title}
                </Text>
            </View>

            <FlatList
                data={data}
                keyExtractor={(item) => item.name}
                scrollEnabled={false}
                renderItem={({ item }) => {
                    const utilization = item.utilizationPct;
                    const variancePositive = item.variance >= 0;

                    const getStatus = () => {
                        if (item.unexpected) return { icon: "alert-triangle-outline", color: "#3B82F6", label: "הוצאה בלתי צפויה" };
                        if (utilization > 100) return { icon: "alert-circle", color: "#EF4444", label: "חריגה מהתקציב" };
                        if (utilization > 90) return { icon: "warning", color: "#F59E0B", label: "קרוב לחריגה" };
                        if (utilization > 75) return { icon: "alert", color: "#FBBF24", label: "ניצול גבוה" };
                        return { icon: "checkmark-circle", color: "#10B981", label: "במסגרת התקציב" };
                    };

                    const status = getStatus();

                    return (
                        <View className="bg-white rounded-xl p-4 mb-4 border border-slate-100 shadow-sm">
                            {/* Header */}
                            <View className="flex-row justify-between items-center mb-3">
                                <View className="flex-row items-center">
                                    <Ionicons name={status.icon} size={18} color={status.color} />
                                    <Text className="ml-2 text-sm font-medium" style={{ color: status.color }}>
                                        {status.label}
                                    </Text>
                                </View>
                                <Text className="text-lg font-bold text-slate-800">{item.name}</Text>
                            </View>

                            {/* Budget info */}
                            <View className="bg-slate-50 rounded-lg p-3 mb-2 flex-row justify-between items-center">
                                <Text className="text-sm text-slate-700">תקציב</Text>
                                <Text className="font-bold text-slate-800">{item.budget.toLocaleString()} ₪</Text>
                            </View>
                            <View className="bg-slate-50 rounded-lg p-3 mb-2 flex-row justify-between items-center">
                                <Text className="text-sm text-slate-700">הוצאות</Text>
                                <Text className="font-bold text-slate-800">{item.spent.toLocaleString()} ₪</Text>
                            </View>

                            {item.unexpected && (
                                <View className="bg-blue-50 rounded-lg p-3 mb-2 flex-row justify-between items-center">
                                    <Text className="text-sm text-blue-700">בלתי צפוי</Text>
                                    <Text className="font-bold text-blue-700">{item.unexpectedSpent?.toLocaleString() || 0} ₪</Text>
                                </View>
                            )}

                            <View className="bg-slate-50 rounded-lg p-3 flex-row justify-between items-center">
                                <Text className="text-sm text-slate-700">יתרה</Text>
                                <Text className="font-bold" style={{ color: variancePositive ? '#EF4444' : '#10B981' }}>
                                    {(item.budget - item.spent).toLocaleString()} ₪
                                </Text>
                            </View>

                            {/* Drivers */}
                            {item.drivers?.length > 0 && (
                                <View className="mt-3">
                                    <Text className="text-sm font-bold text-gray-700 mb-1">עסקים מובילים:</Text>
                                    {item.drivers.map((d, idx) => (
                                        <Text key={idx} className="text-sm text-gray-600 ml-2">
                                            • {d.business}: {d.amount.toLocaleString()} ₪
                                        </Text>
                                    ))}
                                </View>
                            )}

                            {/* Actions */}
                            {item.actions?.length > 0 && (
                                <View className="mt-3">
                                    <Text className="text-sm font-bold text-gray-700 mb-1">הצעות פעולה:</Text>
                                    {item.actions.map((a, idx) => (
                                        <Text key={idx} className="text-sm text-gray-600 ml-2">
                                            • {a.proposal}
                                            {a.quantifiedImpact?.monthlySave > 0 && (
                                                <Text className="text-green-600 font-semibold">
                                                    {' '} (חיסכון חודשי: {a.quantifiedImpact.monthlySave} ₪)
                                                </Text>
                                            )}
                                        </Text>
                                    ))}
                                </View>
                            )}
                        </View>
                    );
                }}
            />
        </View>
    );
}
