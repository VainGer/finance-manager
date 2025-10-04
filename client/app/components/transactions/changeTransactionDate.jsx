import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import useEditTransactions from '../../hooks/useEditTransactions.js';
import { formatDate } from '../../utils/formatters.js';
import Button from '../common/button.jsx';

export default function ChangeTransactionDate({ goBack, transaction, onSuccess }) {
    const { error, loading, changeTransactionDate, resetState } = useEditTransactions({ goBack });
    const [newDate, setNewDate] = useState(null);
    const [isVisibleDate, setVisibleDate] = useState(false);

    useEffect(() => {
        resetState();
    }, []);

    const handleChangeDate = async () => {
        if (transaction && newDate) {
            const result = await changeTransactionDate(transaction, newDate, { silent: true });
            if (result?.ok) {
                onSuccess('תאריך העסקה עודכן בהצלחה!');
            }
        }
    };

    return (
        <View className="w-full max-w-sm mx-auto">
            {/* Title */}
            <View className="items-center mb-4">
                <Ionicons name="calendar-outline" size={40} color="#3b82f6" />
                <Text className="mt-2 text-lg font-bold text-slate-800">שינוי תאריך עסקה</Text>
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

            {/* Date Picker Button */}
            <Button
                style="info"
                onPress={() => setVisibleDate(true)}
                className="mb-4"
            >
                {newDate ? formatDate(newDate) : 'בחר תאריך'}
            </Button>

            <DateTimePicker
                isVisible={isVisibleDate}
                mode="date"
                date={new Date()}
                onConfirm={(d) => {
                    setVisibleDate(false);
                    setNewDate(d);
                }}
                onCancel={() => setVisibleDate(false)}
            />

            {/* Action Buttons */}
            <View className="flex items-center">
                <Button onPress={handleChangeDate} disabled={loading}>
                    {loading ? 'שומר...' : 'שנה תאריך'}
                </Button>
                <Button style="secondary" onPress={goBack}>
                    ביטול
                </Button>
            </View>
        </View>
    );
}
