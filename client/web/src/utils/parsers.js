import * as XLSX from "xlsx";
import Papa from "papaparse";

export const parseCSV = async (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
};

export const parseXLSX = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array", cellDates: true });
        const date1904 = workbook.Workbook?.WBProps?.date1904 || false;
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const rawData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        const processedData = rawData.map((row) => {
          const newRow = { ...row };
          Object.entries(newRow).forEach(([key, value]) => {
            if (value instanceof Date) {
              const correctedDate = new Date(value);
              if (date1904) correctedDate.setDate(correctedDate.getDate() + 1462);
              newRow[key] = correctedDate.toISOString().split("T")[0];
            }
          });
          return newRow;
        });

        resolve(processedData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

export const parseFile = async (file) => {
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.csv')) {
    return await parseCSV(file);
  } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    return await parseXLSX(file);
  } else {
    throw new Error('Unsupported file format. Please use CSV or XLSX files.');
  }
};
