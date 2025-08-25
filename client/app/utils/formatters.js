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
    return `₪${Number(amount).toLocaleString()}`;
};

export const formatAmount = (amount) => {
    return `₪${amount.toLocaleString()}`;
};