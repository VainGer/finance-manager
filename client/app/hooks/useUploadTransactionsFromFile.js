import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useCallback, useEffect, useState } from 'react';
import * as XLSX from "xlsx";
import { useAuth } from "../context/AuthContext";
import { get, post } from "../utils/api";

export default function useUploadTransactionFile() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [transactionsData, setTransactionsData] = useState(null);
  const [dataToUpload, setDataToUpload] = useState(null);
  const [categorizedTransactions, setCategorizedTransactions] = useState(null);
  const { account, profile } = useAuth();
  const [categories, setCategories] = useState([]);
  const [selects, setSelects] = useState([]);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mobile file picker
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/csv'
        ],
        copyToCacheDirectory: true
      });

      if (result.canceled) {
        return;
      }

      setSelectedFile(result.assets[0]);
      setTransactionsData(null);
      setDataToUpload(null);
      setCategorizedTransactions(null);
      setError(null);
      await handleFileRead(result.assets[0]);
    } catch (err) {
      console.error("Error picking document:", err);
      setError("אירעה שגיאה בבחירת הקובץ");
    }
  };
  
  // Web file upload handler for compatibility
  const handleFileUpload = async (event) => {
    try {
      // This is used in web version
      if (event?.target?.files?.length) {
        const file = event.target.files[0];
        setSelectedFile(file);
        
        // Read the file similarly to mobile version
        // This would require a different implementation for web
        console.log("Web file selected:", file);
        
        // Here you would implement web file reading logic
        // For now, assuming the web component handles this separately
      }
    } catch (err) {
      console.error("Error handling file upload:", err);
      setError("אירעה שגיאה בבחירת הקובץ");
    }
  };


  const clearFile = () => {
    setSelectedFile(null);
    setTransactionsData(null);
    setDataToUpload(null);
    setCategorizedTransactions(null);
    setError(null);
  };


  const handleFileRead = async (file) => {
    try {
      const fileContent = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64
      });
      const fileExt = file.name.split('.').pop().toLowerCase();

      if (fileExt === 'csv') {
        const text = atob(fileContent);
        const Papa = require('papaparse');
        const parsed = Papa.parse(text, { header: true });
        setTransactionsData(JSON.stringify(parsed.data));
      } else {
        const workbook = XLSX.read(fileContent, { type: 'base64', cellDates: true });

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
      }
    } catch (err) {
      console.error("Error reading file:", err);
      setError("אירעה שגיאה בקריאת הקובץ");
    }
  };

  const processTransactions = async () => {
    if (!transactionsData) return;
    setIsProcessing(true);
    setError(null);

    try {
      const response = await post("profile/categorize-transactions", {
        refId: profile.expenses,
        transactionsData
      });

      if (response.categories && response.categories.transactions) {
        setCategorizedTransactions(response.categories.transactions);
        if (response.categories.selects && Array.isArray(response.categories.selects)) {
          setSelects(response.categories.selects);
          const categoryNames = response.categories.selects.map(select => select.category);
          setCategories(categoryNames);
        }
        setIsProcessing(false);
      } else {
        throw new Error("תבנית התגובה אינה תקינה");
      }
    } catch (error) {
      console.error("Error processing transactions:", error);
      setError(error.message || "אירעה שגיאה בעיבוד התנועות");
      setIsProcessing(false);
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
      setRefreshCounter(prev => prev + 1);
    } catch (error) {
      console.error("Failed in getSelects:", error);
    }
  };

  // Fetch businesses for all categories
  const fetchBusinesses = async () => {
    if (!profile?.expenses || !categories.length) return;
    
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
    setRefreshCounter(prev => prev + 1);
  };

  // Initial data loading
  useEffect(() => {
    if (profile?.expenses) {
      getCategories();
    }
  }, [profile?.expenses]);

  
  useEffect(() => {
    if (categories.length > 0 && profile?.expenses) {
      fetchBusinesses();
    }
  }, [categories, profile?.expenses]);
  const handleUpdateTransaction = (id, field, value) => {
    if (!dataToUpload) return;

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
    setRefreshCounter(prev => prev + 1);
  };

  const handleToggleUpload = (id, checked) => {
    if (!dataToUpload) return;

    setDataToUpload(prevData => {
      return prevData.map(item => {
        if (item.id === id) {
          // Use the provided checked value if available, otherwise toggle
          const newValue = checked !== undefined ? checked : !item.toUpload;
          return { ...item, toUpload: newValue };
        }
        return item;
      });
    });
  };


  const handleSubmitTransactions = async () => {
    if (!dataToUpload || !dataToUpload.length) return;

    setIsSubmitting(true);
    setError(null);
    setSubmitSuccess(false);

    try {
      // Create properly formatted transactions objects to match web version
      const transactionsToUpload = dataToUpload
        .filter(t => t.toUpload)
        .map(t => ({
          date: t.date,
          amount: t.amount,
          categoryName: t.category,
          businessName: t.business,
          description: `הועלה מקובץ: ${t.bank}`
        }));

      if (transactionsToUpload.length === 0) {
        setError("לא נבחרו תנועות להעלאה");
        setIsSubmitting(false);
        return;
      }

      // Log what we're submitting for debugging
      console.log("Submitting transactions:", transactionsToUpload);

      const response = await post("profile/upload-transactions", {
        username: profile.username,
        profileName: profile.profileName,
        refId: profile.expenses,
        transactionsToUpload: transactionsToUpload
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setSelectedFile(null);
          setTransactionsData(null);
          setDataToUpload(null);
          setCategorizedTransactions(null);
        }, 3000);
      } else {
        throw new Error(response.error || "שגיאה בהעלאת התנועות");
      }
    } catch (error) {
      console.error("Error submitting transactions:", error);
      setError(error.message || "אירעה שגיאה בהעלאת התנועות");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBusinessesForCategory = useCallback((categoryName) => {
    if (!selects || !selects.length) return [];

    const categoryData = selects.find(select => select.category === categoryName);
    return categoryData ? categoryData.businesses : [];
  }, [selects]); 
  
  // Function to refresh all data
  const refreshAllData = async () => {
    await getCategories();
    // fetchBusinesses will be called automatically from the useEffect due to categories change
    setRefreshCounter(prev => prev + 1);
  };
  
  return {
    selectedFile,
    transactionsData,
    dataToUpload,
    categorizedTransactions,
    selects,
    categories,
    refreshCounter,
    isProcessing,
    isSubmitting,
    submitSuccess,
    error,
    loading,
    setDataToUpload,
    pickFile,
    clearFile,
    handleUpdateTransaction,
    handleToggleUpload,
    handleSubmitTransactions,
    getSelects,
    processTransactions,
    getBusinessesForCategory,
    // Add web compatibility function
    handleFileUpload,
    // Export the fetch functions directly for use in component
    getCategories,
    fetchBusinesses,
    refreshAllData
  }
}