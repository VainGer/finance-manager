import { useState, useEffect, useCallback } from 'react';
import { post, get } from "../utils/api";
import * as XLSX from "xlsx";
import { useAuth } from "../context/AuthContext";

export default function useUploadTransactionFile() {
    const [transactionsData, setTransactionsData] = useState(null);
    const [categorizedTransactions, setCategorizedTransactions] = useState(null);
    const { account, profile } = useAuth();
    const [categories, setCategories] = useState([]);
    const [selects, setSelects] = useState([]);
    const [refreshCounter, setRefreshCounter] = useState(0);

    const processTransactions = async () => {
        if (localStorage.getItem('categorizedTransactions')) {
            setCategorizedTransactions(JSON.parse(localStorage.getItem('categorizedTransactions')));
            return;
        }
        if (!transactionsData) return;
        try {
            const response = await post("profile/categorize-transactions", {
                refId: profile.expenses,
                transactionsData
            });
            setCategorizedTransactions(response.categories.transactions);
            localStorage.setItem('categorizedTransactions', JSON.stringify(response.categories.transactions));
        } catch (error) {
            console.error("Error uploading transactions:", error);
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
            // First refresh categories
            await getCategories();
            
            // Now fetch businesses for each category
            const fetchedSelects = [];
            for (const category of categories) {
                try {
                    const response = await get(`expenses/business/get-businesses/${profile.expenses}/${category}`);
                    if (response.ok) {
                        fetchedSelects.push({ category, businesses: response.businesses });
                    } else {
                        fetchedSelects.push({ category, businesses: [] });
                    }
                } catch (error) {
                    console.error(`Error fetching businesses for ${category}:`, error);
                    fetchedSelects.push({ category, businesses: [] });
                }
            }
            
            setSelects(fetchedSelects);
            
            // Increment counter to signal data refresh to components
            setRefreshCounter(prev => prev + 1);
        } catch (error) {
            console.error("Failed in getSelects:", error);
        }
    };

    // Initial load on mount only
    useEffect(() => {
        if (profile?.expenses) {
            getCategories();
        }
    }, [profile?.expenses]);

    // Load businesses when categories change
    useEffect(() => {
        if (categories.length > 0) {
            const fetchBusinesses = async () => {
                const fetchedSelects = [];
                
                for (const category of categories) {
                    try {
                        const response = await get(`expenses/business/get-businesses/${profile.expenses}/${category}`);
                        if (response.ok) {
                            fetchedSelects.push({ category, businesses: response.businesses });
                        } else {
                            fetchedSelects.push({ category, businesses: [] });
                        }
                    } catch (error) {
                        console.error(`Error fetching businesses for ${category}:`, error);
                        fetchedSelects.push({ category, businesses: [] });
                    }
                }
                
                setSelects(fetchedSelects);
            };
            
            fetchBusinesses();
        }
    }, [categories, profile?.expenses]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);

                const workbook = XLSX.read(data, {
                    type: "array",
                    cellDates: true,
                    dateNF: 'yyyy-mm-dd'
                });

                const date1904 = workbook.Workbook &&
                    workbook.Workbook.WBProps &&
                    workbook.Workbook.WBProps.date1904;

                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

                const rawTransactions = XLSX.utils.sheet_to_json(firstSheet, {
                    raw: false,
                    dateNF: 'yyyy-mm-dd'
                });

                const processedTransactions = rawTransactions.map(transaction => {
                    const processedTransaction = { ...transaction };

                    Object.entries(processedTransaction).forEach(([key, value]) => {
                        if (value instanceof Date) {
                            if (date1904) {
                                const correctedDate = new Date(value);
                                correctedDate.setDate(correctedDate.getDate() + 1462);
                                processedTransaction[key] = correctedDate;
                            }
                            if (processedTransaction[key] instanceof Date) {
                                processedTransaction[key] = processedTransaction[key].toISOString().split('T')[0];
                            }
                        }
                    });

                    return processedTransaction;
                });

                setTransactionsData(JSON.stringify(processedTransactions));
            };
            reader.readAsArrayBuffer(file);
        }
    };

    return {
        categorizedTransactions,
        selects,
        refreshCounter, // Add this to component props
        getSelects,
        handleFileUpload,
        processTransactions
    }
}