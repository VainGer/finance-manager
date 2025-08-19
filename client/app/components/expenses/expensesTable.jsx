import { Pressable, Text, View } from 'react-native';
import { formatAmount, formatDate } from "../../utils/formatters";
import Button from '../../components/common/button';

const ExpenseCard = ({ expense }) => (
  <View
    className="bg-white border border-gray-200 rounded-lg mb-3 p-3 shadow-sm"
  >
    <View className="flex-row flex-wrap mb-2 gap-1">
      <View className="bg-blue-100 rounded-full px-2 py-1">
        <Text className="text-blue-800">{expense.category}</Text>
      </View>
      <View className="bg-gray-100 rounded-full px-2 py-1">
        <Text className="text-gray-800">{expense.business}</Text>
      </View>
    </View>
    <View className="flex-row justify-between items-center mb-2">
      <Text className="text-gray-500">{formatDate(expense.date)}</Text>
      <Text className="font-bold text-red-600 text-lg">{formatAmount(expense.amount)}</Text>
    </View>
    <Text className="text-gray-800 mb-2 border-b-2 border-gray-200" numberOfLines={2}>{expense.description}</Text>
    <View className="flex-row justify-center mt-1 pt-1 ">
      <Button textSize='sm' size='small' className='w-1/5 mx-2'>עריכת סכום</Button>
      <Button textSize='sm' size='small' className='w-1/5 mx-2'>עריכת תאריך</Button>
      <Button textSize='sm' size='small' className='w-1/5 mx-2'>עריכת תיאור</Button>
      <Button textSize='sm' size='small' className='w-1/5 mx-2' style='danger'>מחיקה</Button>
    </View>
  </View>
);

const EmptyList = () => (
  <View className="py-8 items-center">
    <Text className="text-gray-500">אין עסקאות להצגה עם הסינון הנוכחי</Text>
  </View>
);

export default function ExpensesTable({ filteredExpenses }) {
  return (
    <View className="mb-4">
      {/* Header */}
      <View className="flex-row justify-between items-center px-2 pb-2">
        <Text className="text-gray-700 font-medium">סה"כ: {filteredExpenses.length} עסקאות</Text>
        <Text className="text-gray-700 font-medium">
          סכום: {formatAmount(filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0))}
        </Text>
      </View>

      {filteredExpenses.length > 0 ? (
        <View style={{ padding: 2 }}>
          {filteredExpenses.map((expense, index) => (
            <ExpenseCard key={expense._id || index} expense={expense} />
          ))}
        </View>
      ) : (
        <EmptyList />
      )}
    </View>
  );
}