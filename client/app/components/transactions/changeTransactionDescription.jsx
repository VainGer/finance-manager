import { View, Text, TextInput } from 'react-native';
import { useState } from 'react';
import useEditTransactions from '../../hooks/useEditTransactions.js';
import Button from '../common/button.jsx';
export default function ChangeTransactionDescription({ profile, goBack, transaction, refetchExpenses }) {
    const { error, loading, success, changeTransactionDescription } = useEditTransactions({ profile });
    const [newDescription, setNewDescription] = useState('');

    const handleChangeDescription = () => {
        changeTransactionDescription(transaction, newDescription, refetchExpenses);
    };

    return (
        <View>
            {!success && <>
                {error && <Text>{error}</Text>}
                <Text>שינוי תיאור עסקה</Text>
                <TextInput
                    value={newDescription}
                    onChangeText={setNewDescription}
                    placeholder="הזן תיאור חדש"
                />
                <Button onPress={handleChangeDescription} disabled={loading}>
                    {loading ? 'טוען...' : 'שנה תיאור'}
                </Button>
                <Button onPress={goBack}>חזור</Button>
            </>}
            {success && <Text>{success}</Text>}
        </View>
    );
}
