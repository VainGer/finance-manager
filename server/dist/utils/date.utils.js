"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDateYM = formatDateYM;
exports.isSameMonth = isSameMonth;
exports.getFirstDayOfMonth = getFirstDayOfMonth;
exports.getLastDayOfMonth = getLastDayOfMonth;
function formatDateYM(date) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
}
function isSameMonth(date1, date2) {
    const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
    const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth();
}
function getFirstDayOfMonth(date) {
    const d = typeof date === 'string' ? new Date(date) : new Date(date);
    d.setDate(1);
    return d;
}
function getLastDayOfMonth(date) {
    const d = typeof date === 'string' ? new Date(date) : new Date(date);
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
//# sourceMappingURL=date.utils.js.map