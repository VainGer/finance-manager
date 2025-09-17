import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import useBudgets from '../../hooks/useBudgets';
import Button from '../common/button';
import LoadingSpinner from '../common/loadingSpinner';

export default function CreateProfileBudget() {
    const {
        profile,
        startDate, setStartDate,
        endDate, setEndDate,
        amount, setAmount,
        categoryBudgets, handleCategoryBudgetChange,
        childrenBudgets, selectedChildBudget, handleChildBudgetSelect,
        error, setError,
        success,
        validDates, setValidDates,
        remainingAmount,
        setDatesAndSum,
        create,
        loading,
        resetState
    } = useBudgets();

    const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
            resetState();
        }, [resetState])
    );

    return (
        <ScrollView className="p-4 bg-white">
            {loading && <LoadingSpinner />}
            {error && (
                <View className="bg-red-100 rounded-lg p-3 mb-3">
                    <Text className="text-red-700 text-center">{error}</Text>
                </View>
            )}
            {success && <View className="bg-green-100 rounded-lg p-3 mb-3">
                <Text className="text-green-700 text-center">{success}</Text>
            </View>}
            {!validDates ? (
                <View>
                    {!profile.parentProfile ? (
                        <View>
                            <Text className="font-bold mb-2">להמשך בחר תקציב שאותו תרצה לערוך:</Text>
                            {childrenBudgets.map((budget, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    className={`p-3 rounded-lg mb-2 ${selectedChildBudget === idx ? 'bg-indigo-100' : 'bg-slate-100'}`}
                                    onPress={() => handleChildBudgetSelect(idx)}
                                >
                                    <Text>
                                        תאריך התחלה: {budget.startDate} - תאריך סיום: {budget.endDate} - סכום: {budget.amount}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : (
                        <View>
                            <Text className="mb-1">תאריך התחלה:</Text>
                            <TouchableOpacity
                                className="border border-slate-300 rounded-lg mb-2 p-2"
                                onPress={() => setStartDatePickerVisible(true)}
                            >
                                <Text className="text-slate-700">{startDate || 'בחר תאריך התחלה'}</Text>
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={isStartDatePickerVisible}
                                mode="date"
                                onConfirm={date => {
                                    setStartDatePickerVisible(false);
                                    setStartDate(date.toISOString().slice(0, 10));
                                }}
                                onCancel={() => setStartDatePickerVisible(false)}
                            />

                            <Text className="mb-1">תאריך סוף:</Text>
                            <TouchableOpacity
                                className="border border-slate-300 rounded-lg mb-2 p-2"
                                onPress={() => setEndDatePickerVisible(true)}
                            >
                                <Text className="text-slate-700">{endDate || 'בחר תאריך סוף'}</Text>
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={isEndDatePickerVisible}
                                mode="date"
                                onConfirm={date => {
                                    setEndDatePickerVisible(false);
                                    setEndDate(date.toISOString().slice(0, 10));
                                }}
                                onCancel={() => setEndDatePickerVisible(false)}
                            />

                            <Text className="mb-1">סכום התקציב:</Text>
                            <TextInput
                                value={amount}
                                onChangeText={setAmount}
                                placeholder="0.00"
                                keyboardType="numeric"
                                className="border border-slate-300 rounded-lg mb-2 p-2 text-right font-medium"
                            />
                        </View>
                    )}
                    <Button style="primary" onPress={async () => {
                        const ok = await setDatesAndSum();
                        if (ok) setValidDates(true);
                    }}>המשך</Button>
                    <Button style="secondary">ביטול</Button>
                </View>
            ) : (
                <View>
                    <Text className="font-bold mb-2">
                        הגדרת תקציב לתאריכים: {startDate} - {endDate}
                    </Text>
                    <Text className={remainingAmount >= 0 ? 'text-green-600 mb-2' : 'text-red-600 mb-2'}>
                        {remainingAmount >= 0
                            ? `סכום פנוי: ₪${remainingAmount}`
                            : `הסכום חורג ב - ₪${Math.abs(remainingAmount)}`}
                    </Text>
                    {categoryBudgets.map((cat, idx) => (
                        <View key={cat.name ?? idx} className="flex-row items-center mb-2">
                            <Text className="flex-1">{cat.name}</Text>
                            <TextInput
                                value={cat.budget}
                                onChangeText={val => handleCategoryBudgetChange(idx, val)}
                                placeholder="0.00"
                                keyboardType="numeric"
                                className="border border-slate-300 rounded-lg w-20 text-right p-2"
                            />
                            <Text className="ml-2">₪</Text>
                        </View>
                    ))}
                    <Button
                        style="success"
                        onPress={async () => {
                            if (remainingAmount !== 0) {
                                setError('הסכום חייב להיות מחולק במדויק בין הקטגוריות');
                                return;
                            }
                            await create();
                        }}
                        disabled={remainingAmount !== 0}
                    >צור תקציב</Button>
                    <Button style="secondary">ביטול</Button>
                </View>
            )}
        </ScrollView>
    );
}