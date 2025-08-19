
export const getUniqueCategories = (expenses) => {
    return [...new Set(expenses.map(expense => expense.category))];
};

export const getUniqueBusinesses = (expenses) => {
    return [...new Set(expenses.map(expense => expense.business))];
};

export const handleTransactionDeleted = (deletedTransactionId, expenses, setExpenses) => {
    setExpenses(expenses.filter(expense => expense._id !== deletedTransactionId));
};