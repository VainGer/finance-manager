import { ScrollView, Text, View } from 'react-native';
import BudgetPeriodSelector from '../../../components/budgets/budgetPeriodSelector';
import CategoryBudgetDetails from '../../../components/budgets/categoryBudgetDetails';
import OverallBudgetSummary from '../../../components/budgets/overallBudgetSummary';
import LoadingSpinner from '../../../components/common/loadingSpinner';
import { useAuth } from '../../../context/AuthContext';
import useBudgetSummary from '../../../hooks/expenses/useBudgetSummary';


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
        currentCategoryBudgets
    } = useBudgetSummary(profile);

    if (error) {
        return (
            <View className="flex-1 justify-center items-center p-6">
                <View className="bg-red-100 border border-red-400 rounded-lg p-4 w-full">
                    <Text className="text-red-700 text-center">{error}</Text>
                </View>
            </View>
        );
    }

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!currentProfileBudget) {
        return (
            <View className="flex-1 justify-center items-center p-6">
                <View className="bg-white rounded-lg shadow-lg p-6 w-full">
                    <Text className="text-gray-600 text-center text-lg">לא נמצאו תקציבים לפרופיל זה.</Text>
                </View>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
            <View className="bg-gray-200 py-6 px-4 mb-6">
                <Text className="text-2xl font-bold text-center text-blue-800 mb-2">
                    סקירת תקציב - {profile.profileName}
                </Text>
                {availablePeriods.length > 1 && (
                    <View className="items-center mt-4 mb-2 w-full">
                        <BudgetPeriodSelector
                            periods={availablePeriods}
                            selectedPeriod={selectedPeriod}
                            onSelectPeriod={setSelectedPeriod}
                        />
                    </View>
                )}
            </View>

            {!relevantPeriod && (
                <View className="bg-yellow-100 border-l-4 border-yellow-500 mx-4 p-4 rounded-r-lg mb-6">
                    <Text className="font-bold text-yellow-700">לתשומת לבך:</Text>
                    <Text className="text-yellow-700">התקציב המוצג אינו פעיל לתקופה הנוכחית.</Text>
                </View>
            )}

            <View className="bg-white rounded-lg shadow mx-4 mb-6 pt-4">
                <Text className="text-xl font-bold text-center mb-2">סיכום תקציב כללי</Text>
                <OverallBudgetSummary budget={currentProfileBudget} />
            </View>

            <View className="bg-white rounded-lg shadow mx-4 pt-4">
                <Text className="text-xl font-bold text-center mb-4">פירוט לפי קטגוריות</Text>
                <CategoryBudgetDetails categories={currentCategoryBudgets} />
            </View>
        </ScrollView>
    );
}
