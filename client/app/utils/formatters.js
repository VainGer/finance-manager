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
    // Ensure we're working with a number
    const numAmount = Number(amount);
    
    // Format with proper spacing and no decimal places for better display
    return `₪${numAmount.toLocaleString('he-IL', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        useGrouping: true
    })}`;
};

export const formatAmount = (amount) => {
    // Ensure we're working with a number
    const numAmount = Number(amount);
    
    // Format with proper spacing and no decimal places for better display
    return `₪${numAmount.toLocaleString('he-IL', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        useGrouping: true
    })}`;
};