import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import useBudgets from '../../hooks/useBudgets';
import { formatDate } from '../../utils/formatters';
import Button from '../common/button';

export default function CreateProfileBudget({ goBack, setLoading }) {
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
        resetState
    } = useBudgets({setLoading});

    const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);


    const ChildrenSelection = ({ childrenBudgets, selectedChildBudget, onSelect }) => {
        return (
            <View>
                <Text className="font-bold mb-2">להמשך בחר תקציב שאותו תרצה לערוך:</Text>
                <View className="border border-gray-300 rounded mb-3">
                    <Picker
                        selectedValue={selectedChildBudget ?? ''}
                        onValueChange={(val) => {
                            // Picker returns string or number depending on platform; normalize to number
                            const idx = val === '' ? null : Number(val);
                            if (idx === null) {
                                onSelect(null);
                            } else {
                                onSelect(idx);
                            }
                        }}
                        mode="dropdown"
                    >
                        <Picker.Item label="בחר תקציב" value="" />
                        {childrenBudgets.map((budget, idx) => (
                            <Picker.Item
                                key={idx}
                                label={`${formatDate(budget.startDate)} - ${formatDate(budget.endDate)}`}
                                value={String(idx)}
                            />
                        ))}
                    </Picker>
                </View>
            </View>
        );
    };

    const AdultSelection = ({ startDate, endDate, setStartDate, setEndDate, setStartDatePickerVisible, setEndDatePickerVisible, amount, setAmount }) => {
        return (
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
        );
    };

    const DistributionPart = ({ categoryBudgets, handleCategoryBudgetChange, remainingAmount, create, setError, resetState }) => {
        // helper to check category budgets validity
        const hasInvalidCategory = categoryBudgets.some(cat => {
            const val = parseFloat(cat.budget);
            return !(val > 0);
        });
        return (
            <View>
                <Text className="font-bold mb-2">הגדרת תקציב לתאריכים: {formatDate(startDate)} - {formatDate(endDate)}</Text>
                <Text className={remainingAmount >= 0 ? 'text-green-600 mb-2' : 'text-red-600 mb-2'}>
                    {remainingAmount >= 0
                        ? `סכום פנוי: ₪${remainingAmount}`
                        : `הסכום חורג ב - ₪${Math.abs(remainingAmount)}`}
                </Text>
                {categoryBudgets.map((cat, idx) => (
                    <View key={cat.name ?? idx} className="flex-row items-center mb-2">
                        <Text className="flex-1">{cat.name}</Text>
                        <TextInput
                            value={String(cat.budget ?? '')}
                            onChangeText={val => {
                                // sanitize input: prevent negative sign and trim spaces
                                const sanitized = val.replace(/[^0-9.]/g, '');
                                handleCategoryBudgetChange(idx, sanitized);
                            }}
                            placeholder="0.00"
                            keyboardType="numeric"
                            className="border border-slate-300 rounded-lg w-20 text-right p-2"
                        />
                        <Text className="ml-2">₪</Text>
                    </View>
                ))}
                {hasInvalidCategory && (
                    <View className="bg-yellow-100 rounded-lg p-2 mb-2">
                        <Text className="text-yellow-800 text-center">יש להקצות סכום חיובי לכל קטגוריה (לא אפס ולא שלילי)</Text>
                    </View>
                )}
                <Button
                    style="success"
                    onPress={async () => {
                        if (remainingAmount !== 0) {
                            setError('הסכום חייב להיות מחולק במדויק בין הקטגוריות');
                            return;
                        }
                        if (hasInvalidCategory) {
                            setError('יש להקצות סכום חיובי לכל קטגוריה');
                            return;
                        }
                        await create();
                    }}
                    disabled={remainingAmount !== 0 || hasInvalidCategory}
                >צור תקציב</Button>
                <Button style="secondary" onPress={() => {
                    resetState();
                }}>חזרה לבחירת סכום ותאריך</Button>
            </View>
        );
    };


    return (
        <ScrollView className="p-4 bg-white h-max">
            {error && (
                <View className="bg-red-100 rounded-lg p-3 mb-3">
                    <Text className="text-red-700 text-center">{error}</Text>
                </View>
            )}
            {success && <View className="bg-green-100 rounded-lg p-3 mb-3">
                <Text className="text-green-700 text-center">{success}</Text>
            </View>}
            {!validDates ? (
                <View className="flex-1 justify-center items-center p-4">
                    <View className="w-full max-w-md bg-white rounded-xl p-4 shadow-sm">
                        {!profile.parentProfile ? (
                            <ChildrenSelection
                                childrenBudgets={childrenBudgets}
                                selectedChildBudget={selectedChildBudget}
                                onSelect={handleChildBudgetSelect}
                            />
                        ) : (
                            <AdultSelection
                                startDate={startDate}
                                endDate={endDate}
                                setStartDate={setStartDate}
                                setEndDate={setEndDate}
                                setStartDatePickerVisible={setStartDatePickerVisible}
                                setEndDatePickerVisible={setEndDatePickerVisible}
                                amount={amount}
                                setAmount={setAmount}
                            />
                        )}

                        <View className="flex-row mt-2">
                            <View className="flex-1 mr-2">
                                <Button disabled={amount <= 0 || !startDate || !endDate || startDate >= endDate} style="primary" onPress={async () => {
                                    const ok = await setDatesAndSum();
                                    if (ok) setValidDates(true);
                                }}>המשך</Button>
                            </View>
                            <View className="flex-1 ml-2">
                                <Button style="secondary" onPress={goBack}>ביטול</Button>
                            </View>
                        </View>
                    </View>
                </View>
            ) : (
                <DistributionPart
                    categoryBudgets={categoryBudgets}
                    handleCategoryBudgetChange={handleCategoryBudgetChange}
                    remainingAmount={remainingAmount}
                    create={create}
                    setError={setError}
                    resetState={resetState}
                />
            )}
        </ScrollView>
    );
}