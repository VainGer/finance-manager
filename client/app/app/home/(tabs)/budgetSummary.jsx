import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import BudgetPeriodSelector from '../../../components/budgets/budgetPeriodSelector';
import CategoryBudgetDetails from '../../../components/budgets/categoryBudgetDetails';
import OverallBudgetSummary from '../../../components/budgets/overallBudgetSummary';
import LoadingSpinner from '../../../components/common/loadingSpinner';
import { useAuth } from '../../../context/AuthContext';
import useBudgetSummary from '../../../hooks/expenses/useBudgetSummary';
import useExpensesDisplay from '../../../hooks/expenses/useExpensesDisplay';

export default function BudgetSummary() {
    const { profile } = useAuth();
    const {
        loading,
        error,
        availablePeriods,
        selectedPeriod,
        setSelectedPeriod,
        relevantPeriod,
        currentProfileBudget,
        currentCategoryBudgets,
        refetchBudgets
    } = useBudgetSummary({ profile });

    const { expenses } = useExpensesDisplay({ profile });

    useFocusEffect(
        useCallback(() => {
            refetchBudgets();
            return () => {
            };
        }, [])
    );
    // Initialize selected period when available
    useEffect(() => {
        if (availablePeriods?.length && !selectedPeriod) {
            // Select the current period if it exists, otherwise the first available period
            const now = new Date();
            const currentPeriod = availablePeriods.find(p => {
                const startDate = new Date(p.startDate);
                const endDate = new Date(p.endDate);
                return startDate <= now && now <= endDate;
            });
            setSelectedPeriod(currentPeriod || availablePeriods[0]);
        }
    }, [availablePeriods, selectedPeriod]);

    if (error) {
        return (
            <LinearGradient
                colors={["#f8fafc", "#eef2f7", "#e5eaf1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}
            >
                <SafeAreaView className="flex-1 justify-center items-center p-6">
                    <View className="bg-red-50 border border-red-200 rounded-xl p-5 w-full shadow-sm">
                        <View className="items-center mb-3">
                            <Ionicons name="alert-circle-outline" size={36} color="#DC2626" />
                        </View>
                        <Text className="text-red-600 text-center font-medium">{error}</Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    if (loading) {
        return (
            <LinearGradient
                colors={["#f8fafc", "#eef2f7", "#e5eaf1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}
            >
                <SafeAreaView className="flex-1 justify-center items-center">
                    <LoadingSpinner />
                </SafeAreaView>
            </LinearGradient>
        );
    }

    if (!currentProfileBudget) {
        return (
            <LinearGradient
                colors={["#f8fafc", "#eef2f7", "#e5eaf1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}
            >
                <SafeAreaView className="flex-1 justify-center items-center p-6">
                    <View className="bg-white rounded-xl shadow-sm p-6 w-full border border-slate-100">
                        <View className="items-center mb-3">
                            <Ionicons name="wallet-outline" size={36} color="#64748B" />
                        </View>
                        <Text className="text-slate-600 text-center text-lg">לא נמצאו תקציבים לפרופיל זה.</Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={["#f8fafc", "#eef2f7", "#e5eaf1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            {/* אלמנטים דקורטיביים עדינים ברקע */}
            <View pointerEvents="none" className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-300/20" />
            <View pointerEvents="none" className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/20" />

            <SafeAreaView className="flex-1">
                <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                    {/* כותרת הדף */}
                    <View className="py-6 px-4 mb-4">
                        <View className="items-center mb-2">
                            <Text className="text-3xl font-bold text-slate-900 text-center">
                                סקירת תקציב
                            </Text>
                        </View>
                        <View className="items-center mb-4">
                            <Text className="text-lg font-medium text-slate-600 text-center">
                                {profile.profileName}
                            </Text>
                        </View>

                        {/* בוחר תקופה */}
                        <View className="mb-4">
                            {availablePeriods.length > 0 && (
                                <BudgetPeriodSelector
                                    periods={availablePeriods}
                                    selectedPeriod={selectedPeriod}
                                    onSelectPeriod={setSelectedPeriod}
                                />
                            )}
                        </View>
                    </View>

                    {/* התראה אם התקציב לא רלוונטי לתקופה הנוכחית */}
                    {!relevantPeriod && (
                        <View className="mx-4 mb-6">
                            <View className="bg-yellow-50 rounded-xl px-4 py-3 flex-row items-center border border-yellow-200">
                                <View className="flex-1 flex-row items-center justify-end">
                                    <Text className="text-yellow-700 text-right ml-2">
                                        התקציב המוצג אינו פעיל לתקופה הנוכחית
                                    </Text>
                                    <Ionicons name="alert-circle" size={20} color="#B45309" />
                                </View>
                            </View>
                        </View>
                    )}

                    {/* סיכום תקציב כללי */}
                    <View className="mx-4 mb-6">
                        <View className="w-full bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                            <View className="flex-row justify-between items-center mb-3">
                                <Ionicons name="stats-chart-outline" size={20} color="#334155" />
                                <Text className="text-slate-800 font-bold text-base">
                                    סיכום תקציב כללי
                                </Text>
                            </View>
                            <OverallBudgetSummary budget={currentProfileBudget} />
                        </View>
                    </View>

                    {/* פירוט לפי קטגוריות */}
                    <View className="mx-4">
                        <View className="w-full bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                            <View className="flex-row justify-between items-center mb-3">
                                <Ionicons name="pie-chart-outline" size={20} color="#334155" />
                                <Text className="text-slate-800 font-bold text-base">
                                    פירוט לפי קטגוריות
                                </Text>
                            </View>
                            <CategoryBudgetDetails categories={currentCategoryBudgets} />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}
