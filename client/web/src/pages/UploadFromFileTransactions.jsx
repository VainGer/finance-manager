import { useState, useEffect } from "react";
import useUploadTransactionFile from "../hooks/useUploadTransactionFile";
import AddCategory from "../components/dashboard/expenses/categories/AddCategory";
import CreateBusiness from "../components/dashboard/expenses/businesses/CreateBusiness";
import { post } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import PageLayout from "../components/layout/PageLayout";
import NavigationHeader from "../components/layout/NavigationHeader";

export default function UploadFromFileTransactions() {
    const { profile } = useAuth();
    const {
        categorizedTransactions,
        selects,
        refreshCounter,
        getSelects,
        handleFileUpload,
        processTransactions,
    } = useUploadTransactionFile();

    const [dataToUpload, setDataToUpload] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

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
                toUpload: (transaction.category && transaction.business) ? true : false
            }));
            setDataToUpload(data);
        }
    }, [categorizedTransactions]);

    const handleUpdateTransaction = (id, field, value) => {
        setDataToUpload(prevData => {
            return prevData.map(item => {
                if (item.id === id) {
                    const updatedItem = { ...item, [field]: value };
                    if (field === 'category') {
                        updatedItem.business = '';
                    }
                    return updatedItem;
                }
                return item;
            });
        });
    };

    const handleSubmitTransactions = async () => {
        setIsSubmitting(true);
        setSubmitSuccess(false);

        try {
            const t = dataToUpload.map(t => {
                if (t.toUpload) {
                    return {
                        date: t.date,
                        amount: t.amount,
                        categoryName: t.category,
                        businessName: t.business,
                        description: `הועלה מקובץ: ${t.bank}`
                    };
                }
            });

            const transactionsToSubmit = dataToUpload.filter(t => t.toUpload);


            const response = await post(`profile/upload-transactions`, {
                username: profile.username,
                profileName: profile.profileName,
                refId: profile.expenses,
                transactionsToUpload: transactionsToSubmit
            });
            if (response.ok) {
            } else {
                console.error("Failed to submit transactions");
            }
        } catch (error) {
            console.error("Error submitting transactions:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getBusinessesForCategory = (category) => {
        const categoryData = selects.find(select => select.category === category);
        return categoryData ? categoryData.businesses : [];
    };


    const handleToggleUpload = (id, checked) => {
        setDataToUpload(prevData => {
            return prevData.map(item => {
                if (item.id === id) {
                    return { ...item, toUpload: checked };
                }
                return item;
            });
        });
    };

    const handleCreationSuccess = () => {
        getSelects();
    };

    const handleEnhancedFileUpload = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        handleFileUpload(event);
    };

    const handleClearFile = () => {
        setSelectedFile(null);
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
    };

    const handleEnhancedProcessTransactions = async () => {
        setIsProcessing(true);
        try {
            await processTransactions();
        } finally {
            setIsProcessing(false);
        }
    };

    const UploadFile = () => (
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            {/* Instructions Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-blue-100">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="flex-1 text-right">
                        <h2 className="text-xl font-bold text-blue-900 mb-2">איך זה עובד?</h2>
                        <div className="space-y-3 text-blue-800">
                            <div className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                                <p className="text-sm"><strong>העלה קובץ:</strong> בחר קובץ Excel או CSV עם תנועות הבנק שלך</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                                <p className="text-sm"><strong>עבד נתונים:</strong> המערכת תנתח ותכין את התנועות לעריכה</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                                <p className="text-sm"><strong>ערוך ושייך:</strong> תוכל לערוך קטגוריות ובעלי עסקים לכל תנועה</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                                <p className="text-sm"><strong>שמור:</strong> העלה את התנועות הסופיות למערכת הניהול שלך</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upload Section */}
            <div className="p-6">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex-1 text-right">
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">בחר קובץ תנועות</h3>
                        <p className="text-slate-600 text-sm mb-4">
                            תומך בקבצי Excel (.xlsx, .xls) ו-CSV. הקובץ צריך לכלול עמודות: תאריך, סכום, ותיאור התנועה
                        </p>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                            <div className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <p className="text-yellow-800 text-sm">
                                    <strong>טיפ:</strong> ודא שהקובץ מכיל תנועות חדשות בלבד כדי למנוע כפילויות
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-4 w-full max-w-[240px] mx-auto">
                        {/* File input area with fixed height */}
                        <div className="w-full flex justify-center items-center" style={{ minHeight: '80px' }}>
                            {!selectedFile ? (
                                <input
                                    type="file"
                                    accept=".xlsx, .xls, .csv"
                                    onChange={handleEnhancedFileUpload}
                                    className="w-full text-transparent file:w-full file:mr-0 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-slate-600 file:to-slate-700 file:text-white hover:file:from-slate-700 hover:file:to-slate-800 file:transition-all file:duration-200 file:cursor-pointer file:shadow-md hover:file:shadow-lg cursor-pointer"
                                />
                            ) : (
                                /* Selected File Display with Clear Button */
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4 w-full">
                                    <div className="flex items-center justify-between gap-3 text-right">
                                        <button
                                            onClick={handleClearFile}
                                            className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                                            title="הסר קובץ"
                                        >
                                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="text-right flex-1">
                                                <p className="text-sm font-medium text-green-800">קובץ נבחר:</p>
                                                <p className="text-sm text-green-700 truncate">{selectedFile.name}</p>
                                                <p className="text-xs text-green-600">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                            <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Button area - separate from file input */}
                        <div className="w-full flex justify-center">
                            <Button
                                onClick={handleEnhancedProcessTransactions}
                                disabled={!selectedFile || isProcessing}
                                style="primary"
                                size="auto"
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full text-center flex items-center justify-center"
                            >
                                {isProcessing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        מעבד נתונים...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        עבד נתונים
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const CategorySelect = ({ transaction }) => (
        <select
            key={`cat-${transaction.id}-${refreshCounter}`}
            value={transaction.category || ""}
            onChange={(e) => handleUpdateTransaction(transaction.id, 'category', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
            <option value="">בחר קטגוריה</option>
            {selects.map((select, index) => (
                <option key={index} value={select.category}>
                    {select.category}
                </option>
            ))}
        </select>
    );


    const BusinessSelect = ({ transaction }) => {
        const businessesForCategory = getBusinessesForCategory(transaction.category);
        return (
            <select
                key={`bus-${transaction.id}-${refreshCounter}`}
                value={transaction.business || ""}
                onChange={(e) => handleUpdateTransaction(transaction.id, 'business', e.target.value)}
                disabled={!transaction.category}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white disabled:bg-gray-100"
            >
                <option value="">בחר עסק</option>
                {businessesForCategory.map((business, index) => (
                    <option key={index} value={business}>
                        {business}
                    </option>
                ))}
            </select>
        );
    };

    const CreateNewCategory = () => {
        const [showCreate, setShowCreate] = useState(false);
        return (
            <>
                <Button onClick={() => setShowCreate(true)} style="success" size="small" className="shadow-sm">הוסף קטגוריה</Button>
                {showCreate && (
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-end items-start z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl border border-white/20 w-full max-w-md max-h-[90vh] overflow-auto mt-4">
                            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-slate-800">הוספת קטגוריה חדשה</h3>
                                    <button
                                        onClick={() => setShowCreate(false)}
                                        className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-0">
                                <AddCategory
                                    goBack={() => setShowCreate(false)}
                                    onCategoryAdded={handleCreationSuccess}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    };

    const CreateNewBusiness = () => {
        const [showCreate, setShowCreate] = useState(false);
        return (
            <>
                <Button onClick={() => setShowCreate(true)} style="info" size="small" className="shadow-sm">הוסף עסק</Button>
                {showCreate && (
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-end items-start z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl border border-white/20 w-full max-w-md max-h-[90vh] overflow-auto mt-4">
                            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-slate-800">הוספת בעל עסק חדש</h3>
                                    <button
                                        onClick={() => setShowCreate(false)}
                                        className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-0">
                                <CreateBusiness
                                    goBack={() => setShowCreate(false)}
                                    onBusinessAdded={handleCreationSuccess}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    return (
        <>
            <NavigationHeader />
            <PageLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-8">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-800 mb-1">העלאת תנועות מקובץ</h1>
                                    <p className="text-slate-600">העלה תנועות בנק, ערוך קטגוריות ובעלי עסקים, והוסף הכל למערכת הניהול שלך</p>
                                </div>
                            </div>

                            <div className="flex-shrink-0">
                                <button
                                    onClick={() => window.location.href = '/dashboard'}
                                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-semibold transition-colors border border-slate-200 hover:border-slate-300"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    חזור לדשבורד
                                </button>
                            </div>
                        </div>
                    </div>

                    <UploadFile />

                    {submitSuccess && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold text-green-800">הצלחה!</p>
                                    <p className="text-green-700">התנועות הועלו בהצלחה למערכת.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {dataToUpload && dataToUpload.length > 0 && (
                        <>
                            {/* What you can do section */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 shadow-lg p-6 mb-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 text-right">
                                        <h3 className="text-xl font-bold text-green-900 mb-3">מעולה! התנועות נטענו בהצלחה</h3>
                                        <div className="grid md:grid-cols-2 gap-4 text-green-800">
                                            <div className="space-y-2">
                                                <h4 className="font-semibold text-green-900">מה תוכל לעשות עכשיו:</h4>
                                                <ul className="text-sm space-y-1">
                                                    <li className="flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        שייך כל תנועה לקטגוריה מתאימה
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        בחר או צור בעל עסק לכל תנועה
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        סמן אילו תנועות להעלות למערכת
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="font-semibold text-green-900">טיפים לעבודה יעילה:</h4>
                                                <ul className="text-sm space-y-1">
                                                    <li className="flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        צור קטגוריות ועסקים חדשים בעת הצורך
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        בדוק שכל תנועה מסומנת לעלייה
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        עריכה תשמר אוטומטית לכל שינוי
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                                {/* Transaction Statistics Header */}
                                <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 border-b border-slate-200">
                                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <div className="text-right">
                                                <h3 className="text-xl font-bold text-slate-800">עריכת תנועות ({dataToUpload.length})</h3>
                                                <div className="flex gap-6 text-sm text-slate-600 mt-1">
                                                    <span>מסומנות לעלייה: {dataToUpload.filter(t => t.toUpload).length}</span>
                                                    <span>סך הכל: ₪{dataToUpload.reduce((sum, t) => sum + Math.abs(t.amount), 0).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <CreateNewCategory />
                                            <CreateNewBusiness />
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Table View */}
                                <div className="hidden lg:block overflow-x-auto">
                                    <table className="min-w-full divide-y divide-slate-200">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        תאריך
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                        </svg>
                                                        סכום
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                        עסק (מהבנק)
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                        </svg>
                                                        קטגוריה
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        בעל עסק
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                        להעלות
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-slate-100">
                                            {dataToUpload.map((transaction) => (
                                                <tr key={transaction.id} className="hover:bg-slate-50 transition-colors duration-200">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">{transaction.date}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">₪{Math.abs(transaction.amount).toLocaleString()}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{transaction.bank}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm"><CategorySelect transaction={transaction} /></td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm"><BusinessSelect transaction={transaction} /></td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <input
                                                            type="checkbox"
                                                            checked={transaction.toUpload}
                                                            onChange={(event) => handleToggleUpload(transaction.id, event.target.checked)}
                                                            className="w-5 h-5 text-slate-600 border-2 border-slate-300 rounded focus:ring-slate-500 focus:ring-2"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="lg:hidden space-y-4 p-4">
                                    {dataToUpload.map((transaction) => (
                                        <div key={transaction.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4">
                                            {/* Transaction Header */}
                                            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                                                <div className="text-right flex-1">
                                                    <div className="text-sm text-slate-600">{transaction.date}</div>
                                                    <div className="text-lg font-bold text-red-600">₪{Math.abs(transaction.amount).toLocaleString()}</div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-500">להעלות</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={transaction.toUpload}
                                                        onChange={(event) => handleToggleUpload(transaction.id, event.target.checked)}
                                                        className="w-5 h-5 text-slate-600 border-2 border-slate-300 rounded focus:ring-slate-500 focus:ring-2"
                                                    />
                                                </div>
                                            </div>

                                            {/* Bank Info */}
                                            <div className="bg-white rounded-lg p-3 border border-slate-100">
                                                <div className="text-xs text-slate-500 mb-1">עסק מהבנק</div>
                                                <div className="text-sm text-slate-800">{transaction.bank}</div>
                                            </div>

                                            {/* Category and Business Selectors */}
                                            <div className="grid grid-cols-1 gap-3">
                                                <div>
                                                    <label className="block text-xs text-slate-500 mb-1 text-right">קטגוריה</label>
                                                    <CategorySelect transaction={transaction} />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-slate-500 mb-1 text-right">בעל עסק</label>
                                                    <BusinessSelect transaction={transaction} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200 p-6">
                                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                        <div className="flex-1 text-right">
                                            <h4 className="text-lg font-semibold text-slate-800 mb-2">מה יקרה לאחר ההעלאה?</h4>
                                            <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-600">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                        </svg>
                                                        התנועות יתווספו לדשבורד הראשי
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                        </svg>
                                                        הגרפים והדוחות יתעדכנו אוטומטית
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        תוכל לערוך כל תנועה בהמשך
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                        </svg>
                                                        התקציבים יחושבו מחדש
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-3">
                                            <div className="text-right text-sm text-slate-600">
                                                <div className="bg-slate-100 rounded-lg px-3 py-2">
                                                    <strong>{dataToUpload.filter(t => t.toUpload).length}</strong> תנועות מסומנות לעלייה
                                                </div>
                                            </div>
                                            <Button
                                                onClick={handleSubmitTransactions}
                                                disabled={isSubmitting || dataToUpload.filter(t => t.toUpload).length === 0}
                                                style="primary"
                                                size="large"
                                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        מעלה נתונים...
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                        העלה {dataToUpload.filter(t => t.toUpload).length} תנועות למערכת
                                                    </div>
                                                )}
                                            </Button>
                                            {dataToUpload.filter(t => t.toUpload).length === 0 && (
                                                <p className="text-sm text-amber-600 text-right">יש לסמן לפחות תנועה אחת לעלייה</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </PageLayout>
        </>
    );
}