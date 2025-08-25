import { useEffect } from 'react';
import { View, Text } from 'react-native';
import Button from '../common/button.jsx';
import useEditTransaction from '../../hooks/useEditTransactions.js';
export default function DeleteTransaction({ profile, transaction, refetchExpenses, refetchBudgets, goBack }) {
    const { loading, error, success, deleteTransaction, resetState } = useEditTransaction({ profile, refetchBudgets, refetchExpenses });

    useEffect(() => {
        resetState();
    }, [profile]);

    const handleDelete = () => {
        deleteTransaction(transaction, goBack);
    };

    return (
        <View className="border-t-2 border-gray-200 text-center items-center justify-center p-4">
            {!success && <>
                {error && <Text>{error}</Text>}
                <Text>האם אתה בטוח?</Text>
                <Text>פעולה זו תמחק את העסקה לצמיתות</Text>
                <View className='flex-1 w-1/2'>
                    <Button style='danger' className='w-full' onPress={handleDelete} disabled={loading}>
                        {loading ? 'מוחק...' : 'כן, מחק'}
                    </Button>
                    <Button className='w-full' onPress={goBack}>ביטול</Button>
                </View>
            </>}
            {success && <Text>העסקה נמחקה בהצלחה</Text>}
        </View>
    );
}
