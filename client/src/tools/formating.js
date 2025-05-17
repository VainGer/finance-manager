export function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', options);
}

export function formatCurrency(amount) {
    return amount + "₪";
}