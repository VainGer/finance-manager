import * as DocumentPicker from 'expo-document-picker';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfileData } from '../context/ProfileDataContext';
import { post } from "../utils/api";
import { parseCSV, parseXLSX } from '../utils/parsers';
import useEditBusiness from './useEditBusiness';
import useEditCategories from './useEditCategories';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
   * The function `handleFileSelect` is used to handle the selection of a file, parse it based on its
   * extension (CSV or XLSX), and set the parsed data in the state.
   * @returns The `handleFileSelect` function is returning a Promise, as it is an async function. The
   * function performs various tasks such as setting state variables, selecting a file using
   * DocumentPicker, parsing the selected file based on its extension (CSV or XLSX), and handling any
   * errors that may occur during the process.
   */

  const handleFileSelect = async () => {
    setError(null);
    setSuccess(null);
    setSelectedFile(null);
    setTransactionsData(null);
    setDataToUpload(null);
    setCategorizedTransactions(null);
    setLoading(true);
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
        setLoading(false);
        return;
      }

      setSelectedFile(result.assets[0]);

      const { uri, name } = result.assets[0];
      const fileExt = name.split('.').pop().toLowerCase();
      let file;
      if (fileExt === "csv") {
        file = await parseCSV(uri);
      } else {
        file = await parseXLSX(uri);
      }
      setLoading(false);
      file = JSON.stringify(file);
      setTransactionsData(file);
    } catch (error) {
      console.error("Error selecting file:", error);
      setError("שגיאה בטעינת הקובץ");
    }
  }

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
    /*******************************************************************************************/
    // TESTING caching categorized transactions in AsyncStorage                                *
    // const categorizedFromStorage = await AsyncStorage.getItem('categorizedTransactions');   *
    // if (categorizedFromStorage) {                                                           *
    //   setCategorizedTransactions(JSON.parse(categorizedFromStorage));                       *
    //   return;                                                                               *
    // }                                                                                       *
    /*******************************************************************************************/
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
      AsyncStorage.setItem('categorizedTransactions', JSON.stringify(response.categories.transactions));
    } else {
      setError("שגיאה בעיבוד התנועות");
    }
  }

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


  //handlers for changing category, business and toUpload flag
  /* These three functions (`handleCategoryChange`, `handleBusinessChange`, `handleUploadSwitch`) are
  responsible for updating the `dataToUpload` state based on user interactions in the UI. Here's a
  breakdown of each function: */
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
  }
  // end of handlers


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
  };

  const onSuccessUpload = () => { setTimeout(() => resetState(), 3000); };



  return {
    handleFileSelect, processTransactions, handleCategoryChange,
    handleBusinessChange, handleUploadSwitch, addCategory,
    addBusiness, onCategoryAndBusinessAdded, handleSubmitTransactions, onSuccessUpload, resetState,
    dataToUpload, selectedFile, error, loading, success, categories: contextCategories, businesses: contextBusinesses, categoryLoading,
    businessLoading, getCategoriesError, getBusinessesError, getCategoriesLoading, getBusinessesLoading, categorySuccess, businessSuccess, categoryError, businessError
  };


}