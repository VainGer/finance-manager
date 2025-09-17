import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import BusinessSelect from '../../components/business/businessSelect';
import CreateBusiness from '../../components/business/createBusiness.jsx';
import CategorySelect from '../../components/categories/categorySelect';
import AddCategory from '../../components/categories/createCategory.jsx';
import Button from "../../components/common/button";
import LoadingSpinner from '../../components/common/loadingSpinner';
import Overlay from '../../components/common/Overlay';
import { useAuth } from "../../context/AuthContext";
import useUploadTransactionsFromFile from '../../hooks/useUploadTransactionsFromFile.js';

export default function UploadTransactionsFromFile() {
    const { profile } = useAuth();

    const [showCreateCategory, setShowCreateCategory] = useState(false);
    const [showCreateBusiness, setShowCreateBusiness] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);


    const { handleFileSelect, processTransactions, handleCategoryChange,
        handleBusinessChange, handleUploadSwitch, addCategory, resetState,
        addBusiness, onCategoryAndBusinessAdded, handleSubmitTransactions, onSuccessUpload,
        dataToUpload, selectedFile, error,
        loading, success, categories,
        businesses, categoryLoading, businessLoading,
        getCategoriesError, getBusinessesError, getCategoriesLoading,
        getBusinessesLoading, categorySuccess, businessSuccess, categoryCreated,
        categoryError, businessError
    } = useUploadTransactionsFromFile({ profile });




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

    const TransactionCard = ({ transaction, handleCategoryChange, handleBusinessChange, handleUploadSwitch }) => {
        const [selectedCategory, setSelectedCategory] = useState(transaction.category);
        const [selectedBusiness, setSelectedBusiness] = useState(transaction.business);
        const [toUpload, setToUpload] = useState(transaction.toUpload);

        useEffect(() => {
            if (selectedCategory !== transaction.category) {
                handleCategoryChange(transaction.id, selectedCategory);
            }
            if (selectedBusiness !== transaction.business) {
                handleBusinessChange(transaction.id, selectedBusiness);
            }
            if (toUpload !== transaction.toUpload) {
                handleUploadSwitch(transaction.id, toUpload);
            }
        }, [selectedCategory, selectedBusiness, toUpload]);

        const handleCategorySelect = useCallback((value) => {
            setSelectedCategory(value);
        }, []);

        const handleBusinessSelect = useCallback((value) => {
            setSelectedBusiness(value);
        }, []);

        const handleUploadChange = useCallback(() => {
            setToUpload(!toUpload);
        }, [toUpload]);

        return (
            <View className="bg-white p-4 m-4 rounded-lg shadow shadow-black space-y-3 border border-slate-200">
                <View className="flex-1 items-center">
                    <Text className="font-bold text-xl text-center">עסק מהבנק</Text>
                    <Text className="text-lg text-center">{transaction.bank}</Text>
                </View>
                <View className="flex-row items-center justify-between w-1/2 mx-auto">
                    <Text className="font-bold text-lg">תאריך:</Text>
                    <Text className="text-lg">{transaction.date}</Text>
                </View>
                <View className="flex-row items-center justify-between w-1/2 mx-auto">
                    <Text className="font-bold text-lg">סכום:</Text>
                    <Text className="text-red-600 font-bold text-lg">{transaction.amount}</Text>
                </View>
                <CategorySelect
                    categories={categories}
                    loading={getCategoriesLoading}
                    error={getCategoriesError}
                    selectedCategory={selectedCategory}
                    initialValue={transaction.category ?? ""}
                    setSelectedCategory={handleCategorySelect}
                />
                <BusinessSelect
                    initialValue={transaction.category && transaction.business ? transaction.business : ""}
                    businesses={transaction.category ? businesses.find(b => b.category === transaction.category)?.businesses || [] : []}
                    loading={getBusinessesLoading}
                    error={getBusinessesError}
                    setSelectedBusiness={handleBusinessSelect}
                    selectedCategory={selectedCategory}
                />
                <View className="flex-row items-center justify-between mt-2">
                    <Text>להעלות</Text>
                    <Switch value={toUpload} onValueChange={handleUploadChange} />
                </View>
            </View>
        );
    };

    const SuccessOverlay = ({ isCategory, onClose }) => {
        return (
            <Overlay onClose={onClose}>
                <View className="bg-white rounded-xl shadow p-6 w-full mx-auto">
                    <View className="items-center mb-4">
                        <Ionicons name="checkmark-circle" size={60} color="#10b981" />
                        <Text className="text-2xl font-bold text-green-700 mt-4">
                            {isCategory ? "קטגוריה נוצרה בהצלחה!" : "עסק נוצר בהצלחה!"}
                        </Text>
                        <Text className="text-gray-600 text-center mt-2">
                            {isCategory
                                ? "הקטגוריה החדשה זמינה כעת לשימוש"
                                : "העסק החדש זמין כעת לשימוש"}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={onClose}
                        className="bg-green-500 py-4 rounded-xl mt-4 flex-row items-center justify-center"
                        activeOpacity={0.7}
                    >
                        <Text className="text-white font-bold text-center">אישור</Text>
                    </TouchableOpacity>
                </View>
            </Overlay>
        );
    };

    return (
        <View className="h-full">
            {showSuccessMessage && (
                <SuccessOverlay
                    isCategory={categoryCreated}
                    onClose={() => setShowSuccessMessage(false)}
                />
            )}
            {success && (
                <Overlay>
                    <View className="flex items-center justify-center">
                        <Text className="font-bold text-lg text-center">{success}</Text>
                    </View>
                </Overlay>
            )}
            {showCreateCategory && (
                <Overlay onClose={() => setShowCreateCategory(false)}>
                    <AddCategory
                        onCategoryAdded={() => onCategoryAndBusinessAdded(true)}
                        addCategory={addCategory}
                        refId={profile.expenses}
                        goBack={() => setShowCreateCategory(false)}
                        error={categoryError}
                        success={categorySuccess}
                        toGoBack={true}
                    />
                </Overlay>
            )}

            {showCreateBusiness && (
                <Overlay onClose={() => setShowCreateBusiness(false)}>
                    <CreateBusiness
                        goBack={() => setShowCreateBusiness(false)}
                        refId={profile.expenses}
                        error={businessError}
                        success={businessSuccess}
                        addBusiness={addBusiness}
                        onBusinessAdded={() => onCategoryAndBusinessAdded(false)}
                        categories={categories}
                        getCategoriesLoading={getCategoriesLoading}
                        getCategoriesError={getCategoriesError}
                    />
                </Overlay>
            )}
            {(categoryLoading || businessLoading || loading) && <LoadingSpinner />}
            {!dataToUpload && (
                <View className="p-6">
                    <Instructions />
                    <FilePicker />
                </View>
            )}
            {dataToUpload && dataToUpload.length > 0 && (
                <ScrollView className="mt-6 mb-20 space-y-4">
                    <View>
                        <Button onPress={resetState}>העלה קובץ אחר</Button>
                    </View>
                    <View>
                        <Button onPress={() => setShowCreateCategory(true)}>צור קטגוריה חדשה</Button>
                        <Button onPress={() => setShowCreateBusiness(true)}>צור עסק חדש</Button>
                    </View>
                    {dataToUpload.map((transaction) => (
                        <TransactionCard
                            key={`transaction-${transaction.id}`}
                            transaction={transaction}
                            handleCategoryChange={handleCategoryChange}
                            handleBusinessChange={handleBusinessChange}
                            handleUploadSwitch={handleUploadSwitch}
                        />
                    ))}
                    <Button onPress={handleSubmitTransactions}>שמור תנועות</Button>
                </ScrollView>
            )}
        </View>
    );
}