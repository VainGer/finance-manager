import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useEditTransactions from '../../hooks/useEditTransactions.js';
import Button from '../common/button.jsx';

export default function ChangeTransactionAmount({ transaction, goBack, onSuccess }) {
    const [newAmount, setNewAmount] = useState('');
    const { error, loading, changeTransactionAmount, resetState } = useEditTransactions({ goBack });

    useEffect(() => {
        resetState();
    }, []);

    const handleChangeAmount = async () => {
        if (transaction && newAmount) {
            const result = await changeTransactionAmount(transaction, newAmount, { silent: true });
            if (result?.ok) {
                onSuccess('סכום העסקה עודכן בהצלחה!');
            }
        }
    };

    return (
        <View className="w-full max-w-sm mx-auto">
            {/* Title */}
            <View className="items-center mb-4">
                <Ionicons name="cash-outline" size={40} color="#3b82f6" />
                <Text className="mt-2 text-lg font-bold text-slate-800">שינוי סכום עסקה</Text>
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
                className="border border-slate-300 p-2 mb-4 rounded-xl w-full text-center"
                value={newAmount}
                onChangeText={(val) => setNewAmount(val.replace(/[^0-9.]/g, ''))}
                placeholder="סכום חדש"
                keyboardType="numeric"
            />

            {/* Buttons */}
            <View className="flex justify-between">
                <Button onPress={handleChangeAmount} disabled={loading}>
                    {loading ? 'שומר...' : 'שנה סכום'}
                </Button>
                <Button style="secondary" onPress={goBack}>
                    ביטול
                </Button>
            </View>
        </View>
    );
}
