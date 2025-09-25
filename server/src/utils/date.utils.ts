import { YearMonth } from '../types/expenses.types';


export function formatDateYM(date: Date | string): YearMonth {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
}

export function isSameMonth(date1: Date | string, date2: Date | string): boolean {
    const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
    const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
    
    return d1.getFullYear() === d2.getFullYear() && 
           d1.getMonth() === d2.getMonth();
}


export function getFirstDayOfMonth(date: Date | string): Date {
    const d = typeof date === 'string' ? new Date(date) : new Date(date);
    d.setDate(1);
    return d;
}


export function getLastDayOfMonth(date: Date | string): Date {
    const d = typeof date === 'string' ? new Date(date) : new Date(date);
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}