import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import useEditTransactions from '../../hooks/useEditTransactions.js';
import Button from '../common/button.jsx';
export default function ChangeTransactionDescription({ goBack, transaction }) {
    const { error, loading, success, changeTransactionDescription, resetState } = useEditTransactions({ goBack });
    const [newDescription, setNewDescription] = useState('');

    const handleChangeDescription = () => {
        if (transaction && newDescription) {
            changeTransactionDescription(transaction, newDescription);
        }
    };

    useEffect(() => {
        resetState();
    }, []);

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
