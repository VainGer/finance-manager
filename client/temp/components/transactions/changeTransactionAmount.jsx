import { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import useEditTransaction from '../../hooks/useEditTransactions.js';
import Button from '../common/button.jsx';
export default function ChangeTransactionAmount({ profile, transaction, refetchExpenses, refetchBudgets, goBack }) {
    const [newAmount, setNewAmount] = useState('');
    const { error, success, loading, changeTransactionAmount, resetState } = useEditTransaction({ profile, refetchExpenses, refetchBudgets });

    const handleChangeAmount = () => {
        changeTransactionAmount(transaction, newAmount);
    };

    useEffect(() => {
        resetState();
    }, [profile]);

    return (
        <View >
            {!success && <>
                <Text>שינוי סכום עסקה</Text>
                {error && <Text>{error}</Text>}
                <TextInput
                    value={newAmount}
                    onChangeText={setNewAmount}
                    placeholder="סכום חדש"
                    keyboardType="numeric"
                />
                <Button onPress={handleChangeAmount} disabled={loading}>
                    {loading ? 'טוען...' : 'שנה סכום'}
                </Button>
                <Button onPress={goBack}>ביטול</Button>
            </>}
            {success && <Text>הסכום שונה בהצלחה!</Text>}
        </View>
    );
}


