import { memo } from 'react';
import { Text, View } from 'react-native';
import { formatAmount, formatDate } from "../../utils/formatters";
import Button from '../common/button';

const ExpenseCard = ({ expense, onOpenEditor }) => {
  if (!expense) return null;

  const { amount, date, description, category, business } = expense;

  return (
    <View className="bg-white border border-gray-200 rounded-lg mb-3 p-3 shadow-sm">
      {/* Tags */}
      <View className="flex-row flex-wrap mb-2 gap-1">
        <View className="bg-blue-100 rounded-full px-2 py-1">
          <Text className="text-blue-800">{category}</Text>
        </View>
        <View className="bg-gray-100 rounded-full px-2 py-1">
          <Text className="text-gray-800">{business}</Text>
        </View>
      </View>

      {/* Date + Amount */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-gray-500">{formatDate(date)}</Text>
        <Text className="font-bold text-red-600 text-lg">{formatAmount(amount)}</Text>
      </View>

      {/* Description */}
      <Text
        className="text-gray-800 font-medium mb-2 border-b border-gray-200"
        numberOfLines={2}
      >
        {description}
      </Text>

      {/* Actions */}
      <View className="flex-row justify-between mt-2">
        <Button
          textClass="text-sm"
          size="small"
          className="flex-1 mx-1"
          onPress={() => onOpenEditor('editMenu', expense)}
        >
          עריכה
        </Button>
        <Button
          textClass="text-sm"
          size="small"
          className="flex-1 mx-1"
          style="danger"
          onPress={() => onOpenEditor('delete', expense)}
        >
          מחיקה
        </Button>
      </View>
    </View>
  );
};

const MemoizedExpenseCard = memo(ExpenseCard);

export default function ExpensesTable({ filteredExpenses, onOpenEditor }) {
  const expenses = Array.isArray(filteredExpenses) ? filteredExpenses : [];

  if (expenses.length === 0) {
    return (
      <View className="py-8 items-center">
        <Text className="text-gray-500">אין עסקאות להצגה עם הסינון הנוכחי</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 2 }}>
      {expenses.map(expense => (
        <MemoizedExpenseCard key={expense._id || `exp-${expense.date}-${expense.amount}`} expense={expense} onOpenEditor={onOpenEditor} />
      ))}
    </View>
  );
}
