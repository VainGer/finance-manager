import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "react-native-modal-datetime-picker";
import { useRouter } from "expo-router";

import useBudgets from "../../../hooks/useBudgets";
import { formatDate } from "../../../utils/formatters";
import Button from "../../../components/common/button";
import LoadingSpinner from "../../../components/common/loadingSpinner";

export default function CreateBudgetScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

  const {
    profile,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    amount,
    setAmount,
    categoryBudgets,
    handleCategoryBudgetChange,
    childrenBudgets,
    selectedChildBudget,
    handleChildBudgetSelect,
    error,
    setError,
    success,
    validDates,
    setValidDates,
    remainingAmount,
    setDatesAndSum,
    create,
    resetState,
  } = useBudgets({ setLoading });

  /** ---------- Render Helpers ---------- **/

  const renderChildrenSelection = () => (
    <View>
      <Text className="font-bold mb-2 text-right">בחר תקציב לעריכה:</Text>
      <View className="border-2 border-gray-300 rounded-xl mb-3 overflow-hidden">
        <Picker
          selectedValue={selectedChildBudget ?? ""}
          onValueChange={(val) => {
            const idx = val === "" ? null : Number(val);
            handleChildBudgetSelect(idx);
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

  const renderSelfBudgetSelection = () => (
    <View>
      <Text className="mb-1 text-right">תאריך התחלה:</Text>
      <TouchableOpacity
        className="border border-slate-300 rounded-lg mb-2 p-2"
        onPress={() => setStartDatePickerVisible(true)}
      >
        <Text className="text-slate-700">{startDate || "בחר תאריך התחלה"}</Text>
      </TouchableOpacity>
      <DateTimePicker
        isVisible={isStartDatePickerVisible}
        mode="date"
        onConfirm={(date) => {
          setStartDatePickerVisible(false);
          setStartDate(date.toISOString().slice(0, 10));
        }}
        onCancel={() => setStartDatePickerVisible(false)}
      />

      <Text className="mb-1 text-right">תאריך סוף:</Text>
      <TouchableOpacity
        className="border border-slate-300 rounded-lg mb-2 p-2"
        onPress={() => setEndDatePickerVisible(true)}
      >
        <Text className="text-slate-700">{endDate || "בחר תאריך סוף"}</Text>
      </TouchableOpacity>
      <DateTimePicker
        isVisible={isEndDatePickerVisible}
        mode="date"
        onConfirm={(date) => {
          setEndDatePickerVisible(false);
          setEndDate(date.toISOString().slice(0, 10));
        }}
        onCancel={() => setEndDatePickerVisible(false)}
      />

      <Text className="mb-1 text-right">סכום התקציב:</Text>
      <TextInput
        value={amount}
        onChangeText={(val) => setAmount(val.replace(/[^0-9.]/g, ""))}
        placeholder="0.00"
        keyboardType="numeric"
        className="border border-slate-300 rounded-lg mb-2 p-2 text-right font-medium"
      />
    </View>
  );

  const renderDistributionPart = () => {
    const hasInvalidCategory = categoryBudgets.some((cat) => {
      const val = parseFloat(cat.budget);
      return !(val > 0);
    });

    return (
      <View>
        <Text className="font-bold mb-2 text-right">
          הגדרת תקציב לתאריכים: {formatDate(startDate)} - {formatDate(endDate)}
        </Text>
        <Text
          className={`${remainingAmount >= 0 ? "text-green-600" : "text-red-600"} mb-2 text-right`}
        >
          {remainingAmount >= 0
            ? `סכום פנוי: ₪${remainingAmount}`
            : `הסכום חורג ב - ₪${Math.abs(remainingAmount)}`}
        </Text>

        {categoryBudgets.map((cat, idx) => (
          <View key={cat.name || `cat-${idx}`} className="flex-row items-center mb-2">
            <Text className="flex-1">{cat.name}</Text>
            <TextInput
              value={cat.budget?.toString() ?? ""}
              onChangeText={(val) =>
                handleCategoryBudgetChange(idx, val.replace(/[^0-9.]/g, ""))
              }
              placeholder="0.00"
              keyboardType="numeric"
              className="border border-slate-300 rounded-lg w-20 text-right p-2"
            />
            <Text className="ml-2">₪</Text>
          </View>
        ))}

        {hasInvalidCategory && (
          <View className="bg-yellow-100 rounded-lg p-2 mb-2">
            <Text className="text-yellow-800 text-center">
              יש להקצות סכום חיובי לכל קטגוריה
            </Text>
          </View>
        )}

        <Button
          style="success"
          onPress={async () => {
            if (remainingAmount !== 0) {
              setError("הסכום חייב להיות מחולק במדויק בין הקטגוריות");
              return;
            }
            if (hasInvalidCategory) {
              setError("יש להקצות סכום חיובי לכל קטגוריה");
              return;
            }
            await create();
          }}
          disabled={remainingAmount !== 0 || hasInvalidCategory}
        >
          צור תקציב
        </Button>

        <Button style="secondary" onPress={resetState}>
          חזרה לבחירת סכום ותאריך
        </Button>
      </View>
    );
  };

  /** ---------- Render ---------- **/

  if (loading) return <LoadingSpinner />;

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center", // ⬅️ center vertically
        alignItems: "center",
        paddingHorizontal: 16,
        backgroundColor: "#f9fafb",
      }}
    >
      <View pointerEvents="none" className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-300/20" />
      <View pointerEvents="none" className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/20" />
      <View pointerEvents="none" className="absolute top-1/3 right-10 h-24 w-24 rounded-full bg-white/20 blur-md" />
      <View
        className="bg-white rounded-2xl shadow-lg p-6 w-full"
        style={{ maxWidth: 500 }}
      >
        {/* Title */}
        <View className="items-center mb-6">
          <Text className="text-3xl font-bold text-slate-800">יצירת תקציב</Text>
          <View className="h-1.5 w-16 bg-blue-500 rounded-full mt-3" />
        </View>

        {/* Errors & Success */}
        {error && (
          <View className="bg-red-50 border border-red-200 rounded-lg py-2 px-3 mb-4">
            <Text className="text-red-700 text-center">{error}</Text>
          </View>
        )}
        {success && (
          <View className="bg-green-50 border border-green-200 rounded-lg py-3 px-4 mb-4">
            <View className="flex-row-reverse items-center justify-center">
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text className="text-green-700 text-center font-bold ml-2">
                {success}
              </Text>
            </View>
          </View>
        )}

        {/* Step 1: Dates/Amount */}
        {!validDates ? (
          <View>
            {!profile.parentProfile ? (
              childrenBudgets && childrenBudgets.length > 0 ? (
                renderChildrenSelection()
              ) : (
                <View>
                  <Text className="text-center text-gray-500 mb-4">
                    לא נוצרה עבורך תקופת תקציב
                  </Text>
                </View>
              )
            ) : (
              renderSelfBudgetSelection()
            )}

            <View className="flex w-max">

                <Button
                  disabled={
                    !amount || !startDate || !endDate || startDate >= endDate
                  }
                  style="primary"
                  className="py-3 "
                  onPress={async () => {
                    const ok = await setDatesAndSum();
                    if (ok) setValidDates(true);
                  }}
                >
                  המשך
                </Button>
              
              <Button className="py-3" style="secondary" onPress={() => router.back()}>
                ביטול
              </Button>
            </View>
          </View>
        ) : (
          renderDistributionPart()
        )}
      </View>
    </ScrollView>
  );
}
