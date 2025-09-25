/**
 * Formats a date as a localized string
 * @param {Date|string} date - A Date object or date string
 * @returns {string} Formatted date string in Hebrew locale
 */
export const formatDate = (date) => {
    // Make sure we're working with a Date object
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Check if the date is valid before formatting
    if (isNaN(dateObj.getTime())) {
        return "תאריך לא תקין";
    }
    
    // Format the date using Hebrew locale
    return dateObj.toLocaleDateString('he-IL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

export const formatCurrency = (amount) => {
    const numAmount = Number(amount);
    return `₪${numAmount.toLocaleString('he-IL', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        useGrouping: true
    })}`;
};

export const formatAmount = (amount) => {
    const numAmount = Number(amount);
    return `₪${numAmount.toLocaleString('he-IL', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        useGrouping: true
    })}`;
};

/**
 * Converts month number to Hebrew month name
 * @param {string} monthStr - Month number as string (01-12)
 * @returns {string} Hebrew month name
 */
export const monthToHebrewName = (monthStr) => {
    const monthsToText = {
        "01": 'ינואר', 
        "02": 'פברואר', 
        "03": 'מרץ',
        "04": 'אפריל', 
        "05": 'מאי', 
        "06": 'יוני',
        "07": 'יולי', 
        "08": 'אוגוסט', 
        "09": 'ספטמבר',
        "10": 'אוקטובר', 
        "11": 'נובמבר', 
        "12": 'דצמבר',
    };
    return monthsToText[monthStr] || monthStr;
};

/**
 * Formats a YYYY-MM date format to a readable Hebrew month and year
 * @param {string} dateYM - Date in YYYY-MM format
 * @returns {string} Formatted month and year in Hebrew
 */
export const formatYearMonth = (dateYM) => {
    if (!dateYM) return '';
    const [year, month] = dateYM.split('-');
    return `${monthToHebrewName(month)} ${year}`;
};