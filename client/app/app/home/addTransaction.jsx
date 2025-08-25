import { useState, useEffect } from 'react'
import { View, Text, TextInput } from 'react-native';
import { useAuth } from '../../context/AuthContext.jsx';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { formatDate } from '../../utils/formatters.js';
import CategorySelect from '../../components/categories/categorySelect.jsx';
import BusinessSelects from '../../components/business/businessSelect.jsx';
import LoadingSpinner from '../../components/common/loadingSpinner.jsx';
import Button from '../../components/common/button.jsx';
import useEditTransactions from '../../hooks/useEditTransactions.js';
import useBudgetSummary from '../../hooks/expenses/useBudgetSummary.js';
import useExpensesDisplay from '../../hooks/expenses/useExpensesDisplay.js';

export default function addTransaction() {
    const { profile } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBusiness, setSelectedBusiness] = useState('');
    const [isVisibleDate, setVisibleDate] = useState(false);
    const [date, setDate] = useState(null);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const { refetchExpenses } = useExpensesDisplay({ profile });
    const { refetchBudgets } = useBudgetSummary({ profile });
    const { loading, error, success, addTransaction } = useEditTransactions({ profile, refetchExpenses, refetchBudgets });

    return (
        <View>
            {loading && <LoadingSpinner />}
            <Text>הוספת עסקה</Text>
            {error && <Text className="text-red-600">{error}</Text>}
            {success && <Text className="text-green-600">{success}</Text>}
            <CategorySelect
                refId={profile.expenses}
                setSelectedCategory={setSelectedCategory} />
            <BusinessSelects refId={profile.expenses}
                category={selectedCategory}
                setSelectedBusiness={setSelectedBusiness} />
            <Button onPress={() => setVisibleDate(true)}>{date ? formatDate(date) : 'בחר תאריך'}</Button>
            <DateTimePicker
                isVisible={isVisibleDate}
                mode="date"
                date={new Date()}
                onConfirm={(d) => {
                    setVisibleDate(false);
                    setDate(d);
                }}
                onCancel={() => setVisibleDate(false)}
            />
            <TextInput placeholder='תיאור' value={description} onChangeText={setDescription} />
            <TextInput placeholder="סכום" keyboardType="numeric" value={amount} onChangeText={setAmount} />
            <Button onPress={() => addTransaction({
                selectedCategory,
                selectedBusiness,
                amount,
                date,
                description
            }, {
                setSelectedCategory,
                setSelectedBusiness,
                setAmount,
                setDate,
                setDescription
            })}>הוסף הוצאה</Button>
        </View>
    )
}