import * as XLSX from "xlsx";
import Papa from "papaparse";
import * as FileSystem from "expo-file-system";

export const parseCSV = async (uri) => {
  const fileContent = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  return new Promise((resolve, reject) => {
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
};


export const parseXLSX = async (uri) => {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const workbook = XLSX.read(base64, { type: "base64", cellDates: true });
  const date1904 = workbook.Workbook?.WBProps?.date1904 || false;
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rawData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  return rawData.map((row) => {
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
};
