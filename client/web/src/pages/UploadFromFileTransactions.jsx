import { useState, useEffect } from "react";
import useUploadTransactionFile from "../hooks/useUploadTransactionFile";
import AddCategory from "../components/dashboard/expenses/categories/AddCategory";
import CreateBusiness from "../components/dashboard/expenses/businesses/CreateBusiness";
import { post } from "../utils/api";
import { useAuth } from "../context/AuthContext";

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
                toUpload: true
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
                        updatedItem.business = ''; // Reset business when category changes
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
            const transactionsToSubmit = dataToUpload.map(t => ({
                date: t.date,
                amount: t.amount,
                categoryName: t.category,
                businessName: t.business,
                description: `העלאה מקובץ: ${t.bank}`
            }));

            const response = await post(`expenses/transactions/bulk?profileId=${profile._id}`, {
                transactions: transactionsToSubmit
            });

            if (response.ok) {
                setSubmitSuccess(true);
                setDataToUpload([]);
            } else {
                console.error("Failed to submit transactions");
                // You can add error handling UI here
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

    const UploadFile = () => (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800 text-right">העלאת תנועות מקובץ</h1>
                <div className="flex items-center gap-2">
                    <input
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        onChange={handleFileUpload}
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <button
                        onClick={processTransactions}
                        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                    >
                        עבד נתונים
                    </button>
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
                <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 shadow-sm">הוסף קטגוריה</button>
                {showCreate && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <AddCategory
                            goBack={() => setShowCreate(false)}
                            onCategoryAdded={handleCreationSuccess}
                        />
                    </div>
                )}
            </>
        );
    };

    const CreateNewBusiness = () => {
        const [showCreate, setShowCreate] = useState(false);
        return (
            <>
                <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 shadow-sm">הוסף עסק</button>
                {showCreate && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <CreateBusiness
                            goBack={() => setShowCreate(false)}
                            onBusinessAdded={handleCreationSuccess}
                        />
                    </div>
                )}
            </>
        );
    }

    return (
        <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
            <UploadFile />
            {submitSuccess && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                    <p className="font-bold">הצלחה</p>
                    <p>התנועות הועלו בהצלחה למערכת.</p>
                </div>
            )}
            {dataToUpload && dataToUpload.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex gap-4 mb-4">
                        <CreateNewCategory />
                        <CreateNewBusiness />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">תאריך</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">סכום</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">עסק כפי שמופיע בבנק</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">קטגוריה</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">עסק</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">לעלות</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dataToUpload.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">{transaction.amount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.bank}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm"><CategorySelect transaction={transaction} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm"><BusinessSelect transaction={transaction} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm"><input type="checkbox" checked={transaction.toUpload} onChange={(event) => handleToggleUpload(transaction.id, event.target.checked)} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleSubmitTransactions}
                            disabled={isSubmitting}
                            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-gray-400"
                        >
                            {isSubmitting ? 'מעלה נתונים...' : 'שמור והעלה תנועות'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}