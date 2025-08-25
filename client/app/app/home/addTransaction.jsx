import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { I18nManager, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import DateTimePicker from 'react-native-modal-datetime-picker';
import BusinessSelects from '../../components/business/businessSelect.jsx';
import CategorySelect from '../../components/categories/categorySelect.jsx';
import Button from '../../components/common/button.jsx';
import LoadingSpinner from '../../components/common/loadingSpinner.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import useBudgetSummary from '../../hooks/expenses/useBudgetSummary.js';
import useExpensesDisplay from '../../hooks/expenses/useExpensesDisplay.js';
import useEditTransactions from '../../hooks/useEditTransactions.js';
import { formatDate } from '../../utils/formatters.js';

export default function AddTransaction() {
  const { profile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [isVisibleDate, setVisibleDate] = useState(false);
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const { refetchExpenses } = useExpensesDisplay({ profile });
  const { refetchBudgets } = useBudgetSummary({ profile });
  const { loading, error, success, addTransaction } = useEditTransactions({ profile, refetchExpenses, refetchBudgets });

  const isRTL = I18nManager.isRTL;

  return (
    <LinearGradient
      colors={['#f8fafc', '#eef2f7', '#e5eaf1']}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView
        className="flex-1 px-4 pt-6"
        contentContainerStyle={{ paddingBottom: 24 }}
        // android: כיוון פריסה לרכיבים פנימיים כמו pickers/custom views
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      >
        {/* Title */}
        <View className="items-center mb-6">
          <Text className="text-2xl font-bold text-slate-800" style={{ writingDirection: 'rtl', textAlign: 'center' }}>
            הוספת עסקה
          </Text>
          <View className="h-1 w-12 bg-blue-500 rounded-full mt-2" />
        </View>

        {/* Status Messages */}
        {loading && <View className="items-center py-4"><LoadingSpinner /></View>}

        {error && (
          <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <View className="flex-row-reverse items-center">
              <Ionicons name="alert-circle" size={20} color="#DC2626" />
              <Text className="text-red-600 mr-2" style={{ writingDirection: 'rtl', textAlign: 'right' }}>
                {error}
              </Text>
            </View>
          </View>
        )}

        {success && (
          <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <View className="flex-row-reverse items-center">
              <Ionicons name="checkmark-circle" size={20} color="#059669" />
              <Text className="text-green-600 mr-2" style={{ writingDirection: 'rtl', textAlign: 'right' }}>
                {success}
              </Text>
            </View>
          </View>
        )}

        {/* קטגוריה */}
        <View className="bg-white/95 rounded-2xl p-5 shadow-sm border border-slate-200/50 mb-4">
          <Text
            className="text-slate-700 font-semibold mb-2 text-base self-end text-right"
            style={{ writingDirection: 'rtl', textAlign: 'right' }}
          >
            קטגוריה
          </Text>
          <View style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <CategorySelect
              refId={profile.expenses}
              setSelectedCategory={setSelectedCategory}
            />
          </View>
        </View>

        {/* עסק */}
        <View className="bg-white/95 rounded-2xl p-5 shadow-sm border border-slate-200/50 mb-4">
          <Text
            className="text-slate-700 font-semibold mb-2 text-base self-end text-right"
            style={{ writingDirection: 'rtl', textAlign: 'right' }}
          >
            עסק
          </Text>
          <View style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <BusinessSelects
              refId={profile.expenses}
              category={selectedCategory}
              setSelectedBusiness={setSelectedBusiness}
            />
          </View>
        </View>

        {/* תאריך העסקה */}
        <View className="bg-white/95 rounded-2xl p-5 shadow-sm border border-slate-200/50 mb-4">
          <Text
            className="text-slate-700 font-semibold mb-2 text-base self-end text-right"
            style={{ writingDirection: 'rtl', textAlign: 'right' }}
          >
            תאריך העסקה
          </Text>

          <TouchableOpacity
            onPress={() => setVisibleDate(true)}
            className="rounded-lg p-3 border border-slate-200 bg-slate-50"
            style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between' }}
            accessibilityRole="button"
            accessibilityLabel="בחר תאריך עסקה"
          >
            <Text className="text-slate-600" style={{ writingDirection: 'rtl', textAlign: 'right' }}>
              {date ? formatDate(date) : 'בחר תאריך'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#64748b" />
          </TouchableOpacity>

          <DateTimePicker
            isVisible={isVisibleDate}
            mode="date"
            date={date || new Date()}
            onConfirm={(d) => { setVisibleDate(false); setDate(d); }}
            onCancel={() => setVisibleDate(false)}
          />
        </View>

        {/* פרטי העסקה */}
        <View className="bg-white/95 rounded-2xl p-5 shadow-sm border border-slate-200/50 mb-4">
          <Text
            className="text-slate-700 font-semibold mb-2 text-base self-end text-right"
            style={{ writingDirection: 'rtl', textAlign: 'right' }}
          >
            פרטי העסקה
          </Text>

          <TextInput
            placeholder="תיאור העסקה"
            value={description}
            onChangeText={setDescription}
            className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-3"
            style={{ textAlign: 'right', writingDirection: 'rtl' }}
          />

          <View
            className="bg-slate-50 p-3 rounded-lg border border-slate-200"
            style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}
          >
            <TextInput
              placeholder="סכום"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              className="flex-1"
              style={{ textAlign: 'right', writingDirection: 'rtl' }}
            />
            <Text className="text-slate-500" style={{ marginStart: 8 }}>₪</Text>
          </View>
        </View>

        {/* Submit Button */}
        <View className="mb-8">
          <Button
            onPress={() =>
              addTransaction(
                { selectedCategory, selectedBusiness, amount, date: date || new Date(), description },
                { setSelectedCategory, setSelectedBusiness, setAmount, setDate, setDescription }
              )
            }
            className="py-3 bg-blue-600 rounded-lg"
            disabled={!selectedCategory || !selectedBusiness || !amount || amount === '0'}
            style={{ opacity: (!selectedCategory || !selectedBusiness || !amount || amount === '0') ? 0.7 : 1 }}
          >
            <View
              style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
              className="items-center justify-center"
            >
              <Ionicons name="add-circle-outline" size={20} color="white" style={{ marginStart: 8 }} />
              <Text className="text-white font-bold text-base">הוסף הוצאה</Text>
            </View>
          </Button>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
