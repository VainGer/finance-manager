import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useEditTransactions from '../../hooks/useEditTransactions.js';
import Button from '../common/button.jsx';

export default function DeleteTransaction({ transaction, goBack, onSuccess }) {
    const { loading, error, deleteTransaction, resetState } = useEditTransactions({ goBack });

    useEffect(() => {
        resetState();
    }, []);

    const handleDelete = async () => {
        if (transaction) {
            const result = await deleteTransaction(transaction, { silent: true });
            if (result?.ok) {
                onSuccess('העסקה נמחקה בהצלחה!');
            }
        }
    };

    return (
        <View className="w-full max-w-sm mx-auto">
            {/* Title */}
            <View className="items-center mb-4">
                <Ionicons name="trash" size={40} color="#ef4444" />
                <Text className="mt-2 text-lg font-bold text-slate-800">מחיקת עסקה</Text>
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

            {/* Confirmation Text */}
            <Text className="text-center font-bold mb-2">האם אתה בטוח שברצונך למחוק?</Text>
            <Text className="text-center text-red-500 font-semibold mb-6">
                פעולה זו תמחק את העסקה לצמיתות
            </Text>

            {/* Buttons */}
            <View className="flex-row justify-between">
                <View className="flex-1 mr-2">
                    <Button
                        style="danger"
                        onPress={handleDelete}
                        disabled={loading}
                    >
                        {loading ? 'מוחק...' : 'כן, מחק'}
                    </Button>
                </View>
                <View className="flex-1 ml-2">
                    <Button style="secondary" onPress={goBack}>
                        ביטול
                    </Button>
                </View>
            </View>
        </View>
    );
}
