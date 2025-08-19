export const getProgressPercentage = (spent, budget) => {
    if (!budget || budget === 0) return 0;
    return ((spent / budget) * 100).toFixed(1);
};

export const getProgressBarPercentage = (spent, budget) => {
    if (!budget || budget === 0) return 0;
    return Math.min((spent / budget) * 100, 100);
};

export const getProgressColor = (percentage) => {
    if (percentage <= 50) return 'bg-green-500';
    if (percentage <= 75) return 'bg-yellow-500';
    if (percentage <= 90) return 'bg-orange-500';
    return 'bg-red-500';
};
