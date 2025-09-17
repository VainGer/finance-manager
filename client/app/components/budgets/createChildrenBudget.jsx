import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import useBudgets from '../../hooks/useBudgets';
import Button from '../common/button';

export default function CreateChildrenBudget({ setLoading, goBack }) {

    const { account, profile, childrenProfiles,
        addChildBudget, error, setError, success,
        setSuccess } = useBudgets({ setLoading });

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedChild, setSelectedChild] = useState('');

    const [isStartPickerVisible, setStartPickerVisible] = useState(false);
    const [isEndPickerVisible, setEndPickerVisible] = useState(false);


    const onSubmit = async () => {
        setError(null);
        if (!selectedChild || !startDate || !endDate || parseFloat(amount) <= 0) {
            setError('אנא מלא את כל השדות וודא שסכום התקציב גדול מאפס');
            return;
        }
        const ok = await addChildBudget({ profileName: selectedChild, startDate, endDate, amount });
        if (ok) {
            setSuccess('התקציב נוסף בהצלחה');
            setSelectedChild('');
            setStartDate('');
            setEndDate('');
            setAmount('');
        }
    };

    return (
        <ScrollView className="p-4 bg-white">
            {error ? <View className="mb-3 bg-red-50 border border-red-200 rounded-lg p-3"><Text className="text-red-700">{error}</Text></View> : null}
            {success ? <View className="mb-3 bg-green-50 border border-green-200 rounded-lg p-3"><Text className="text-green-700">{success}</Text></View> : null}

            <Text className="text-lg font-bold mb-2">הוספת תקציב לילד</Text>

            <Text className="mb-1">בחר ילד</Text>
            <View className="flex-1 border border-gray-300 rounded mb-3">
                <Picker
                    selectedValue={selectedChild}
                    onValueChange={(val) => setSelectedChild(val)}
                    mode="dropdown"
                >
                    <Picker.Item label="בחר פרופיל ילד" value="" />
                    {childrenProfiles.map((c, i) => (
                        <Picker.Item key={i} label={c.profileName} value={c.profileName} />
                    ))}
                </Picker>
            </View>

            <Text className="mb-1">תאריך התחלה</Text>
            <TouchableOpacity onPress={() => setStartPickerVisible(true)} className="border border-slate-200 rounded-lg p-3 mb-3">
                <Text className="text-slate-700">{startDate || 'בחר תאריך התחלה'}</Text>
            </TouchableOpacity>
            <DateTimePicker
                isVisible={isStartPickerVisible}
                mode="date"
                onConfirm={(date) => { setStartPickerVisible(false); setStartDate(date.toISOString().slice(0, 10)); }}
                onCancel={() => setStartPickerVisible(false)}
            />

            <Text className="mb-1">תאריך סיום</Text>
            <TouchableOpacity onPress={() => setEndPickerVisible(true)} className="border border-slate-200 rounded-lg p-3 mb-3">
                <Text className="text-slate-700">{endDate || 'בחר תאריך סיום'}</Text>
            </TouchableOpacity>
            <DateTimePicker
                isVisible={isEndPickerVisible}
                mode="date"
                onConfirm={(date) => { setEndPickerVisible(false); setEndDate(date.toISOString().slice(0, 10)); }}
                onCancel={() => setEndPickerVisible(false)}
            />

            <Text className="mb-1">סכום התקציב</Text>
            <TextInput
                value={String(amount)}
                onChangeText={(t) => setAmount(t.replace(/[^0-9.]/g, ''))}
                placeholder="0.00"
                keyboardType="numeric"
                className="border border-slate-200 rounded-lg p-3 mb-3 text-right"
            />

            <View className="mt-2">
                <Button style="success" onPress={onSubmit} disabled={!selectedChild || !startDate || !endDate || parseFloat(amount) <= 0}>הוסף תקציב לילד</Button>
            </View>
            <Button style="secondary" onPress={goBack}>חזרה</Button>
        </ScrollView>
    );
}
