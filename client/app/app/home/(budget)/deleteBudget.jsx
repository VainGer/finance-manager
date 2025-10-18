import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState, useMemo, useCallback } from "react";
import { View, Text } from "react-native";
import Button from "../../../components/common/button";
import LoadingSpinner from "../../../components/common/loadingSpinner";
import Select from "../../../components/common/Select";
import useBudgets from "../../../hooks/useBudgets";
import { formatDate } from "../../../utils/formatters";

export default function DeleteBudgetScreen() {
    const {
        profileBudgets,
        deleteBudget,
        error,
        success,
        setError,
    } = useBudgets({ setLoading: () => { } });

    const [selectedBudgetId, setSelectedBudgetId] = useState(null);
    const [localError, setLocalError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState("initial"); // 'initial' | 'confirm' | 'success'

    useEffect(() => {
        return () => {
            setError(null);
            setLocalError(null);
            setStep("initial");
        };
    }, []);

    const displayError = useMemo(() => error || localError, [error, localError]);

    const selectedBudget = useMemo(
        () => profileBudgets.find((b) => b._id === selectedBudgetId),
        [selectedBudgetId, profileBudgets]
    );

    const handleSubmit = useCallback(() => {
        if (!selectedBudgetId) {
            setLocalError("אנא בחר תקציב למחיקה");
            return;
        }
        setLocalError(null);
        setStep("confirm");
    }, [selectedBudgetId]);

    const handleDelete = useCallback(async () => {
        if (!selectedBudgetId) return;
        setLoading(true);
        const deleted = await deleteBudget(selectedBudgetId);
        setLoading(false);
        if (deleted) setStep("success");
    }, [selectedBudgetId, deleteBudget]);

    const handleReset = useCallback(() => {
        setSelectedBudgetId(null);
        setStep("initial");
    }, []);

 
    const InitialView = () => (
        <View className="flex-1 bg-gray-50 items-center justify-center px-6">
            <View pointerEvents="none" className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-300/20" />
            <View pointerEvents="none" className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/20" />
            <View pointerEvents="none" className="absolute top-1/3 right-10 h-24 w-24 rounded-full bg-white/20 blur-md" />

            <View className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
                <View className="items-center mb-8">
                    <Text className="text-3xl font-bold text-slate-800">מחיקת תקציב</Text>
                    <View className="h-1.5 w-16 bg-red-500 rounded-full mt-3" />
                </View>

                {displayError && (
                    <View className="bg-red-50 border-2 border-red-200 rounded-xl py-3 px-4 mb-6">
                        <Text className="text-base text-center text-red-600 font-medium">{displayError}</Text>
                    </View>
                )}

                {/* Budget Selection */}
                <View className="mb-8">
                    <Text className="text-slate-800 font-bold mb-3 text-lg text-center">
                        בחר תקציב למחיקה
                    </Text>
                    <Select
                        items={profileBudgets.map((b) => ({
                            label: `${formatDate(b.startDate)} - ${formatDate(b.endDate)}`,
                            value: b._id,
                        }))}
                        selectedValue={selectedBudgetId}
                        onSelect={setSelectedBudgetId}
                        placeholder="בחר תקציב..."
                        title="בחר תקציב למחיקה"
                        itemIconName="calendar-outline"
                    />
                </View>

                <View className="justify-between w-full mx-auto">
                    <Button className="py-3 rounded-lg" style="danger" onPress={handleSubmit}>
                        <View className="flex-row items-center">
                            <Ionicons name="trash" size={20} color="white" />
                            <Text className="text-white font-bold text-center ml-2">מחק</Text>
                        </View>
                    </Button>
                    <Button className="py-3 rounded-lg" style="secondary" onPress={handleReset}>
                        ביטול
                    </Button>
                </View>
            </View>
        </View>
    );

    const ConfirmView = () => (
        <View className="flex-1 bg-gray-50 items-center justify-center px-6">
            <View className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
                <View className="items-center mb-8">
                    <Ionicons name="alert-circle" size={60} color="#ef4444" />
                    <Text className="text-2xl font-bold text-red-600 mt-4">אישור מחיקה</Text>
                    <View className="h-1.5 w-16 bg-red-500 rounded-full mt-3" />
                </View>

                <View className="bg-red-50 border-2 border-red-200 rounded-xl p-5 mb-8">
                    <Text className="text-center text-red-700 font-bold mb-3 text-lg">
                        האם אתה בטוח שברצונך למחוק את התקציב לתקופה:
                    </Text>
                    <Text className="text-center text-red-600 font-semibold">
                        {formatDate(selectedBudget.startDate)} - {formatDate(selectedBudget.endDate)}
                    </Text>
                    <Text className="text-center text-red-600 mt-2">פעולה זו אינה ניתנת לביטול.</Text>
                </View>

                <View>
                    <Button className="py-3 rounded-lg" style="danger" onPress={handleDelete}>
                        <View className="flex-row items-center">
                            <Ionicons name="trash" size={20} color="white" />
                            <Text className="text-white font-bold text-center ml-2">מחק תקציב</Text>
                        </View>
                    </Button>
                    <Button className="py-3 rounded-lg" style="secondary" onPress={handleReset}>
                        ביטול
                    </Button>
                </View>
            </View>
        </View>
    );

    const SuccessView = () => (
        <View className="flex-1 bg-gray-50 items-center justify-center px-6">
            <View className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
                <View className="items-center mb-8">
                    <Ionicons name="checkmark-circle" size={80} color="#10b981" />
                    <Text className="text-3xl font-bold text-slate-800 mt-4">פעולה הושלמה</Text>
                    <View className="h-1.5 w-16 bg-green-500 rounded-full mt-3" />
                </View>

                <View className="bg-green-50 border-2 border-green-200 rounded-xl py-4 px-5 mb-8">
                    <Text className="text-green-700 text-center font-bold text-lg">{success}</Text>
                </View>

                <Button className="py-3 rounded-lg" onPress={handleReset} style="primary">
                    <Ionicons name="arrow-forward" size={20} color="white" />
                    <Text className="text-white font-bold ml-2">חזרה</Text>
                </Button>
            </View>
        </View>
    );

    const StepToRender = () => {
        switch (step) {
            case "confirm": return <ConfirmView />;
            case "success": return <SuccessView />;
            default: return <InitialView />;
        }
    };

    if (loading) return <LoadingSpinner />;

    return <StepToRender />;
}
