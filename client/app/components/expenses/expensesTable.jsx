import { memo, useCallback, useMemo, useState } from 'react';
import { Text, View} from 'react-native';
import { formatAmount, formatDate } from "../../utils/formatters";
import Button from '../common/button';
import ChangeTransactionAmount from '../transactions/changeTransactionAmount.jsx';
import ChangeTransactionDate from '../transactions/changeTransactionDate.jsx';
import ChangeTransactionDescription from '../transactions/changeTransactionDescription.jsx';
import DeleteTransaction from '../transactions/deleteTransaction.jsx';

const ExpenseCard = ({ expense }) => {
  const [editDisplay, setEditDisplay] = useState(null);

  const safeGoBack = useCallback(() => {
    setEditDisplay(null);
  }, []);

  const { amount, date, description, category, business } = expense || {};

  const displayToRender = () => {
    if (!editDisplay) return null;

    if (!expense) return null;

    switch (editDisplay) {
      case 'delete':
        return <DeleteTransaction
          transaction={expense}
          goBack={safeGoBack} />
      case 'changeAmount':
        return <ChangeTransactionAmount
          transaction={expense}
          goBack={safeGoBack} />
      case 'changeDate':
        return <ChangeTransactionDate
          transaction={expense}
          goBack={safeGoBack} />
      case 'changeDescription':
        return <ChangeTransactionDescription
          transaction={expense}
          goBack={safeGoBack} />
      default:
        return null;
    }
  }

  if (!expense) return null;

  return (
    <View
      className="bg-white border border-gray-200 rounded-lg mb-3 p-3 shadow-sm"
    >
      <View className="flex-row flex-wrap mb-2 gap-1">
        <View className="bg-blue-100 rounded-full px-2 py-1">
          <Text className="text-blue-800">{category}</Text>
        </View>
        <View className="bg-gray-100 rounded-full px-2 py-1">
          <Text className="text-gray-800">{business}</Text>
        </View>
      </View>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-gray-500">{formatDate(date)}</Text>
        <Text className="font-bold text-red-600 text-lg">{formatAmount(amount)}</Text>
      </View>
      <Text className="text-gray-800 mb-2 border-b-2 border-gray-200" numberOfLines={2}>{description}</Text>
      <View className="flex-row justify-center mt-1 pt-1 ">
        <Button textClass='text-sm' size='small' className='w-1/5 mx-2 text-center'
          onPress={() => setEditDisplay('changeAmount')}>עריכת סכום</Button>
        <Button textClass='text-sm' size='small' className='w-1/5 mx-2 text-center'
          onPress={() => setEditDisplay('changeDate')}>עריכת תאריך</Button>
        <Button textClass='text-sm' size='small' className='w-1/5 mx-2 text-center'
          onPress={() => setEditDisplay('changeDescription')}>עריכת תיאור</Button>
        <Button textClass='text-sm' size='small' className='w-1/5 mx-2 text-center' style='danger'
          onPress={() => setEditDisplay('delete')}>מחיקת עסקה</Button>
      </View>
      {displayToRender()}
    </View>
  );
}

const EmptyList = () => (
  <View className="py-8 items-center">
    <Text className="text-gray-500">אין עסקאות להצגה עם הסינון הנוכחי</Text>
  </View>
);

const MemoizedExpenseCard = memo(ExpenseCard, (prevProps, nextProps) => {
  return prevProps.expense?._id === nextProps.expense?._id &&
    prevProps.expense?.amount === nextProps.expense?.amount &&
    prevProps.expense?.date === nextProps.expense?.date &&
    prevProps.expense?.description === nextProps.expense?.description;
});

export default function ExpensesTable({ filteredExpenses }) {
  const expenses = Array.isArray(filteredExpenses) ? filteredExpenses : [];

  const totalAmount = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + (exp?.amount || 0), 0);
  }, [expenses]);

  return (
    <View className="mb-4">
      {/* Header */}
      <View className="flex-row justify-between items-center px-2 pb-2">
        <Text className="text-gray-700 font-medium">סה"כ: {expenses.length} עסקאות</Text>
        <Text className="text-gray-700 font-medium">
          סכום: {formatAmount(totalAmount)}
        </Text>
      </View>

      {expenses.length > 0 ? (
        <View style={{ padding: 2 }}>
          {expenses.map((expense) => expense && (
            <MemoizedExpenseCard
              key={expense._id || `expense-${expense.date}-${expense.amount}-${String(Math.random()).slice(2, 8)}`}
              expense={expense}
            />
          ))}
        </View>
      ) : (
        <EmptyList />
      )}
    </View>
  );
}