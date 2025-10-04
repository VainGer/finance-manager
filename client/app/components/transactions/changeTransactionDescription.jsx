import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useEditTransactions from '../../hooks/useEditTransactions.js';
import Button from '../common/button.jsx';

export default function ChangeTransactionDescription({ goBack, transaction, onSuccess }) {
    const { error, loading, changeTransactionDescription, resetState } = useEditTransactions({ goBack });
    const [newDescription, setNewDescription] = useState('');

    useEffect(() => {
        resetState();
    }, []);

    const handleChangeDescription = async () => {
        if (transaction && newDescription.trim()) {
            const result = await changeTransactionDescription(transaction, newDescription.trim(), { silent: true });
            if (result?.ok) {
                onSuccess('תיאור העסקה עודכן בהצלחה!');
            }
        }
    };

    return (
        <View className="w-full max-w-sm mx-auto">
            {/* Title */}
            <View className="items-center mb-4">
                <Ionicons name="create-outline" size={40} color="#3b82f6" />
                <Text className="mt-2 text-lg font-bold text-slate-800">שינוי תיאור עסקה</Text>
            </View>

            {/* Error Banner */}
            {error && (
                <View className="bg-red-50 border-2 border-red-200 rounded-xl py-2 px-3 mb-4">
                    <View className="flex-row-reverse items-center justify-center">
                        <Ionicons name="alert-circle" size={18} color="#DC2626" />
                        <Text className="text-sm text-right text-red-600 mr-2">{error}</Text>
                    </View>
                </View>
            )}

            {/* Input */}
            <TextInput
                className="border border-slate-300 p-2 mb-4 rounded-xl text-right w-full"
                value={newDescription}
                onChangeText={setNewDescription}
                placeholder="הזן תיאור חדש"
                multiline
            />

            {/* Buttons */}
            <View className="flex items-center">
                <Button onPress={handleChangeDescription} disabled={loading}>
                    {loading ? 'שומר...' : 'שנה תיאור'}
                </Button>
                <Button style="secondary" onPress={goBack}>
                    ביטול
                </Button>
            </View>
        </View>
    );
}
