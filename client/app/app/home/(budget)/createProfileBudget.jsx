import { useEffect, useState, } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "react-native-modal-datetime-picker";
import { useRouter } from "expo-router";
import useBudgets from "../../../hooks/useBudgets";
import { formatDate } from "../../../utils/formatters";
import Button from "../../../components/common/button";
import LoadingSpinner from "../../../components/common/loadingSpinner";
import Overlay from "../../../components/common/Overlay";


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
    handleCategoryIncludeToggle,
    childrenBudgets,
    selectedChildBudget,
    handleChildBudgetSelect,
    error,
    setError,
    success,
    validDates,
    setValidDates,
    remainingAmount,
    setDates,
    create,
    resetState,
    setPrefillNextBudget,
    adviceToPrefill,
    setAdviceToPrefill
  } = useBudgets({ setLoading });

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
        <Text className="text-slate-700">{startDate ? formatDate(startDate) : "בחר תאריך התחלה"}</Text>
      </TouchableOpacity>
      <DateTimePicker
        isVisible={isStartDatePickerVisible}
        mode="date"
        onConfirm={(date) => {
          setStartDatePickerVisible(false);
          setStartDate(date);
        }}
        onCancel={() => setStartDatePickerVisible(false)}
      />

      <Text className="mb-1 text-right">תאריך סוף:</Text>
      <TouchableOpacity
        className="border border-slate-300 rounded-lg mb-2 p-2"
        onPress={() => setEndDatePickerVisible(true)}
      >
        <Text className="text-slate-700">{endDate ? formatDate(endDate) : "בחר תאריך סוף"}</Text>
      </TouchableOpacity>
      <DateTimePicker
        isVisible={isEndDatePickerVisible}
        mode="date"
        onConfirm={(date) => {
          setEndDatePickerVisible(false);
          setEndDate(date);
        }}
        onCancel={() => setEndDatePickerVisible(false)}
      />
    </View>
  );

  const renderDistributionPart = () => {
    const includedCategories = categoryBudgets.filter(cat => cat.include);
    const hasInvalidCategory = includedCategories.some((cat) => {
      const val = parseFloat(cat.budget);
      return !(val > 0);
    });
    const hasNoIncludedCategories = includedCategories.length === 0;

    return (
      <View>
        {/* Total amount field */}
        {adviceToPrefill && (
          <Overlay visible={adviceToPrefill} onClose={() => setAdviceToPrefill(false)}>
            <View className="items-center">
              <Ionicons name="bulb-outline" size={64} color="#facc15" />
              <Text className="text-2xl font-bold text-center mt-4 text-slate-800">
                הצעה חכמה לתקציב הבא
              </Text>

              <Text className="text-slate-600 text-center mt-3 mb-6 leading-6">
                ניתוח ה-AI האחרון שלך מציע תקציב חדש{"\n"}
                מבוסס על הוצאות העבר.{"\n"}
                האם תרצה שנמלא עבורך את הנתונים?
              </Text>

              <View className="flex-row w-full mt-2">
                <TouchableOpacity
                  className="flex-1 bg-emerald-500 py-3 rounded-xl mx-1"
                  onPress={() => {
                    setPrefillNextBudget(true);
                    setAdviceToPrefill(false);
                  }}
                >
                  <Text className="text-white font-bold text-center text-base">
                    כן, מלא אוטומטית
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 bg-gray-300 py-3 rounded-xl mx-1"
                  onPress={() => setAdviceToPrefill(false)}
                >
                  <Text className="text-slate-700 font-semibold text-center text-base">
                    לא, אגדיר ידנית
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Overlay>
        )}
        <View className="flex-row justify-between items-center mb-4 space-y-4">
          <Text className="text-base font-semibold text-slate-700">סכום התקציב</Text>
          <View className="flex-row items-center space-x-2">
            <TextInput
              value={amount}
              onChangeText={(val) => setAmount(val.replace(/[^0-9.]/g, ""))}
              placeholder="0.00"
              keyboardType="numeric"
              className="border border-slate-300 rounded-lg p-2 text-right font-medium w-32 bg-white mx-2"
            />
            <Text>₪</Text>
          </View>
        </View>

        {/* Period display */}
        <Text className="font-bold mb-2 text-center text-slate-800">
          הגדרת תקציב לתאריכים:
        </Text>
        <Text className="font-bold mb-2 text-center text-slate-800">
          {formatDate(startDate)} - {formatDate(endDate)}
        </Text>

        {/* Remaining amount indicator */}
        <Text
          className={`${remainingAmount >= 0 ? "text-green-600" : "text-red-600"}
          mb-4 text-center font-semibold`}
        >
          {remainingAmount >= 0
            ? `סכום פנוי: ₪${remainingAmount}`
            : `הסכום חורג ב - ₪${Math.abs(remainingAmount)}`}
        </Text>

        {/* Category fields */}
        <View className="space-y-4">
          {categoryBudgets.map((cat, idx) => (
            <View
              key={cat.name || `cat-${idx}`}
              className="border border-slate-200 rounded-xl p-3 bg-slate-50"
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-semibold text-slate-800">{cat.name}</Text>
                <View className="flex-row items-center space-x-2">
                  <Text className="text-slate-600 text-sm">הכלל בתקציב</Text>
                  <Switch
                    value={cat.include}
                    onValueChange={(val) => handleCategoryIncludeToggle(idx, val)}
                  />
                </View>
              </View>

              <View className="flex-row justify-end items-center">
                <TextInput
                  value={cat.budget?.toString() ?? ""}
                  onChangeText={(val) =>
                    handleCategoryBudgetChange(idx, val.replace(/[^0-9.]/g, ""))
                  }
                  placeholder="0.00"
                  keyboardType="numeric"
                  className={`border border-slate-300 rounded-lg p-2 text-right w-32 bg-white ${!cat.include && "opacity-50"
                    }`}
                  editable={cat.include}
                />
                <Text className="ml-2 text-slate-600">₪</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Validation messages */}
        {(hasInvalidCategory || hasNoIncludedCategories) && (
          <View className="bg-yellow-100 rounded-lg p-2 mb-3 mt-4">
            <Text className="text-yellow-800 text-center font-medium">
              {hasNoIncludedCategories
                ? "יש לבחור לפחות קטגוריה אחת לתקציב"
                : "יש להקצות סכום חיובי לכל קטגוריה שנבחרה"}
            </Text>
          </View>
        )}

        {/* Buttons */}
        <View className="mt-4 space-y-2">
          <Button
            style="success"
            onPress={async () => {
              if (remainingAmount !== 0) {
                setError("הסכום חייב להיות מחולק במדויק בין הקטגוריות שנבחרו");
                return;
              }
              if (hasNoIncludedCategories) {
                setError("יש לבחור לפחות קטגוריה אחת לתקציב");
                return;
              }
              if (hasInvalidCategory) {
                setError("יש להקצות סכום חיובי לכל קטגוריה שנבחרה");
                return;
              }
              await create();
            }}
            disabled={remainingAmount !== 0 || hasInvalidCategory || hasNoIncludedCategories}
          >
            צור תקציב
          </Button>

          <Button style="secondary" onPress={resetState}>
            חזרה לבחירת תאריכים
          </Button>
        </View>
      </View>
    );
  };

  const SuccessView = () => (
    <View className="flex-1 bg-gray-50 items-center justify-center px-6">
      <View className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <View className="items-center mb-8">
          <Ionicons name="checkmark-circle" size={80} color="#10b981" />
          <Text className="text-3xl font-bold text-slate-800 mt-4">פעולה הושלמה</Text>
          <View className="h-1.5 w-16 bg-green-500 rounded-full mt-3" />
        </View>

        <View className="bg-green-50 border-2 border-green-200 rounded-xl py-4 px-5 mb-8">
          <Text className="text-green-700 text-center font-bold text-lg">
            {success || "התקציב נוצר בהצלחה!"}
          </Text>
        </View>

        <Button className="py-3 rounded-lg" onPress={() => router.back()} style="primary">
          <Ionicons name="arrow-forward" size={20} color="white" />
          <Text className="text-white font-bold ml-2">חזרה</Text>
        </Button>
      </View>
    </View>
  );

  if (success) return <SuccessView />;
  if (loading) return <LoadingSpinner />;

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
        backgroundColor: "#f9fafb",
      }}
    >
      <View pointerEvents="none" className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-300/20" />
      <View pointerEvents="none" className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/20" />
      <View pointerEvents="none" className="absolute top-1/3 right-10 h-24 w-24 rounded-full bg-white/20 blur-md" />

      <View className="bg-white rounded-2xl shadow-lg p-6 w-full" style={{ maxWidth: 500 }}>
        <View className="items-center mb-6">
          <Text className="text-3xl font-bold text-slate-800">יצירת תקציב</Text>
          <View className="h-1.5 w-16 bg-blue-500 rounded-full mt-3" />
        </View>

        {error && (
          <View className="bg-red-50 border border-red-200 rounded-lg py-2 px-3 mb-4">
            <Text className="text-red-700 text-center">{error}</Text>
          </View>
        )}

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
                disabled={!startDate || !endDate || startDate >= endDate}
                style="primary"
                className="py-3"
                onPress={async () => {
                  const ok = await setDates();
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
