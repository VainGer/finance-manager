import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import BudgetPeriodSelector from '../../../components/budgets/budgetPeriodSelector';
import CategoryBudgetDetails from '../../../components/budgets/categoryBudgetDetails';
import OverallBudgetSummary from '../../../components/budgets/overallBudgetSummary';
import Button from '../../../components/common/button';
import LoadingSpinner from '../../../components/common/loadingSpinner';
import Overlay from '../../../components/common/Overlay';
import { useAuth } from '../../../context/AuthContext';
import useBudgetSummary from '../../../hooks/expenses/useBudgetSummary';
import { formatDate } from '../../../utils/formatters';
import ProfileScopeSwitcher from '../../../components/expenses/profileScopeSwitcher';

export default function BudgetSummary() {
    const { profile } = useAuth();

    const [showNewBudgetsOverlay, setShowNewBudgetsOverlay] = useState(false);



    useEffect(() => {
        if (profile) {
            setShowNewBudgetsOverlay(!profile.parentProfile && profile.newBudgets && profile.newBudgets.length > 0);
        }
    }, [profile]);


    const {
        loading,
        error,
        availablePeriods,
        selectedPeriod,
        relevantPeriod,
        currentProfileBudget,
        currentCategoryBudgets,
        setSelectedPeriod,
        childrenProps
    } = useBudgetSummary({ profile });

    const { children, selectedChild, setSelectedChild } = childrenProps;

    const BackToMainBtn = () => {
        return (
            <Button onPress={() => { setSelectedChild(null); }} className="mb-4 bg-blue-500 px-4 py-4 rounded-full w-3/4 mx-auto">
                <Text className="text-white font-semibold">חזרה לפרופיל הראשי</Text>
            </Button>
        );
    };

    if (showNewBudgetsOverlay) {
        return (
            <Overlay onClose={() => { setShowNewBudgetsOverlay(false); }}>
                <View className="w-full max-w-md">
                    <View className="flex items-center justify-center">
                        <Text className="text-lg font-extrabold mb-4">עדכון תקציב חדש</Text>
                        <Text className=" w-3/4 text-center">היי {profile.profileName} — קיבלת עדכון תקציב חדש, כנס ליצירת תקציב למימוש</Text>
                    </View>
                    <View>
                        <Text className="font-semibold text-center mb-2">פירוט התקציב:</Text>
                        <View className="space-y-2">
                            {Array.isArray(profile.newBudgets) && profile.newBudgets.map((budget) => (
                                <View key={budget.amount} className="p-3 bg-slate-100 rounded-lg border border-slate-300 my-4">
                                    <Text className=" text-center mb-4">תקציב חדש בסך <Text className="font-semibold">₪{budget.amount}</Text></Text>
                                    <Text className=" text-center">לתקופה {formatDate(budget.startDate)} עד {formatDate(budget.endDate)}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    <Button onPress={() => { setShowNewBudgetsOverlay(false); }}>סגור</Button>
                </View>
            </Overlay>
        )
    }

    if (error) {
        return (
            <LinearGradient
                colors={["#f8fafc", "#eef2f7", "#e5eaf1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}
            >
                <View className="flex-1 justify-center items-center p-6">
                    <View className="bg-red-50 border border-red-200 rounded-xl p-5 w-full shadow-sm">
                        <View className="items-center mb-3">
                            <Ionicons name="alert-circle-outline" size={36} color="#DC2626" />
                        </View>
                        <Text className="text-red-600 text-center font-medium mb-4">{error}</Text>
                        {selectedChild && <BackToMainBtn />}
                    </View>
                </View>
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
                <View className="flex-1 justify-center items-center">
                    <LoadingSpinner />
                </View>
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
                <View className="flex-1 justify-center items-center p-6">
                    <View className="bg-white rounded-xl shadow-sm p-6 w-full border border-slate-100">
                        <View className="items-center mb-3">
                            <Ionicons name="wallet-outline" size={36} color="#64748B" />
                        </View>
                        <Text className="text-slate-600 text-center text-lg mb-4">לא נמצאו תקציבים לפרופיל זה.</Text>
                        {selectedChild && <BackToMainBtn />}
                    </View>
                </View>
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
            <View className="flex-1">
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
                        <View className="mb-4 bg-white rounded-xl">
                            <View className="px-4 pt-4">
                                <ProfileScopeSwitcher
                                    loading={loading}
                                    selectedChild={selectedChild}
                                    setSelectedChild={setSelectedChild}
                                    children={children}
                                />
                            </View>
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
                    <View className="mx-4 mb-">
                        <View className="flex-1 items-center justify-center mb-3 bg-white p-6 rounded-xl">
                            <Ionicons name="stats-chart-outline" size={26} color="#334155" />
                            <Text className="text-slate-800 font-bold text-base">
                                סיכום תקציב כללי
                            </Text>
                        </View>
                        <View className="w-full bg-white rounded-xl border mb-4 border-slate-100 p-4 shadow-sm">
                            <OverallBudgetSummary budget={currentProfileBudget} />
                        </View>
                    </View>

                    {/* פירוט לפי קטגוריות */}
                    <View className="mx-4">
                        <View className="flex-1 items-center justify-center mb-3 bg-white p-6 rounded-xl">
                            <Ionicons name="pie-chart-outline" size={26} color="#334155" />
                            <Text className="text-slate-800 font-bold text-base">
                                פירוט לפי קטגוריות
                            </Text>
                        </View>
                        <View className="w-full bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                            <CategoryBudgetDetails categories={currentCategoryBudgets} />
                        </View>
                    </View>
                </ScrollView>
            </View>
        </LinearGradient>
    );
}
