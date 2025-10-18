import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useScreenReset } from '../../../hooks/useScreenReset';
import useBudgets from "../../../hooks/useBudgets";
import Button from "../../../components/common/button";
import LoadingSpinner from "../../../components/common/loadingSpinner";

export default function CreateChildrenBudgetScreen() {
  useScreenReset();
  const router = useRouter();
  const {
    childrenProfiles,
    addChildBudget,
    error,
    setError,
    success,
    setSuccess,
  } = useBudgets({ setLoading: () => { } });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedChild, setSelectedChild] = useState("");

  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  const [loading, setLoading] = useState(false);


  const onSubmit = async () => {
    setError(null);
    if (!selectedChild || !startDate || !endDate || parseFloat(amount) <= 0) {
      setError("אנא מלא את כל השדות וודא שסכום התקציב גדול מאפס");
      return;
    }
    setLoading(true);
    const ok = await addChildBudget({
      profileName: selectedChild,
      startDate,
      endDate,
      amount,
    });
    setLoading(false);
    if (ok) {
      setSuccess("התקציב נוסף בהצלחה");
      setSelectedChild("");
      setStartDate("");
      setEndDate("");
      setAmount("");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ScrollView className="p-4 bg-gray-50 flex-1">
      <View pointerEvents="none" className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-300/20" />
      <View pointerEvents="none" className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/20" />
      <View pointerEvents="none" className="absolute top-1/3 right-10 h-24 w-24 rounded-full bg-white/20 blur-md" />
      <View className="bg-white rounded-2xl shadow-lg p-6 w-full" style={{ maxWidth: 500 }}>
        {/* Title */}
        <View className="items-center mb-6">
          <Text className="text-3xl font-bold text-slate-800">הוספת תקציב לילד</Text>
          <View className="h-1.5 w-16 bg-blue-500 rounded-full mt-3" />
        </View>

        {/* Messages */}
        {error && (
          <View className="bg-red-50 border border-red-200 rounded-lg py-2 px-3 mb-4">
            <View className="flex-row-reverse items-center">
              <Ionicons name="alert-circle" size={20} color="#DC2626" />
              <Text className="text-sm text-right text-red-600 mr-2">{error}</Text>
            </View>
          </View>
        )}
        {success && (
          <View className="bg-green-50 border border-green-200 rounded-lg py-3 px-4 mb-4">
            <View className="flex-row-reverse items-center justify-center">
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text className="text-green-700 text-center font-bold ml-2">{success}</Text>
            </View>
          </View>
        )}

        {/* Child selection */}
        <Text className="mb-1 font-bold">בחר ילד</Text>
        <View className="border border-gray-300 rounded mb-4">
          <Picker
            selectedValue={selectedChild}
            onValueChange={(val) => setSelectedChild(val)}
            mode="dropdown"
          >
            <Picker.Item label="בחר פרופיל ילד" value="" />
            {childrenProfiles.map((c, i) => (
              <Picker.Item key={i} label={c.profileName} value={c.profileName} />
            ))}
          </Picker>
        </View>

        {/* Start Date */}
        <Text className="mb-1 font-bold">תאריך התחלה</Text>
        <TouchableOpacity
          onPress={() => setStartPickerVisible(true)}
          className="border border-slate-200 rounded-lg p-3 mb-3"
        >
          <Text className="text-slate-700">{startDate || "בחר תאריך התחלה"}</Text>
        </TouchableOpacity>
        <DateTimePicker
          isVisible={isStartPickerVisible}
          mode="date"
          onConfirm={(date) => {
            setStartPickerVisible(false);
            setStartDate(date.toISOString().slice(0, 10));
          }}
          onCancel={() => setStartPickerVisible(false)}
        />

        {/* End Date */}
        <Text className="mb-1 font-bold">תאריך סיום</Text>
        <TouchableOpacity
          onPress={() => setEndPickerVisible(true)}
          className="border border-slate-200 rounded-lg p-3 mb-3"
        >
          <Text className="text-slate-700">{endDate || "בחר תאריך סיום"}</Text>
        </TouchableOpacity>
        <DateTimePicker
          isVisible={isEndPickerVisible}
          mode="date"
          onConfirm={(date) => {
            setEndPickerVisible(false);
            setEndDate(date.toISOString().slice(0, 10));
          }}
          onCancel={() => setEndPickerVisible(false)}
        />

        {/* Amount */}
        <Text className="mb-1 font-bold">סכום התקציב</Text>
        <TextInput
          value={String(amount)}
          onChangeText={(t) => setAmount(t.replace(/[^0-9.]/g, ""))}
          placeholder="0.00"
          keyboardType="numeric"
          className="border border-slate-200 rounded-lg p-3 mb-4 text-right"
        />

        {/* Actions */}
        <Button
          style="success"
          onPress={onSubmit}
          disabled={!selectedChild || !startDate || !endDate || parseFloat(amount) <= 0}
        >
          הוסף תקציב לילד
        </Button>
        <Button style="secondary" onPress={() => router.back()}>
          חזרה
        </Button>
      </View>
    </ScrollView>
  );
}
