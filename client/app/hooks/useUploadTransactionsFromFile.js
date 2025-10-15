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
  setIsCategorySuccess
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

  // File Picker
  const handleFileSelect = async () => {
    resetState();
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

      const fileInfo = result.assets[0];
      setSelectedFile(fileInfo);

      const { uri, name } = fileInfo;
      const fileExt = name.split('.').pop().toLowerCase();
      const parsed = fileExt === 'csv' ? await parseCSV(uri) : await parseXLSX(uri);

      setTransactionsData(JSON.stringify(parsed));
      setLoading(false);
    } catch (err) {
      console.error('Error selecting file:', err);
      setError('שגיאה בטעינת הקובץ');
      setLoading(false);
    }
  };

  // Category / Business hooks
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

  // Show success overlay after creating category/business
  const onCategoryOrBusinessAdded = useCallback(
    (isCategory) => {
      setShowCreateCategory(false);
      setShowCreateBusiness(false);
      setIsCategorySuccess(isCategory);
      setShowSuccessMessage(true);
    },
    [setShowCreateCategory, setShowCreateBusiness, setShowSuccessMessage, setIsCategorySuccess]
  );

  // Categorize transactions on backend
  const processTransactions = async () => {
    if (!transactionsData) {
      setError('אין נתונים לעיבוד');
      return;
    }
    setLoading(true);
    const response = await post('profile/categorize-transactions', {
      refId: profile.expenses,
      transactionsData
    });
    setLoading(false);

    if (response.ok) {
      setCategorizedTransactions(response.categories.transactions);
      AsyncStorage.setItem('categorizedTransactions', JSON.stringify(response.categories.transactions));
    } else {
      setError('שגיאה בעיבוד התנועות');
    }
  };

  // Prepare data for upload
  useEffect(() => {
    if (categorizedTransactions?.length > 0) {
      setDataToUpload(
        categorizedTransactions.map((transaction, index) => ({
          id: index,
          date: transaction.date,
          amount: transaction.amount,
          category: transaction.category,
          business: transaction.business.name,
          bank: transaction.business.bankName,
          description: transaction.business.bankName,
          toUpload: Boolean(transaction.category && transaction.business)
        }))
      );
    }
  }, [categorizedTransactions]);

  // UI Handlers
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

  const handleUploadSwitch = useCallback((index, value) => {
    setDataToUpload(prev => {
      const updated = [...prev];
      updated[index].toUpload = value;
      return updated;
    });
  }, []);

  // Upload to backend
  const handleSubmitTransactions = async () => {
    if (!dataToUpload?.length) {
      setError('אין נתונים להעלאה');
      return;
    }

    const toUpload = dataToUpload.filter(t => t.toUpload);
    setLoading(true);

    const response = await post('profile/upload-transactions', {
      username: profile.username,
      profileName: profile.profileName,
      refId: profile.expenses,
      transactionsToUpload: toUpload
    });

    setLoading(false);
    if (response.ok) {
      setSuccess('העסקאות הועלו בהצלחה');
      fetchExpenses();
      fetchBudgets();
      setTimeout(() => resetState(), 3000);
    } else {
      console.error('Error uploading transactions:', response);
      setError('שגיאה בהעלאת העסקאות, נסה שוב מאוחר יותר');
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

  return {
    handleFileSelect,
    processTransactions,
    handleCategoryChange,
    handleBusinessChange,
    handleUploadSwitch,
    addCategory,
    addBusiness,
    onCategoryOrBusinessAdded,
    handleSubmitTransactions,
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
