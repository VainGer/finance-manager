import { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../../../components/common/loadingSpinner';
import ExpensesTable from '../../../components/expenses/expensesTable';
import Filter from '../../../components/expenses/filter';
import { useProfileData } from '../../../context/ProfileDataContext';
import { formatAmount } from '../../../utils/formatters';
import useExpensesDisplay from '../../../hooks/expenses/useExpensesDisplay';
import Overlay from '../../../components/common/Overlay.jsx';
import Button from '../../../components/common/button.jsx';
import ChangeTransactionAmount from '../../../components/transactions/changeTransactionAmount.jsx';
import ChangeTransactionDate from '../../../components/transactions/changeTransactionDate.jsx';
import ChangeTransactionDescription from '../../../components/transactions/changeTransactionDescription.jsx';
import DeleteTransaction from '../../../components/transactions/deleteTransaction.jsx';
import { LinearGradient } from "expo-linear-gradient";
import ProfileScopeSwitcher from '../../../components/expenses/profileScopeSwitcher';

const TransactionsSummary = ({ filteredExpenses }) => {
    const expenses = filteredExpenses || [];
    const totalAmount = expenses.reduce((sum, expense) => sum + (expense?.amount || 0), 0);

    return (
        <View className="bg-blue-50 rounded-lg p-4 mb-6">
            <View className="flex-row">
                <View className="flex-1 items-center border-r-2 border-gray-300">
                    <Text className="text-lg font-bold text-blue-600">{expenses.length}</Text>
                    <Text className="text-sm text-gray-600">עסקאות מוצגות</Text>
                </View>

                <View className="flex-1 items-center border-r-2 border-gray-300">
                    <Text className="text-lg font-bold text-red-600">{formatAmount(totalAmount)}</Text>
                    <Text className="text-sm text-gray-600">סה"כ הוצאות</Text>
                </View>

                <View className="flex-1 items-center">
                    <Text className="text-lg font-bold text-green-600">
                        {expenses.length > 0 ? formatAmount(totalAmount / expenses.length) : formatAmount(0)}
                    </Text>
                    <Text className="text-sm text-gray-600">ממוצע לעסקה</Text>
                </View>
            </View>
        </View>
    );
};

export default function ExpensesDisplay() {
    const {
        expenses,
        allExpenses,
        isLoading,
        error,
        availableDates,
        availableBusinesses,
        sortByDate,
        sortByAmount,
        filterByMonth,
        filterByCategory,
        filterByBusiness,
        clearFilters,
        applyFilters: applyAllFilters,
        childrenProps
    } = useExpensesDisplay();

    const {
        loading: childrenLoading,
        error: childrenError,
        childrenCategories,
        childrenBusinesses,
        children,
        selectedChild,
        setSelectedChild
    } = childrenProps;

    const { categories, businesses } = useProfileData();

    const [editDisplay, setEditDisplay] = useState(null);
    const [currentExpense, setCurrentExpense] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const closeOverlay = useCallback(() => {
        setEditDisplay(null);
        setCurrentExpense(null);
        setSuccessMessage(null);
    }, []);

    const handleGoBack = useCallback(() => {
        if (
            editDisplay === "changeAmount" ||
            editDisplay === "changeDate" ||
            editDisplay === "changeDescription" ||
            editDisplay === "delete"
        ) {
            setEditDisplay("editMenu");
        } else {
            closeOverlay();
        }
    }, [editDisplay, closeOverlay]);

    const handleOpenEditor = (type, expense) => {
        setCurrentExpense(expense);
        setEditDisplay(type);
    };

    const handleSuccess = (message) => {
        setEditDisplay(null);
        setSuccessMessage(message);
    };

    const renderEditor = () => {
        if (!currentExpense || selectedChild) return null;

        switch (editDisplay) {
            case 'delete':
                return <DeleteTransaction transaction={currentExpense} goBack={handleGoBack} onSuccess={handleSuccess} />;
            case 'changeAmount':
                return <ChangeTransactionAmount transaction={currentExpense} goBack={handleGoBack} onSuccess={handleSuccess} />;
            case 'changeDate':
                return <ChangeTransactionDate transaction={currentExpense} goBack={handleGoBack} onSuccess={handleSuccess} />;
            case 'changeDescription':
                return <ChangeTransactionDescription transaction={currentExpense} goBack={handleGoBack} onSuccess={handleSuccess} />;
            case 'editMenu':
                return (
                    <View>
                        <Text className="text-lg font-bold mb-4 text-center">ערוך עסקה</Text>
                        <Button className="mb-2" onPress={() => setEditDisplay('changeAmount')}>
                            עריכת סכום
                        </Button>
                        <Button className="mb-2" onPress={() => setEditDisplay('changeDate')}>
                            עריכת תאריך
                        </Button>
                        <Button className="mb-4" onPress={() => setEditDisplay('changeDescription')}>
                            עריכת תיאור
                        </Button>
                        <Button style="secondary" onPress={handleGoBack}>
                            ביטול
                        </Button>
                    </View>
                );
            default:
                return null;
        }
    };

    const renderSuccessOverlay = () => (
        <View className="items-center justify-center w-full max-w-sm p-4 mx-auto">
            <Ionicons name="checkmark-circle" size={80} color="#10b981" />
            <Text className="text-2xl font-bold text-slate-800 mt-4 text-center">
                {successMessage}
            </Text>
            <Button className="mt-6 w-full" onPress={closeOverlay} style="primary">
                אישור
            </Button>
        </View>
    );

    const BackToMainBtn = () => {
        return (
            <Button onPress={() => setSelectedChild(null)} className="mt-6 bg-blue-500 px-4 py-4 rounded-full w-3/4 mx-auto">
                <Text className="text-white font-semibold text-center">חזרה לפרופיל הראשי</Text>
            </Button>
        );
    };

    if (isLoading || childrenLoading) return <LoadingSpinner />;

    if (error || childrenError) {
        return (
            <View className="bg-white rounded-lg shadow-lg p-6 m-4">
                <View className="items-center py-8">
                    <Text className="text-red-500 text-lg mb-2">❌ שגיאה</Text>
                    <Text className="text-gray-600">{error || childrenError}</Text>
                </View>
                {selectedChild && <BackToMainBtn />}
            </View>
        );
    }

    if (!allExpenses || allExpenses.length === 0) {
        return (
            <View className="bg-white rounded-lg shadow-lg p-6 m-4">
                <Text className="text-2xl font-bold text-gray-800 mb-6">💰 הוצאות</Text>
                <View className="items-center py-12">
                    <Text className="text-gray-400 text-5xl mb-4">💰</Text>
                    <Text className="text-xl font-semibold text-gray-600 mb-2">אין הוצאות</Text>
                    <Text className="text-gray-500 mb-4">לא נמצאו עסקאות להצגה</Text>
                    {selectedChild && <BackToMainBtn />}
                </View>
            </View>
        );
    }

    const displayExpenses = expenses || [];

    return (
        <LinearGradient
            colors={["#f8fafc", "#eef2f7", "#e5eaf1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            <View pointerEvents="none" className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-300/20" />
            <View pointerEvents="none" className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/20" />

            <ScrollView key={allExpenses?.length || 0} className="flex-1">
                {(editDisplay || successMessage) && (
                    <Overlay onClose={closeOverlay}>
                        {successMessage ? renderSuccessOverlay() : renderEditor()}
                    </Overlay>
                )}
                <View className="flex-1 justify-between items-center my-8">
                    <Text className="text-2xl font-bold text-gray-800">💰 הוצאות</Text>
                </View>
                <View className="bg-white rounded-lg shadow-lg p-6 m-4">
                    <ProfileScopeSwitcher
                        children={children}
                        loading={childrenLoading}
                        selectedChild={selectedChild}
                        setSelectedChild={setSelectedChild}
                        error={childrenError}
                    />

                    <Filter
                        key={selectedChild ? selectedChild.id : 'parent'}
                        applyFilters={applyAllFilters}
                        availableDates={availableDates}
                        availableBusinesses={availableBusinesses}
                        filterByMonth={filterByMonth}
                        filterByCategory={filterByCategory}
                        filterByBusiness={filterByBusiness}
                        clearFilters={clearFilters}
                        sortByDate={sortByDate}
                        sortByAmount={sortByAmount}
                        categories={selectedChild ? childrenCategories : categories || []}
                        businesses={selectedChild ? childrenBusinesses : businesses || []}
                    />

                    <TransactionsSummary filteredExpenses={displayExpenses} />

                    <ExpensesTable filteredExpenses={displayExpenses} onOpenEditor={handleOpenEditor} childrenExpenses={!!selectedChild} />
                </View>
            </ScrollView>
        </LinearGradient>
    );
}
