import * as DocumentPicker from 'expo-document-picker';
import { parseXLSX, parseCSV } from '../utils/parsers';
import { useCallback, useEffect, useState } from 'react';
import { get, post } from "../utils/api";

export default function useUploadTransactionsFromFile({ profile }) {

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [transactionsData, setTransactionsData] = useState(null);
  const [dataToUpload, setDataToUpload] = useState(null);
  const [categorizedTransactions, setCategorizedTransactions] = useState(null);

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

  const processTransactions = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    if (!transactionsData) {
      return;
    }
    const response = await post("profile/categorize-transactions", {
      refId: profile.expenses,
      transactionsData
    });
    setLoading(false);
    if (response.ok) {
      setCategorizedTransactions(response.categories.transactions);
    } else {
      setError("שגיאה בעיבוד התנועות");
    }
    // setCategorizedTransactions([{ "amount": 3.95, "date": null, "category": null, "business": { "name": null, "bankName": "FLAVORS LARNACA CYP" } }, { "amount": 135, "date": null, "category": null, "business": { "name": null, "bankName": "בורגר קינג-טרמינל נתב\"ג" } }, { "amount": 800, "date": null, "category": "העברות", "business": { "name": "ביט", "bankName": "BIT" } }, { "amount": 50, "date": null, "category": null, "business": { "name": null, "bankName": "תאתי מרקט" } }, { "amount": 40, "date": null, "category": null, "business": { "name": null, "bankName": "STEAMGAMES.COM 4259522" } }, { "amount": 63.34, "date": null, "category": "תקשורת", "business": { "name": "הוט מובייל", "bankName": "HOT MOBILE" } }, { "amount": 43.7, "date": null, "category": null, "business": { "name": null, "bankName": "צמרת-שפע פירות וירקות" } }, { "amount": 115.5, "date": null, "category": "סופר", "business": { "name": "מגה", "bankName": "מגה בעיר חפץ חיים-יציל" } }, { "amount": 74.5, "date": null, "category": "סופר", "business": { "name": "מגה", "bankName": "מגה בעיר חפץ חיים-יציל" } }, { "amount": 11, "date": null, "category": null, "business": { "name": null, "bankName": "טופ קפה בלינסון בע\"מ" } }, { "amount": 3.9, "date": null, "category": null, "business": { "name": null, "bankName": "APPLE.COM/BILL" } }, { "amount": 65, "date": null, "category": "מסעדות", "business": { "name": "מקדונלדס", "bankName": "מקדונלד'ס - בלינסון" } }, { "amount": 35, "date": null, "category": null, "business": { "name": null, "bankName": "לב התקווה" } }, { "amount": 222.72, "date": null, "category": null, "business": { "name": null, "bankName": "מיתב מים תיעול וביוב בע\"מ" } }, { "amount": 13.7, "date": null, "category": "סופר", "business": { "name": "מגה", "bankName": "מגה בעיר חפץ חיים-יציל" } }, { "amount": 104.3, "date": null, "category": "משלוחים", "business": { "name": "וולט", "bankName": "WOLT" } }, { "amount": 88.72, "date": null, "category": null, "business": { "name": null, "bankName": "פספורטכארד ישראל סוכנות לביטוח כללי 2014" } }, { "amount": 65, "date": null, "category": "מסעדות", "business": { "name": "מקדונלדס", "bankName": "מקדונלד'ס - בלינסון" } }, { "amount": 37, "date": null, "category": null, "business": { "name": null, "bankName": "מיקס מרקט" } }, { "amount": 106.8, "date": null, "category": "סופר", "business": { "name": "מגה", "bankName": "מגה בעיר חפץ חיים-יציל" } }, { "amount": 34, "date": null, "category": null, "business": { "name": null, "bankName": "מפגש החברים" } }, { "amount": 100.3, "date": null, "category": "סופר", "business": { "name": "מגה", "bankName": "מגה בעיר חפץ חיים-יציל" } }, { "amount": 36.1, "date": null, "category": null, "business": { "name": null, "bankName": "סופרפארם היכל 59" } }]);
  }

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

  return {
    handleFileSelect, processTransactions, handleCategoryChange, handleBusinessChange, handleUploadSwitch,
    dataToUpload, selectedFile, error, loading, success
  };


}