import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import useEditTransactions from '../../hooks/useEditTransactions.js';
import { formatDate } from '../../utils/formatters.js';
import Button from '../common/button.jsx';
export default function ChangeTransactionDate({ goBack, transaction }) {
    const { error, loading, success, changeTransactionDate, resetState } = useEditTransactions({ goBack });
    const [newDate, setNewDate] = useState(null);
    const [isVisibleDate, setVisibleDate] = useState(false);

    const handleChangeDate = () => {
        if (transaction && newDate) {
            changeTransactionDate(transaction, newDate);
        }
    };

    useEffect(() => {
        resetState();
    }, []);

    return (
        <View>
            {!success && <>
                <Text>שינוי תאריך עסקה</Text>
                {error && <Text>{error}</Text>}
                <Button onPress={() => setVisibleDate(true)}>{newDate ? formatDate(newDate) : 'בחר תאריך'}</Button>
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
                <Button onPress={handleChangeDate} disabled={loading}>
                    {loading ? 'טוען...' : 'שנה תאריך'}
                </Button>
                <Button onPress={goBack}>חזור</Button></>}
            {success && <Text>תאריך העסקה עודכן בהצלחה!</Text>}
        </View>
    );
}
