import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from 'react';
import { post } from "../utils/api";
import * as XLSX from "xlsx";

export default function UploadFromFileTransactions() {
    const { account, profile } = useAuth();
    const [transactionsData, setTransactionsData] = useState('');

    
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            setIsProcessed(false);

            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);

                // Configure the reader with cell dates enabled for proper date parsing
                const workbook = XLSX.read(data, {
                    type: "array",
                    cellDates: true,  // Convert Excel dates to JS Date objects
                    dateNF: 'yyyy-mm-dd'  // Preferred date format
                });

                // Check if the workbook uses the 1904 date system (common in Mac Excel files)
                const date1904 = workbook.Workbook &&
                    workbook.Workbook.WBProps &&
                    workbook.Workbook.WBProps.date1904;

                // Get the first sheet
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

                // Parse to JSON with date handling
                const rawTransactions = XLSX.utils.sheet_to_json(firstSheet, {
                    raw: false,
                    dateNF: 'yyyy-mm-dd'
                });

                // Process dates if needed
                const processedTransactions = rawTransactions.map(transaction => {
                    const processedTransaction = { ...transaction };

                    // Find potential date fields and process them correctly
                    Object.entries(processedTransaction).forEach(([key, value]) => {
                        // Check if the value is a Date object
                        if (value instanceof Date) {
                            // Handle 1904 date system if needed
                            if (date1904) {
                                // Add 1462 days (difference between 1900 and 1904 date systems)
                                const correctedDate = new Date(value);
                                correctedDate.setDate(correctedDate.getDate() + 1462);
                                processedTransaction[key] = correctedDate;
                            }

                            // Format the date as a string (YYYY-MM-DD)
                            if (processedTransaction[key] instanceof Date) {
                                processedTransaction[key] = processedTransaction[key].toISOString().split('T')[0];
                            }
                        }
                    });

                    return processedTransaction;
                });

                setTransactionsData(JSON.stringify(processedTransactions));
                setIsProcessed(true);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    

    return (
        <div>
            <h1>Upload Transactions from File</h1>
            <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
            />
        </div>
    );
}
