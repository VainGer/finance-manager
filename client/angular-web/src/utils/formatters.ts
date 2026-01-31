export const formatDate = (dateString?: string) => {
  if (!dateString) {
    return '';
  }
  return new Date(dateString).toLocaleDateString('he-IL');
};

export const formatCurrency = (amount?: number) => {
  if (!amount) {
    return 0;
  }
  amount = Number(amount.toFixed(1));
  return `₪${Number(amount).toLocaleString()}`;
};

export const getProgressPercentage = (spent?: number, budget?: number) => {
  if (!budget || !spent) {
    return 0;
  }
  return ((spent / budget) * 100).toFixed(1);
};

export const getProgressBarPercentage = (spent?: number, budget?: number) => {
  if (!budget || !spent) {
    return 0;
  }
  return Math.min((spent / budget) * 100, 100);
};

export const getProgressColor = (percentage?: number) => {
  if (!percentage) return 'bg-red-500';
  if (percentage <= 50) return 'bg-green-500';
  if (percentage <= 75) return 'bg-yellow-500';
  if (percentage <= 90) return 'bg-orange-500';
  return 'bg-red-500';
};

export const monthToHebrewName = (month: string) => {
  const monthNames: Record<string, string> = {
    '01': 'ינואר',
    '02': 'פברואר',
    '03': 'מרץ',
    '04': 'אפריל',
    '05': 'מאי',
    '06': 'יוני',
    '07': 'יולי',
    '08': 'אוגוסט',
    '09': 'ספטמבר',
    '10': 'אוקטובר',
    '11': 'נובמבר',
    '12': 'דצמבר',
  };
  return monthNames[month] || month;
};
