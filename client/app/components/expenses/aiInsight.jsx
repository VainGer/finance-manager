import { useMemo, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProfileData } from '../../context/ProfileDataContext';
import Select from '../../components/common/Select';
import { formatDate } from '../../utils/formatters';

export default function AIInsight() {
    const { aiData } = useProfileData();
    const histories = aiData?.history || [];
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

    const coachOutput = selectedHistory.coachOutput;
    const { summary, categories, nextMonthPlan, dataQuality } = coachOutput;

    const selectItems = histories.map((h) => ({
        value: h._id,
        label: `${formatDate(new Date(h.startDate))} - ${formatDate(new Date(h.endDate))}`,
    }));

    return (
        <View className="px-4 pb-20">
            {/* Header */}
            <View className="flex-row justify-center items-center mb-5">
                <Ionicons name="sparkles-outline" size={22} color="#4F46E5" />
                <Text className="text-2xl font-bold text-gray-800 ml-2">
                    תובנות AI מבוססות תקציב
                </Text>
            </View>

            {/* History Selector */}
            <Select
                items={selectItems}
                selectedValue={selectedId}
                onSelect={setSelectedId}
                placeholder="בחר תקופה"
                title="בחירת תקופה לניתוח"
                iconName="calendar-outline"
                itemIconName="time-outline"
            />

            {/* Global Summary Card */}
            <View className="bg-white rounded-xl p-4 mt-5 border border-slate-100 shadow-sm">
                <View className="flex-row items-center mb-3">
                    <Ionicons name="stats-chart-outline" size={20} color="#1e40af" />
                    <Text className="text-lg font-bold text-blue-800 ml-2">סיכום גלובלי</Text>
                </View>

                {/* Subcards */}
                <View className="bg-slate-50 rounded-lg p-3 mb-2 flex-row justify-between items-center">
                    <View className="flex-row items-center">
                        <Ionicons name="wallet-outline" size={18} color="#334155" />
                        <Text className="text-sm font-medium text-slate-700 ml-1">תקציב</Text>
                    </View>
                    <Text className="font-bold text-slate-800">
                        {summary.global.budget.toLocaleString()} ₪
                    </Text>
                </View>

                <View className="bg-slate-50 rounded-lg p-3 mb-2 flex-row justify-between items-center">
                    <View className="flex-row items-center">
                        <Ionicons name="card-outline" size={18} color="#334155" />
                        <Text className="text-sm font-medium text-slate-700 ml-1">הוצאה</Text>
                    </View>
                    <Text className="font-bold text-red-600">
                        {summary.global.spent.toLocaleString()} ₪
                    </Text>
                </View>

                <View className="bg-slate-50 rounded-lg p-3 mb-2 flex-row justify-between items-center">
                    <View className="flex-row items-center">
                        <Ionicons name="cash-outline" size={18} color="#334155" />
                        <Text className="text-sm font-medium text-slate-700 ml-1">נותר</Text>
                    </View>
                    <Text className="font-bold text-green-600">
                        {summary.global.remaining.toLocaleString()} ₪
                    </Text>
                </View>

                <View className="bg-slate-50 rounded-lg p-3 flex-row justify-between items-center">
                    <View className="flex-row items-center">
                        <Ionicons name="speedometer-outline" size={18} color="#334155" />
                        <Text className="text-sm font-medium text-slate-700 ml-1">ניצול</Text>
                    </View>
                    <Text className="font-bold text-slate-800">
                        {summary.global.utilizationPct.toFixed(2)}%
                    </Text>
                </View>

                {/* Top Signals */}
                {summary.topSignals?.length > 0 && (
                    <View className="mt-4">
                        {summary.topSignals.map((signal, idx) => {
                            const color =
                                signal.type === 'over_budget'
                                    ? '#EF4444'
                                    : signal.type === 'anomaly'
                                        ? '#F97316'
                                        : '#EAB308';
                            const icon =
                                signal.type === 'over_budget'
                                    ? 'alert-circle-outline'
                                    : signal.type === 'anomaly'
                                        ? 'pulse-outline'
                                        : 'warning-outline';

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

            {/* Category Insights */}
            <View className="mt-6">
                <View className="flex-row items-center mb-3">
                    <Ionicons name="folder-open-outline" size={20} color="#1f2937" />
                    <Text className="text-lg font-bold text-gray-800 ml-2">
                        תובנות לפי קטגוריה
                    </Text>
                </View>

                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.name}
                    scrollEnabled={false}
                    renderItem={({ item }) => {
                        const utilization = item.utilizationPct;
                        const variancePositive = item.variance >= 0;

                        const getStatus = () => {
                            if (utilization > 100) return { icon: 'alert-circle', color: '#EF4444', label: 'חריגה מהתקציב' };
                            if (utilization > 90) return { icon: 'warning', color: '#F59E0B', label: 'קרוב לחריגה' };
                            if (utilization > 75) return { icon: 'alert', color: '#FBBF24', label: 'ניצול גבוה' };
                            return { icon: 'checkmark-circle', color: '#10B981', label: 'במסגרת התקציב' };
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

                                {/* Budget / Spent / Remaining */}
                                <View className="bg-slate-50 rounded-lg p-3 mb-2 flex-row justify-between items-center">
                                    <View className="flex-row items-center">
                                        <Ionicons name="wallet-outline" size={18} color="#334155" />
                                        <Text className="text-sm font-medium text-slate-700 ml-1">תקציב</Text>
                                    </View>
                                    <Text className="font-bold text-slate-800">{item.budget.toLocaleString()} ₪</Text>
                                </View>

                                <View className="bg-slate-50 rounded-lg p-3 mb-2 flex-row justify-between items-center">
                                    <View className="flex-row items-center">
                                        <Ionicons name="card-outline" size={18} color="#334155" />
                                        <Text className="text-sm font-medium text-slate-700 ml-1">הוצאות</Text>
                                    </View>
                                    <Text className="font-bold text-slate-800">{item.spent.toLocaleString()} ₪</Text>
                                </View>

                                <View className="bg-slate-50 rounded-lg p-3 flex-row justify-between items-center">
                                    <View className="flex-row items-center">
                                        <Ionicons name="cash-outline" size={18} color="#334155" />
                                        <Text className="text-sm font-medium text-slate-700 ml-1">יתרה</Text>
                                    </View>
                                    <Text
                                        className="font-bold"
                                        style={{ color: variancePositive ? '#EF4444' : '#10B981' }}
                                    >
                                        {(item.budget - item.spent).toLocaleString()} ₪
                                    </Text>
                                </View>

                                {/* Drivers */}
                                {item.drivers?.length > 0 && (
                                    <View className="mt-3">
                                        <View className="flex-row items-center mb-1">
                                            <Ionicons name="business-outline" size={16} color="#4b5563" />
                                            <Text className="text-sm font-bold text-gray-700 ml-1">
                                                עסקים מובילים:
                                            </Text>
                                        </View>
                                        {item.drivers.map((d, idx) => (
                                            <Text key={idx} className="text-sm text-gray-600 ml-5">
                                                • {d.business}: {d.amount.toLocaleString()} ₪
                                            </Text>
                                        ))}
                                    </View>
                                )}

                                {/* Actions */}
                                {item.actions?.length > 0 && (
                                    <View className="mt-3">
                                        <View className="flex-row items-center mb-1">
                                            <Ionicons name="bulb-outline" size={16} color="#4b5563" />
                                            <Text className="text-sm font-bold text-gray-700 ml-1">
                                                הצעות פעולה:
                                            </Text>
                                        </View>
                                        {item.actions.map((a, idx) => (
                                            <Text key={idx} className="text-sm text-gray-600 ml-5">
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
