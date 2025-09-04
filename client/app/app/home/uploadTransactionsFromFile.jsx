import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from "../../context/AuthContext";
import useUploadTransactionsFromFile from '../../hooks/useUploadTransactionsFromFile.js';
import Button from "../../components/common/button";
import LoadingSpinner from '../../components/common/loadingSpinner';
import CreateBusiness from '../../components/business/createBusiness.jsx';
import AddCategory from '../../components/categories/createCategory.jsx';
import CategorySelect from '../../components/categories/categorySelect';
import BusinessSelect from '../../components/business/businessSelect';

export default function UploadTransactionsFromFile() {
    const { profile } = useAuth();

    const { handleFileSelect,
        processTransactions,
        handleCategoryChange,
        handleBusinessChange,
        handleUploadSwitch,
        selectedFile, dataToUpload, error, loading, success } = useUploadTransactionsFromFile({ profile });

    const InstructionStep = ({ number, bold, text }) => {
        return (
            <View className="flex-row mb-4">
                <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center mr-2">
                    <Text className="text-white font-bold text-xs">{number}</Text>
                </View>
                <Text className="text-blue-800 flex-1"><Text className="font-bold">{bold}: </Text>{text}</Text>
            </View>
        );
    };

    const Instructions = () => {
        return (
            <View className="bg-blue-100/50 p-4 rounded-lg">
                <View className="flex-row mb-4">
                    <Ionicons name="information-circle-outline" size={32} color="blue" />
                    <Text className="font-extrabold text-2xl mx-auto text-blue-800">איך זה עובד?</Text>
                </View>
                <InstructionStep number={1}
                    bold="העלה קובץ"
                    text="בחר קובץ Excel או CSV עם תנועות הבנק שלך" />
                <InstructionStep number={2}
                    bold="עבד נתונים"
                    text="המערכת תנתח ותכין את התנועות לעריכה" />
                <InstructionStep number={3}
                    bold="ערוך ושייך"
                    text="תוכל לערוך קטגוריות ובעלי עסקים לכל תנועה" />
                <InstructionStep number={4}
                    bold="שמור"
                    text="העלה את התנועות הסופיות למערכת הניהול שלך" />
            </View>
        );
    }

    const FilePicker = () => {
        return (
            <View className="mt-6 space-y-4">
                <Text className="font-bold text-xl mb-4">
                    בחר קובץ תנועות
                </Text>
                <Text className="text-l mb-4">
                    תומך בקבצי Excel (.xlsx, .xls) ו-CSV. הקובץ צריך לכלול עמודות: תאריך, סכום, ותיאור התנועה
                </Text>
                <View className="flex-row my-4 bg-yellow-100/50 p-4 rounded-lg border-2 border-yellow-200">
                    <Ionicons name="warning-outline" size={16} color="orange" />
                    <Text className="text-sm font-bold">טיפ: </Text>
                    <Text className="text-sm">וודא שהקובץ מכיל תנועות חדשות בלבד כדי למנוע כפילויות</Text>
                </View>
                <View>
                    <Button bg="#435c69" onPress={handleFileSelect}>{selectedFile ? selectedFile.name : "בחר קובץ"}</Button>
                    <Button onPress={processTransactions}>עבד נתונים</Button>
                </View>
            </View>
        );
    }

    const TransactionCard = ({ transaction }) => {
        const [selectedCategory, setSelectedCategory] = useState(transaction.category);
        const [selectedBusiness, setSelectedBusiness] = useState(transaction.business);
        const [toUpload, setToUpload] = useState(transaction.toUpload);

        //handle transaction object changes
        useEffect(() => {
            if (selectedCategory !== transaction.category) {
                handleCategoryChange(transaction.id, selectedCategory);
            }
        }, [selectedCategory]);
        useEffect(() => {
            if (selectedBusiness !== transaction.business) {
                handleBusinessChange(transaction.id, selectedBusiness);
            }
        }, [selectedBusiness]);
        useEffect(() => {
            if (toUpload !== transaction.toUpload) {
                handleUploadSwitch(transaction.id, toUpload);
            }
        }, [toUpload]);

        return (
            <View>
                <Text>תאריך: {transaction.date}</Text>
                <Text>סכום: {transaction.amount}</Text>
                <Text>עסק מהבנק: {transaction.bank}</Text>
                <CategorySelect refId={profile.expenses} initialValue={transaction.category ? transaction.category : ""} setSelectedCategory={setSelectedCategory} />
                <BusinessSelect refId={profile.expenses} initialValue={transaction.business ? transaction.business : ""} setSelectedBusiness={setSelectedBusiness} />
                <View className="flex-row items-center justify-between mt-2">
                    <Text>להעלות</Text>
                    <Switch value={toUpload} onValueChange={() => setToUpload(!toUpload)} />
                </View>
            </View>
        );
    }

    return (
        <ScrollView>
            {loading && <LoadingSpinner />}
            {!dataToUpload && (
                <>
                    <Instructions />
                    <FilePicker />
                </>
            )}
            {dataToUpload && dataToUpload.length > 0 && (
                <View>
                    {dataToUpload.map((transaction) => (
                        <TransactionCard key={transaction.id} transaction={transaction} />
                    ))}
                </View>
            )}
        </ScrollView>
    );
}