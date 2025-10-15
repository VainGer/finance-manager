// hooks/useUploadTransactionFile.js (WEB)
import { useState, useEffect, useCallback } from 'react';
import { post, get } from "../utils/api";
import * as XLSX from "xlsx";
import { useAuth } from "../context/AuthContext";
import { useProfileData } from '../context/ProfileDataContext';


export default function useUploadTransactionFile() {
    const { profile } = useAuth();

    const [selectedFile, setSelectedFile] = useState(null);
    const [transactionsData, setTransactionsData] = useState(null);
    const [categorizedTransactions, setCategorizedTransactions] = useState(null);
    const [dataToUpload, setDataToUpload] = useState(null);

    const [categories, setCategories] = useState([]);
    const [selects, setSelects] = useState([]);
    const [refreshCounter, setRefreshCounter] = useState(0);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const { fetchExpenses, fetchBudgets } = useProfileData();


    const excelSerialToJSDate = (serial, date1904 = false) => {
        const baseDate = new Date(Date.UTC(1899, 11, 30));
        if (date1904) baseDate.setDate(baseDate.getDate() + 1462);
        const jsDate = new Date(baseDate.getTime() + serial * 24 * 60 * 60 * 1000);
        return jsDate;
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setError(null);
        setSuccess(null);
        setCategorizedTransactions(null);
        setDataToUpload(null);
        setTransactionsData(null);

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: "array", cellDates: true });
                const date1904 = workbook.Workbook?.WBProps?.date1904;
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const rawTransactions = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });

                const processedTransactions = rawTransactions.map((transaction) => {
                    const processed = { ...transaction };
                    for (const [key, value] of Object.entries(processed)) {
                        if (typeof value === "number") {
                            const date = excelSerialToJSDate(value, date1904);
                            if (!isNaN(date)) {
                                processed[key] = date.toISOString().split("T")[0];
                            }
                        } else if (value instanceof Date) {
                            const correctedDate = date1904 ? new Date(value.getTime() + 1462 * 86400000) : value;
                            processed[key] = correctedDate.toISOString().split("T")[0];
                        }
                    }
                    return processed;
                });

                setSelectedFile(file);
                setTransactionsData(JSON.stringify(processedTransactions));
            } catch (err) {
                console.error("Error parsing file:", err);
                setError("שגיאה בקריאת הקובץ. ודא שהקובץ תקין");
            }
        };
        reader.readAsArrayBuffer(file);
    };



    const processTransactions = async () => {
        setError(null);
        setSuccess(null);
        setLoading(true);

        if (!transactionsData) {
            setError("אין נתונים לעיבוד");
            setLoading(false);
            return;
        }

        try {
            const response = await post("profile/categorize-transactions", {
                refId: profile.expenses,
                transactionsData
            });

            if (response.ok) {
                setCategorizedTransactions(response.categories.transactions);
                localStorage.setItem('categorizedTransactions', JSON.stringify(response.categories.transactions));
            } else {
                setError("שגיאה בעיבוד התנועות");
            }
        } catch (error) {
            console.error("Error categorizing transactions:", error);
            setError("שגיאה בעיבוד התנועות");
        } finally {
            setLoading(false);
        }
    };



    const getCategories = async () => {
        if (!profile?.expenses) return;
        try {
            const response = await get(`expenses/category/get-names/${profile.expenses}`);
            if (response.ok) {
                setCategories(response.categoriesNames);
            } else {
                console.error("Error fetching categories:", response.error);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const getSelects = async () => {
        if (!profile?.expenses) return;

        try {
            await getCategories();
            const fetchedSelects = [];

            for (const category of categories) {
                try {
                    const response = await get(`expenses/business/get-businesses/${profile.expenses}/${encodeURIComponent(category)}`);
                    fetchedSelects.push({
                        category,
                        businesses: response.ok ? response.businesses : []
                    });
                } catch (error) {
                    console.error(`Error fetching businesses for ${category}:`, error);
                    fetchedSelects.push({ category, businesses: [] });
                }
            }

            setSelects(fetchedSelects);
            setRefreshCounter(prev => prev + 1);
        } catch (error) {
            console.error("Failed in getSelects:", error);
        }
    };

    useEffect(() => {
        if (profile?.expenses) {
            getCategories();
        }
    }, [profile?.expenses]);

    useEffect(() => {
        if (categories.length > 0) {
            getSelects();
        }
    }, [categories]);



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
                toUpload: transaction.category && transaction.business ? true : false
            }));
            setDataToUpload(data);
        }
    }, [categorizedTransactions]);



    const handleCategoryChange = useCallback((index, newCategory) => {
        setDataToUpload(prev => {
            const updated = [...prev];
            updated[index].category = newCategory;
            return updated;
        });
    }, []);

    const handleBusinessChange = useCallback((index, newBusiness) => {
        setDataToUpload(prev => {
            const updated = [...prev];
            updated[index].business = newBusiness;
            return updated;
        });
    }, []);

    const handleUploadSwitch = (index, value) => {
        setDataToUpload(prev => {
            const updated = [...prev];
            updated[index].toUpload = value;
            return updated;
        });
    };

    const handleSubmitTransactions = async () => {
        if (!dataToUpload || dataToUpload.length === 0) {
            setError("אין נתונים להעלאה");
            return;
        }

        setError(null);
        setSuccess(null);
        setLoading(true);

        const transactionsToSubmit = dataToUpload.filter(t => t.toUpload);
        try {
            const response = await post(`profile/upload-transactions`, {
                username: profile.username,
                profileName: profile.profileName,
                refId: profile.expenses,
                transactionsToUpload: transactionsToSubmit
            });

            if (response.ok) {
                setSuccess('העסקאות הועלו בהצלחה');
                await fetchExpenses();
                await fetchBudgets();
                onSuccessUpload();
            } else {
                setError('שגיאה בהעלאת העסקאות, נסה שוב מאוחר יותר');
            }
        } catch (err) {
            console.error("Error uploading transactions:", err);
            setError('שגיאה בהעלאת העסקאות, נסה שוב מאוחר יותר');
        } finally {
            setLoading(false);
        }
    };


    const resetState = () => {
        setError(null);
        setSuccess(null);
        setLoading(false);
        setSelectedFile(null);
        setTransactionsData(null);
        setDataToUpload(null);
        setCategorizedTransactions(null);
        localStorage.removeItem('categorizedTransactions');
    };

    const onSuccessUpload = () => {
        setTimeout(() => resetState(), 3000);
    };

    return {
        handleFileUpload,
        processTransactions,
        handleCategoryChange,
        handleBusinessChange,
        handleUploadSwitch,
        handleSubmitTransactions,
        resetState,
        onSuccessUpload,

        dataToUpload,
        selectedFile,
        categorizedTransactions,
        selects,
        refreshCounter,

        getSelects,

        error,
        success,
        loading
    };
}
