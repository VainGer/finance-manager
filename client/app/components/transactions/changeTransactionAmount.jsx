import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import useEditTransactions from '../../hooks/useEditTransactions.js';
import Button from '../common/button.jsx';
export default function ChangeTransactionAmount({ transaction, goBack }) {
    const [newAmount, setNewAmount] = useState('');
    const { error, success, loading, changeTransactionAmount, resetState } = useEditTransactions({ goBack });

    const handleChangeAmount = () => {
        if (transaction && newAmount) {
            changeTransactionAmount(transaction, newAmount);
        }
    };

    useEffect(() => {
        resetState();
    }, []);

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


