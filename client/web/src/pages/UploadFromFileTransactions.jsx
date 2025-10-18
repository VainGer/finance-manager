import { useState } from "react";
import useUploadTransactionsFromFile from "../hooks/useUploadTransactionsFromFile";
import AddCategory from "../components/dashboard/expenses/categories/AddCategory";
import CreateBusiness from "../components/dashboard/expenses/businesses/CreateBusiness";
import Button from "../components/common/Button";
import PageLayout from "../components/layout/PageLayout";
import NavigationHeader from "../components/layout/NavigationHeader";
import StatusModal from "../components/common/StatusModal";

const UploadFile = ({
    handleFileUpload,
    handleClearFile,
    processTransactions,
    selectedFile,
    loading,
}) => (
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-blue-100">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="flex-1 text-right">
                    <h2 className="text-xl font-bold text-blue-900 mb-2">איך זה עובד?</h2>
                    <ol className="space-y-2 text-blue-800 text-sm list-decimal list-inside">
                        <li>בחר קובץ Excel או CSV</li>
                        <li>המערכת תנתח ותכין את התנועות</li>
                        <li>שייך קטגוריות ובעלי עסקים</li>
                        <li>העלה למערכת</li>
                    </ol>
                </div>
            </div>
        </div>

        <div className="p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-right">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">בחר קובץ תנועות</h3>
                    <p className="text-slate-600 text-sm mb-4">
                        תומך בקבצי Excel (.xlsx, .xls) ו-CSV. הקובץ צריך לכלול תאריך, סכום, ותיאור.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-4 w-full max-w-[240px] mx-auto">
                    {!selectedFile ? (
                        <input
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            onChange={handleFileUpload}
                            className="w-full text-transparent file:w-full file:mr-0 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-slate-600 file:to-slate-700 file:text-white hover:file:from-slate-700 hover:file:to-slate-800 file:transition-all file:duration-200 file:cursor-pointer file:shadow-md hover:file:shadow-lg cursor-pointer"
                        />
                    ) : (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 w-full flex justify-between items-center">
                            <div className="text-right flex-1">
                                <p className="text-sm font-medium text-green-800">{selectedFile.name}</p>
                                <p className="text-xs text-green-600">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <button
                                onClick={handleClearFile}
                                className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors"
                            >
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                    <Button
                        onClick={processTransactions}
                        disabled={!selectedFile || loading}
                        style="primary"
                        size="auto"
                    >
                        {loading ? "מעבד..." : "עבד נתונים"}
                    </Button>
                </div>
            </div>
        </div>
    </div>
);

export default function UploadFromFileTransactions() {
    const {
        dataToUpload,
        handleFileUpload,
        processTransactions,
        handleCategoryChange,
        handleBusinessChange,
        handleUploadSwitch,
        handleSubmitTransactions,
        selectedFile,
        selects,
        refreshCounter,
        getSelects,
        loading,
        error,
        success,
        resetState,
        getCategories
    } = useUploadTransactionsFromFile();

    const handleClearFile = () => {
        resetState();
    };

    const handleCreationSuccess = async () => {
        await getCategories();
        await getSelects();
    };

    const getBusinessesForCategory = (category) => {
        const categoryData = selects.find((select) => select.category === category);
        return categoryData ? categoryData.businesses : [];
    };

    const CategorySelect = ({ transaction }) => (
        <select
            key={`cat-${transaction.id}-${refreshCounter}`}
            value={transaction.category || ""}
            onChange={(e) => handleCategoryChange(transaction.id, e.target.value)}
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
                onChange={(e) => handleBusinessChange(transaction.id, e.target.value)}
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
                <Button onClick={() => setShowCreate(true)} style="success" size="small" className="shadow-sm">
                    הוסף קטגוריה
                </Button>
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
                                <AddCategory goBack={() => setShowCreate(false)} onCategoryAdded={handleCreationSuccess} />
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
                <Button onClick={() => setShowCreate(true)} style="info" size="small" className="shadow-sm">
                    הוסף עסק
                </Button>
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
                                <CreateBusiness goBack={() => setShowCreate(false)} onBusinessAdded={handleCreationSuccess} />
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    };

    return (
        <>
            <NavigationHeader />
            <PageLayout>
                <div className="space-y-6">
                    <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800 mb-1">העלאת תנועות מקובץ</h1>
                                <p className="text-slate-600">העלה תנועות, ערוך קטגוריות ועסקים, והוסף למערכת</p>
                            </div>
                        </div>
                    </div>

                    <UploadFile
                        handleClearFile={handleClearFile}
                        handleFileUpload={handleFileUpload}
                        processTransactions={processTransactions}
                        selectedFile={selectedFile}
                        loading={loading}
                        error={error}
                        success={success}
                        resetState={resetState}
                    />

                    {dataToUpload && dataToUpload.length > 0 && (
                        <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                            {/* Transaction Statistics Header */}
                            <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 border-b border-slate-200">
                                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                />
                                            </svg>
                                        </div>
                                        <div className="text-right">
                                            <h3 className="text-xl font-bold text-slate-800">עריכת תנועות ({dataToUpload.length})</h3>
                                            <div className="flex gap-6 text-sm text-slate-600 mt-1">
                                                <span>מסומנות לעלייה: {dataToUpload.filter(t => t.toUpload).length}</span>
                                                <span>
                                                    סך הכל: ₪
                                                    {dataToUpload
                                                        .reduce((sum, t) => sum + Math.abs(t.amount), 0)
                                                        .toLocaleString()}
                                                </span>
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
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700 uppercase tracking-wide">תאריך</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700 uppercase tracking-wide">סכום</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700 uppercase tracking-wide">עסק (מהבנק)</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700 uppercase tracking-wide">קטגוריה</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700 uppercase tracking-wide">בעל עסק</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700 uppercase tracking-wide">להעלות</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-100">
                                        {dataToUpload.map(transaction => (
                                            <tr key={transaction.id} className="hover:bg-slate-50 transition-colors duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                                                    {transaction.date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                                                    ₪{Math.abs(transaction.amount).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                    {transaction.bank}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <CategorySelect key={`cat-${transaction.id}-${refreshCounter}`} transaction={transaction} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <BusinessSelect key={`bus-${transaction.id}-${refreshCounter}`} transaction={transaction} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={transaction.toUpload}
                                                        onChange={(e) => handleUploadSwitch(transaction.id, e.target.checked)}
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
                                {dataToUpload.map(transaction => (
                                    <div
                                        key={transaction.id}
                                        className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4"
                                    >
                                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                                            <div className="text-right flex-1">
                                                <div className="text-sm text-slate-600">{transaction.date}</div>
                                                <div className="text-lg font-bold text-red-600">
                                                    ₪{Math.abs(transaction.amount).toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-slate-500">להעלות</span>
                                                <input
                                                    type="checkbox"
                                                    checked={transaction.toUpload}
                                                    onChange={(e) => handleUploadSwitch(transaction.id, e.target.checked)}
                                                    classNameclassName="w-5 h-5 text-slate-600 border-2 border-slate-300 rounded focus:ring-slate-500 focus:ring-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-lg p-3 border border-slate-100">
                                            <div className="text-xs text-slate-500 mb-1">עסק מהבנק</div>
                                            <div className="text-sm text-slate-800">{transaction.bank}</div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3">
                                            <div>
                                                <label className="block text-xs text-slate-500 mb-1 text-right">קטגוריה</label>
                                                <CategorySelect key={`cat-m-${transaction.id}-${refreshCounter}`} transaction={transaction} />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-slate-500 mb-1 text-right">בעל עסק</label>
                                                <BusinessSelect key={`bus-m-${transaction.id}-${refreshCounter}`} transaction={transaction} />
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
                                            <ul className="space-y-2">
                                                <li>✅ התנועות יתווספו לדשבורד הראשי</li>
                                                <li>📊 הגרפים והדוחות יתעדכנו אוטומטית</li>
                                            </ul>
                                            <ul className="space-y-2">
                                                <li>✏️ תוכל לערוך כל תנועה בהמשך</li>
                                                <li>💰 התקציבים יחושבו מחדש</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-3">
                                        <div className="text-right text-sm text-slate-600 bg-slate-100 rounded-lg px-3 py-2">
                                            <strong>{dataToUpload.filter(t => t.toUpload).length}</strong> תנועות מסומנות לעלייה
                                        </div>
                                        <Button
                                            onClick={handleSubmitTransactions}
                                            disabled={dataToUpload.filter(t => t.toUpload).length === 0}
                                            style="primary"
                                            size="large"
                                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            העלה {dataToUpload.filter(t => t.toUpload).length} תנועות למערכת
                                        </Button>
                                        {dataToUpload.filter(t => t.toUpload).length === 0 && (
                                            <p className="text-sm text-amber-600 text-right">
                                                יש לסמן לפחות תנועה אחת לעלייה
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </PageLayout>

            <StatusModal
                isOpen={loading || error || success}
                type={loading ? "loading" : error ? "error" : "success"}
                message={
                    loading
                        ? " אנא המתן, טוען נתונים..."
                        : error
                            ? error
                            : "העסקאות הועלו בהצלחה למערכת"
                }
                onClose={!loading ? resetState : undefined}
            />
        </>
    );
}
