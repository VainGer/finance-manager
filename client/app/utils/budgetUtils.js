export const getProgressPercentage = (spent, budget) => {
    if (!budget || budget === 0) return 0;
    return ((spent / budget) * 100).toFixed(1);
};

export const getProgressBarPercentage = (spent, budget) => {
    if (!budget || budget === 0) return 0;
    return Math.min((spent / budget) * 100, 100);
};

/**
 * Returns the color class for the progress bar based on percentage of budget used
 * Follows the modern color scheme used throughout the app
 */
export const getProgressColor = (percentage) => {
    // Using Tailwind colors that match our design language
    if (percentage <= 50) return 'bg-emerald-500'; // For good progress (under 50%)
    if (percentage <= 75) return 'bg-blue-500';    // For moderate progress (50-75%)
    if (percentage <= 90) return 'bg-amber-500';   // For high progress (75-90%)
    if (percentage <= 100) return 'bg-orange-500'; // For near limit (90-100%)
    return 'bg-red-500';                          // For over budget (>100%)
};

/**
 * Returns the text color for budget status based on percentage
 */
export const getStatusTextColor = (percentage) => {
    if (percentage <= 50) return 'text-emerald-500';
    if (percentage <= 75) return 'text-blue-500';
    if (percentage <= 90) return 'text-amber-500';
    if (percentage <= 100) return 'text-orange-500';
    return 'text-red-500';
};

/**
 * Returns the background color for budget status indicators
 */
export const getStatusBgColor = (percentage) => {
    if (percentage <= 50) return 'bg-emerald-50';
    if (percentage <= 75) return 'bg-blue-50';
    if (percentage <= 90) return 'bg-amber-50';
    if (percentage <= 100) return 'bg-orange-50';
    return 'bg-red-50';
};
