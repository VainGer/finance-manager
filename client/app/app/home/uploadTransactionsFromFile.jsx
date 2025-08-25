import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import Button from "../../components/common/button";
import LoadingSpinner from '../../components/common/loadingSpinner';
import { useAuth } from '../../context/AuthContext';
import useEditBusiness from '../../hooks/useEditBusiness';
import useEditCategories from '../../hooks/useEditCategories';
import useUploadTransactionsFromFile from '../../hooks/useUploadTransactionsFromFile';

import CreateBusiness from '../../components/business/createBusiness.jsx';
import AddCategory from '../../components/categories/createCategory.jsx';

export default function UploadTransactionsFromFile() {
    const router = useRouter();
    const { profile } = useAuth();
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showBusinessModal, setShowBusinessModal] = useState(false);

    // Initialize category and business management hooks
    const {
        error: categoryError,
        success: categorySuccess,
        loading: categoryLoading,
        addCategory
    } = useEditCategories({ profile, goBack: () => setShowCategoryModal(false) });

    const {
        error: businessError,
        success: businessSuccess,
        loading: businessLoading,
        addBusiness
    } = useEditBusiness({ profile, goBack: () => setShowBusinessModal(false) });

    const {
        selectedFile,
        dataToUpload,
        categorizedTransactions,
        selects,
        categories,
        refreshCounter,
        isProcessing,
        isSubmitting,
        submitSuccess,
        error,
        pickFile,
        clearFile,
        handleUpdateTransaction,
        handleToggleUpload,
        handleSubmitTransactions,
        getSelects,
        processTransactions,
        getBusinessesForCategory,
        loading,
        setDataToUpload
    } = useUploadTransactionsFromFile();

    // Handle successful creation of a category or business
    const handleCreationSuccess = () => {
        // Reprocess the data to update categories and businesses
        if (selectedFile && processTransactions) {
            processTransactions();
        }
    };

    // Update when new category is added successfully
    useEffect(() => {
        if (categorySuccess) {
            // Close modal after a short delay
            const timer = setTimeout(() => {
                setShowCategoryModal(false);
                // Re-fetch categories by re-processing the data
                if (selectedFile && processTransactions) {
                    processTransactions();
                }
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [categorySuccess, selectedFile, processTransactions]);

    // Update when new business is added successfully
    useEffect(() => {
        if (businessSuccess) {
            // Close modal after a short delay
            const timer = setTimeout(() => {
                setShowBusinessModal(false);
                // Re-fetch businesses by re-processing the data
                if (selectedFile && processTransactions) {
                    processTransactions();
                }
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [businessSuccess, selectedFile, processTransactions]);

    useEffect(() => {
        if (categorizedTransactions && categorizedTransactions.length > 0) {
            const data = categorizedTransactions.map((transaction, index) => ({
                id: index,
                date: transaction.date,
                amount: transaction.amount,
                category: transaction.category,
                business: transaction.business.name,
                bank: transaction.business.bankName,
                description: transaction.business.bankName,
                toUpload: transaction.category && transaction.business
            }));
            setDataToUpload(data);
        }
    }, [categorizedTransactions]);


    const renderInstructionSteps = () => (
        <View className="bg-white p-6 rounded-lg shadow-md mb-6">
            <Text className="text-lg font-semibold text-slate-800 mb-4">איך זה עובד?</Text>

            <View className="space-y-4">
                <View className="flex-row">
                    <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center mr-2">
                        <Text className="text-white font-bold text-xs">1</Text>
                    </View>
                    <Text className="text-blue-800 flex-1"><Text className="font-bold">בחר קובץ: </Text>העלה קובץ אקסל או CSV מהבנק</Text>
                </View>

                <View className="flex-row">
                    <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center mr-2">
                        <Text className="text-white font-bold text-xs">2</Text>
                    </View>
                    <Text className="text-blue-800 flex-1"><Text className="font-bold">סווג: </Text>בחר קטגוריות לכל תנועה</Text>
                </View>

                <View className="flex-row">
                    <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center mr-2">
                        <Text className="text-white font-bold text-xs">3</Text>
                    </View>
                    <Text className="text-blue-800 flex-1"><Text className="font-bold">סמן: </Text>בחר אילו תנועות להעלות למערכת</Text>
                </View>

                <View className="flex-row">
                    <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center mr-2">
                        <Text className="text-white font-bold text-xs">4</Text>
                    </View>
                    <Text className="text-blue-800 flex-1"><Text className="font-bold">שמור: </Text>העלה את התנועות למערכת הניהול</Text>
                </View>
            </View>
        </View>
    );

    const renderFilePickerArea = () => (
        <View className="bg-white p-6 rounded-lg shadow-md">
            <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 bg-blue-500 rounded-lg items-center justify-center mr-4">
                    <Ionicons name="cloud-upload-outline" size={24} color="white" />
                </View>
                <View className="flex-1">
                    <Text className="text-lg font-semibold text-slate-800 mb-1">בחר קובץ תנועות</Text>
                    <Text className="text-slate-600 text-sm">
                        תומך בקבצי Excel (.xlsx, .xls) ו-CSV
                    </Text>
                </View>
            </View>

            <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <View className="flex-row">
                    <Ionicons name="alert-circle" size={18} color="#B45309" style={{ marginTop: 2, marginRight: 8 }} />
                    <Text className="text-yellow-800 text-sm flex-1">
                        <Text className="font-bold">טיפ: </Text>
                        ודא שהקובץ מכיל תנועות חדשות בלבד כדי למנוע כפילויות
                    </Text>
                </View>
            </View>

            {selectedFile ? (
                <View className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                    <View className="flex-row justify-between items-center">
                        <TouchableOpacity
                            onPress={clearFile}
                            className="w-8 h-8 bg-red-100 rounded-lg items-center justify-center"
                        >
                            <Ionicons name="close" size={16} color="#B91C1C" />
                        </TouchableOpacity>

                        <View className="flex-row items-center">
                            <Ionicons name="document-text-outline" size={18} color="#059669" style={{ marginRight: 6 }} />
                            <Text className="text-green-700 font-medium">{selectedFile.name}</Text>
                        </View>
                    </View>
                </View>
            ) : (
                <View className="items-center">
                    <Button
                        onPress={pickFile}
                        style="primary"
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="document-outline" size={18} color="white" style={{ marginRight: 8 }} />
                            <Text className="text-white font-medium">בחר קובץ</Text>
                        </View>
                    </Button>
                </View>
            )}

            {selectedFile && !isProcessing && !dataToUpload && (
                <View className="items-center mt-4">
                    <Button
                        onPress={processTransactions}
                        style="primary"
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="sync-outline" size={18} color="white" style={{ marginRight: 8 }} />
                            <Text className="text-white font-medium">עבד קובץ</Text>
                        </View>
                    </Button>
                </View>
            )}

            {isProcessing && (
                <View className="items-center mt-4">
                    <LoadingSpinner />
                    <Text className="text-slate-600 mt-2">מעבד נתונים...</Text>
                </View>
            )}

            {error && (
                <View className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                    <View className="flex-row">
                        <Ionicons name="alert-circle" size={18} color="#B91C1C" style={{ marginTop: 2, marginRight: 8 }} />
                        <View className="flex-1">
                            <Text className="font-bold text-red-800">שגיאה בעיבוד הקובץ</Text>
                            <Text className="text-red-700 mt-1">{error}</Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );

    const CategoryPicker = ({ transaction, categories, handleUpdateTransaction }) => {
        const handleCategoryChange = (value) => {
            if (transaction && transaction.id !== undefined) {
                handleUpdateTransaction(transaction.id, 'category', value);
            }
        };

        return (
            <View className="my-2">
                <View className="flex-row justify-between items-center mb-1">
                    <Text className="font-medium text-slate-700">קטגוריה:</Text>
                    <TouchableOpacity
                        onPress={() => setShowCategoryModal(true)}
                        className="flex-row items-center"
                    >
                        <Ionicons name="add-circle-outline" size={16} color="#3b82f6" />
                        <Text className="text-blue-500 ml-1 font-medium">הוסף חדש</Text>
                    </TouchableOpacity>
                </View>
                <View className="border border-slate-300 rounded-md overflow-hidden">
                    <Picker
                        selectedValue={(transaction?.category) || ""}
                        onValueChange={handleCategoryChange}
                        style={{ height: 56 }}
                        key={`cat-${transaction.id}-${refreshCounter}`} // Add key for refreshing when data changes
                    >
                        <Picker.Item label="בחר קטגוריה" value="" />
                        {Array.isArray(categories) && categories.map((category, index) => (
                            <Picker.Item key={`category-${index}`} label={category} value={category} />
                        ))}
                    </Picker>
                </View>
            </View>
        );
    };

    const BusinessPicker = ({ transaction, getBusinessesForCategory, handleUpdateTransaction }) => {
        const businesses = transaction?.category ?
            (getBusinessesForCategory(transaction.category) || []) :
            [];

        const handleBusinessChange = (value) => {
            if (transaction && transaction.id !== undefined) {
                handleUpdateTransaction(transaction.id, 'business', value);
            }
        };

        return (
            <View className="my-2">
                <View className="flex-row justify-between items-center mb-1">
                    <Text className="font-medium text-slate-700">עסק:</Text>
                    <TouchableOpacity
                        onPress={() => setShowBusinessModal(true)}
                        className="flex-row items-center"
                        disabled={!transaction?.category}
                    >
                        <Ionicons name="add-circle-outline" size={16} color={transaction?.category ? "#3b82f6" : "#94a3b8"} />
                        <Text className={transaction?.category ? "text-blue-500 ml-1 font-medium" : "text-slate-400 ml-1 font-medium"}>
                            הוסף חדש
                        </Text>
                    </TouchableOpacity>
                </View>
                <View className="border border-slate-300 rounded-md overflow-hidden">
                    <Picker
                        selectedValue={transaction?.business || ""}
                        onValueChange={handleBusinessChange}
                        style={{ height: 56 }}
                        enabled={!!transaction?.category}
                        key={`bus-${transaction.id}-${refreshCounter}`} // Add key for refreshing when data changes
                    >
                        <Picker.Item label="בחר עסק" value="" />
                        {Array.isArray(businesses) && businesses.map((business, index) => (
                            <Picker.Item key={`business-${index}`} label={business} value={business} />
                        ))}
                    </Picker>
                </View>
            </View>
        );
    };

    const CreateNewCategory = () => {
        const [showCreate, setShowCreate] = useState(false);
        return (
            <>
                <Button onPress={() => setShowCreate(true)} style="success" size="small">
                    <Text className="text-white">הוסף קטגוריה</Text>
                </Button>

                {showCreate && (
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        justifyContent: 'flex-end',
                        zIndex: 9999,
                        elevation: 10,
                    }}>
                        <View className="bg-white rounded-t-3xl max-h-[80%] overflow-hidden">
                            <View className="border-b border-slate-200 p-4">
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-lg font-semibold text-slate-800">הוספת קטגוריה חדשה</Text>
                                    <TouchableOpacity
                                        onPress={() => setShowCreate(false)}
                                        className="w-8 h-8 bg-slate-100 rounded-lg items-center justify-center"
                                    >
                                        <Ionicons name="close" size={20} color="#475569" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <AddCategory
                                goBack={() => setShowCreate(false)}
                                addCategory={addCategory}
                                error={categoryError}
                                success={categorySuccess}
                                onCategoryAdded={handleCreationSuccess}
                            />

                            <View className="p-4">
                                <Button
                                    onPress={() => setShowCreate(false)}
                                    style="primary"
                                    className="mt-4"
                                >
                                    <Text>סגור</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                )}
            </>
        );
    };

    const CreateNewBusiness = () => {
        const [showCreate, setShowCreate] = useState(false);
        return (
            <>
                <Button onPress={() => setShowCreate(true)} style="info" size="small">
                    <Text className="text-white">הוסף עסק</Text>
                </Button>

                {showCreate && (
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        justifyContent: 'flex-end',
                        zIndex: 9999,
                        elevation: 10,
                    }}>
                        <View className="bg-white rounded-t-3xl max-h-[80%] overflow-hidden">
                            <View className="border-b border-slate-200 p-4">
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-lg font-semibold text-slate-800">הוספת בעל עסק חדש</Text>
                                    <TouchableOpacity
                                        onPress={() => setShowCreate(false)}
                                        className="w-8 h-8 bg-slate-100 rounded-lg items-center justify-center"
                                    >
                                        <Ionicons name="close" size={20} color="#475569" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <CreateBusiness
                                refId={profile?.id}
                                goBack={() => setShowCreate(false)}
                                addBusiness={addBusiness}
                                error={businessError}
                                success={businessSuccess}
                                onBusinessAdded={handleCreationSuccess}
                            />

                            <View className="p-4">
                                <Button
                                    onPress={() => setShowCreate(false)}
                                    style="primary"
                                    className="mt-4"
                                >
                                    <Text>סגור</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                )}
            </>
        );
    };

    const renderTransactionList = () => {
        if (!dataToUpload || dataToUpload.length === 0) return null;

        return (
            <View className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <View className="bg-slate-50 p-4 border-b border-slate-200">
                    <View className="flex-col">
                        <View className="flex-row items-center mb-3">
                            <View className="w-10 h-10 bg-slate-600 rounded-lg items-center justify-center mr-4">
                                <Ionicons name="document-text" size={20} color="white" />
                            </View>
                            <View>
                                <Text className="text-lg font-bold text-slate-800">עריכת תנועות ({dataToUpload.length})</Text>
                                <View className="flex-row mt-1">
                                    <Text className="text-sm text-slate-600 mr-4">מסומנות לעלייה: {dataToUpload.filter(t => t.toUpload).length}</Text>
                                    <Text className="text-sm text-slate-600">סך הכל: ₪{dataToUpload.reduce((sum, t) => sum + Math.abs(t.amount), 0).toLocaleString()}</Text>
                                </View>
                            </View>
                        </View>

                        <View className="flex-1 gap-3">
                            <CreateNewCategory />
                            <CreateNewBusiness />
                        </View>
                    </View>
                </View>

                <View className="px-4 pt-4">
                    {Array.isArray(dataToUpload) && dataToUpload.length > 0 ? (
                        dataToUpload.map((transaction) => (
                            <View
                                key={`transaction-${transaction.id}-${refreshCounter}`}
                                className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4"
                            >
                                {/* Transaction Header */}
                                <View className="flex-row justify-between items-center border-b border-slate-200 pb-3 mb-3">
                                    <View className="flex-1">
                                        <Text className="text-sm text-slate-600">{transaction.date}</Text>
                                        <Text className="text-lg font-bold text-red-600">₪{Math.abs(transaction.amount).toLocaleString()}</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Text className="text-xs text-slate-500 mr-2">להעלות</Text>
                                        <Switch
                                            value={transaction.toUpload}
                                            onValueChange={() => handleToggleUpload(transaction.id)}
                                            trackColor={{ false: '#e2e8f0', true: '#4ade80' }}
                                            thumbColor={transaction.toUpload ? '#16a34a' : '#f9fafb'}
                                            key={`switch-${transaction.id}-${refreshCounter}`}
                                        />
                                    </View>
                                </View>

                                {/* Bank Info */}
                                <View className="bg-white rounded-lg p-3 border border-slate-100 mb-3">
                                    <Text className="text-xs text-slate-500 mb-1">{transaction.bank}</Text>
                                    <Text className="text-sm text-slate-700">{transaction.description}</Text>
                                </View>

                                {/* Category and Business Selectors */}
                                <View className="space-y-3">
                                    <CategoryPicker
                                        transaction={transaction}
                                        categories={categories}
                                        handleUpdateTransaction={handleUpdateTransaction}
                                    />
                                    <BusinessPicker
                                        transaction={transaction}
                                        getBusinessesForCategory={getBusinessesForCategory}
                                        handleUpdateTransaction={handleUpdateTransaction}
                                    />
                                </View>
                            </View>
                        ))
                    ) : (
                        <View className="py-10 items-center">
                            <Text className="text-slate-500">אין תנועות להצגה</Text>
                        </View>
                    )}
                </View>

                <View className="bg-slate-50 border-t border-slate-200 p-6">
                    <View className="flex-col">
                        <View className="flex-1 mb-4">
                            <Text className="text-lg font-semibold text-slate-800 mb-2">מה יקרה לאחר ההעלאה?</Text>
                            <View className="space-y-4">
                                <View className="space-y-2">
                                    <View className="flex-row items-center mb-2">
                                        <Ionicons name="clipboard-outline" size={16} color="#3b82f6" style={{ marginRight: 8 }} />
                                        <Text className="text-slate-700">התנועות יתווספו לדשבורד הראשי</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Ionicons name="stats-chart-outline" size={16} color="#3b82f6" style={{ marginRight: 8 }} />
                                        <Text className="text-slate-700">הגרפים והדוחות יתעדכנו אוטומטית</Text>
                                    </View>
                                </View>
                                <View className="mt-2">
                                    <View className="flex-row items-center mb-2">
                                        <Ionicons name="create-outline" size={16} color="#3b82f6" style={{ marginRight: 8 }} />
                                        <Text className="text-slate-700">תוכל לערוך כל תנועה בהמשך</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Ionicons name="cash-outline" size={16} color="#3b82f6" style={{ marginRight: 8 }} />
                                        <Text className="text-slate-700">התקציבים יחושבו מחדש</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View className="items-end mt-4">
                            <View className="bg-slate-100 rounded-lg px-3 py-2 mb-3">
                                <Text className="text-slate-700 text-sm">
                                    <Text className="font-bold">{dataToUpload.filter(t => t.toUpload).length}</Text> תנועות מסומנות לעלייה
                                </Text>
                            </View>

                            <Button
                                onPress={handleSubmitTransactions}
                                disabled={isSubmitting || dataToUpload.filter(t => t.toUpload).length === 0}
                                style="primary"
                                size="large"
                            >
                                {isSubmitting ? (
                                    <View className="flex-row items-center">
                                        <LoadingSpinner size="small" color="white" />
                                        <Text className="text-white ml-2">מעלה נתונים...</Text>
                                    </View>
                                ) : (
                                    <View className="flex-row items-center">
                                        <Ionicons name="cloud-upload-outline" size={18} color="white" style={{ marginRight: 8 }} />
                                        <Text className="text-white font-semibold">
                                            העלה {dataToUpload.filter(t => t.toUpload).length} תנועות למערכת
                                        </Text>
                                    </View>
                                )}
                            </Button>

                            {dataToUpload.filter(t => t.toUpload).length === 0 && (
                                <Text className="text-sm text-amber-600 text-right mt-2">יש לסמן לפחות תנועה אחת לעלייה</Text>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        );
    };


    const renderCategoryModal = () => {
        if (!showCategoryModal) return null;

        return (
            <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999
            }}>
                <View style={{
                    backgroundColor: 'white',
                    width: '90%', 
                    maxWidth: 400,
                    borderRadius: 16,
                    padding: 24,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                }}>
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-xl font-bold text-slate-800">הוספת קטגוריה חדשה</Text>
                        <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                            <Ionicons name="close" size={24} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <AddCategory
                            addCategory={addCategory}
                            goBack={() => setShowCategoryModal(false)}
                            error={categoryError}
                            success={categorySuccess}
                            onCategoryAdded={() => {
                                // Refresh data when category is added
                                if (processTransactions) {
                                    // Refresh the categories list if possible
                                    processTransactions();
                                }
                            }}
                        />
                    </ScrollView>

                    {categorySuccess && (
                        <View className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <Text className="text-green-700">הקטגוריה נוצרה בהצלחה!</Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    // Modal for adding a new business
    const renderBusinessModal = () => {
        if (!showBusinessModal) return null;

        return (
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                    elevation: 10,
                }}
            >
                <View style={{
                    backgroundColor: 'white',
                    width: '90%',
                    maxWidth: 400,
                    maxHeight: '90%',
                    borderRadius: 16,
                    padding: 24,
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    overflow: 'hidden'
                }}>
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-xl font-bold text-slate-800">הוספת עסק חדש</Text>
                        <TouchableOpacity onPress={() => setShowBusinessModal(false)}>
                            <Ionicons name="close" size={24} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <CreateBusiness
                            refId={profile?.id}
                            addBusiness={addBusiness}
                            goBack={() => setShowBusinessModal(false)}
                            error={businessError}
                            success={businessSuccess}
                            onBusinessAdded={(categoryName) => {
                                // Refresh data when business is added
                                if (processTransactions) {
                                    // Refresh the businesses list if possible
                                    processTransactions();
                                }
                            }}
                        />
                    </ScrollView>

                    {businessSuccess && (
                        <View className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <Text className="text-green-700">העסק נוצר בהצלחה!</Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    // Render with ScrollView to prevent nesting virtualized lists
    return (
        <View style={{ flex: 1 }}>
            <ScrollView className="flex-1 bg-slate-50 p-4">
                <View className="mb-6">
                    {/* Main content */}

                    {/* Header */}
                    <View className="bg-white rounded-2xl shadow-md p-6 mb-6">
                        <View className="flex-row justify-between items-center">
                            <View className="flex-row items-center">
                                <View className="w-12 h-12 bg-slate-700 rounded-xl items-center justify-center mr-4">
                                    <Ionicons name="cloud-upload-outline" size={24} color="white" />
                                </View>
                                <View>
                                    <Text className="text-2xl font-bold text-slate-800 mb-1">העלאת תנועות מקובץ</Text>
                                    <Text className="text-slate-600 text-sm">העלה תנועות בנק, ערוך קטגוריות ובעלי עסקים</Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={() => router.back()}
                                className="flex-row items-center bg-slate-100 px-4 py-2 rounded-xl border border-slate-200"
                            >
                                <Ionicons name="arrow-back" size={16} color="#64748b" style={{ marginRight: 8 }} />
                                <Text className="font-semibold text-slate-700">חזור</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {renderInstructionSteps()}
                    {renderFilePickerArea()}

                    {submitSuccess && (
                        <View className="bg-green-50 border-l-4 border-green-500 rounded-xl p-6 shadow-sm mb-6">
                            <View className="flex-row items-center">
                                <View className="w-8 h-8 bg-green-500 rounded-full items-center justify-center mr-3">
                                    <Ionicons name="checkmark" size={20} color="white" />
                                </View>
                                <View>
                                    <Text className="font-bold text-green-800">הצלחה!</Text>
                                    <Text className="text-green-700">התנועות הועלו בהצלחה למערכת.</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {dataToUpload && dataToUpload.length > 0 && renderTransactionList()}
                </View>
            </ScrollView>

            {/* Render modals as siblings to ScrollView */}
            {renderCategoryModal()}
            {renderBusinessModal()}
        </View>
    );
}
