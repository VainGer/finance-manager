export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('he-IL');
};

export const formatCurrency = (amount) => {
    return `₪${Number(amount).toLocaleString()}`;
};

export const formatAmount = (amount) => {
    return `₪${amount.toLocaleString()}`;
};