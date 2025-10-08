import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfileData } from '../context/ProfileDataContext';
import { post } from "../utils/api";
import { parseCSV, parseXLSX } from '../utils/parsers';
import useEditBusiness from './useEditBusiness';
import useEditCategories from './useEditCategories';

export default function useUploadTransactionsFromFile({
  setShowCreateCategory,
  setShowCreateBusiness,
  setShowSuccessMessage,
  setCategoryCreated
}) {
  const { profile } = useAuth();
  const {
    categories: contextCategories,
    businesses: contextBusinesses,
    fetchExpenses,
    fetchCategories,
    fetchBudgets
  } = useProfileData();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [transactionsData, setTransactionsData] = useState(null);
  const [dataToUpload, setDataToUpload] = useState(null);
  const [categorizedTransactions, setCategorizedTransactions] = useState(null);

  /**
   * Web-based file selection using HTML input element
   */
  const handleFileSelect = async (file) => {
    setError(null);
    setSuccess(null);
    setSelectedFile(null);
    setTransactionsData(null);
    setDataToUpload(null);
    setCategorizedTransactions(null);
    setLoading(true);
    
    try {
      if (!file) {
        setLoading(false);
        return;
      }

      // Check file type
      const fileName = file.name;
      const fileExt = fileName.split('.').pop().toLowerCase();
      
      if (!['csv', 'xlsx', 'xls'].includes(fileExt)) {
        setError("סוג קובץ לא נתמך. אנא העלה קובץ CSV או Excel");
        setLoading(false);
        return;
      }

      setSelectedFile(file);

      let parsedData;
      if (fileExt === "csv") {
        parsedData = await parseCSV(file);
      } else {
        parsedData = await parseXLSX(file);
      }
      
      setLoading(false);
      setTransactionsData(JSON.stringify(parsedData));
    } catch (error) {
      console.error("Error selecting file:", error);
      setError("שגיאה בטעינת הקובץ");
      setLoading(false);
    }
  };

  // Create file input handler for web
  const createFileInputHandler = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        handleFileSelect(file);
      }
    };
    input.click();
  };

  const {
    addCategory,
    getCategoriesError,
    getCategoriesLoading,
    success: categorySuccess,
    error: categoryError,
    loading: categoryLoading
  } = useEditCategories();

  const {
    addBusiness,
    getBusinessesError,
    getBusinessesLoading,
    success: businessSuccess,
    error: businessError,
    loading: businessLoading
  } = useEditBusiness();

  const onCategoryAndBusinessAdded = useCallback(async (isCategory) => {
    setShowCreateCategory(false);
    setShowCreateBusiness(false);
    setShowSuccessMessage(true);
    setCategoryCreated(isCategory ? categorySuccess : businessSuccess);
  }, [fetchCategories, contextCategories, setShowCreateCategory, setShowCreateBusiness, setShowSuccessMessage, setCategoryCreated]);

  const processTransactions = async () => {
    // Web storage instead of AsyncStorage
    const categorizedFromStorage = localStorage.getItem('categorizedTransactions');
    if (categorizedFromStorage) {
      setCategorizedTransactions(JSON.parse(categorizedFromStorage));
      return;
    }
    
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    if (!transactionsData) {
      setError("אין נתונים לעיבוד");
      setLoading(false);
      return;
    }
    
    const response = await post("profile/categorize-transactions", {
      refId: profile.expenses,
      transactionsData
    });
    
    setLoading(false);
    
    if (response.ok) {
      setCategorizedTransactions(response.categories.transactions);
      localStorage.setItem('categorizedTransactions', JSON.stringify(response.categories.transactions));
    } else {
      setError("שגיאה בעיבוד התנועות");
    }
  };

  // Prepare data for upload when categorizedTransactions changes
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

  // Handlers for changing category, business and toUpload flag
  const handleCategoryChange = useCallback((index, newCategory) => {
    setDataToUpload(prevData => {
      const updatedData = [...prevData];
      updatedData[index].category = newCategory;
      return updatedData;
    });
  }, []);

  const handleBusinessChange = useCallback((index, newBusiness) => {
    setDataToUpload(prevData => {
      const updatedData = [...prevData];
      updatedData[index].business = newBusiness;
      return updatedData;
    });
  }, []);

  const handleUploadSwitch = (index, value) => {
    setDataToUpload(prevData => {
      const updateData = [...prevData];
      updateData[index].toUpload = value;
      return updateData;
    });
  };

  // Submit transactions for upload
  const handleSubmitTransactions = async () => {
    if (!dataToUpload || dataToUpload.length === 0) {
      setError("אין נתונים להעלאה");
      return;
    }
    
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    const transactionsToSubmit = dataToUpload.filter(t => t.toUpload);
    const response = await post(`profile/upload-transactions`, {
      username: profile.username,
      profileName: profile.profileName,
      refId: profile.expenses,
      transactionsToUpload: transactionsToSubmit
    });
    
    setLoading(false);
    
    if (response.ok) {
      setSuccess('העסקאות הועלו בהצלחה');
      fetchExpenses(); // Refetch expenses after successful upload
      fetchBudgets();
      onSuccessUpload();
    } else {
      setError('שגיאה בהעלאת העסקאות, נסה שוב מאוחר יותר');
      console.error('Error uploading transactions:', response);
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
    // Clear web storage
    localStorage.removeItem('categorizedTransactions');
  };

  const onSuccessUpload = () => { 
    setTimeout(() => resetState(), 3000); 
  };

  return {
    handleFileSelect: createFileInputHandler, // Web version
    processTransactions, 
    handleCategoryChange,
    handleBusinessChange, 
    handleUploadSwitch, 
    addCategory,
    addBusiness, 
    onCategoryAndBusinessAdded, 
    handleSubmitTransactions, 
    onSuccessUpload, 
    resetState,
    dataToUpload, 
    selectedFile, 
    error, 
    loading, 
    success, 
    categories: contextCategories, 
    businesses: contextBusinesses, 
    categoryLoading,
    businessLoading, 
    getCategoriesError, 
    getBusinessesError, 
    getCategoriesLoading, 
    getBusinessesLoading, 
    categorySuccess, 
    businessSuccess, 
    categoryError, 
    businessError
  };
}