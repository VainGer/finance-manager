import React from 'react';
import { formatDate } from '../../../utils/budgetUtils';
export default function BudgetPeriodSelector({ periods, selectedPeriod, onSelectPeriod }) {

    if (!periods || periods.length <= 1) return null;

    return (
        <div className="relative w-1/3 mb-4">
            <select
                value={selectedPeriod ? `${selectedPeriod.startDate}|${selectedPeriod.endDate}` : ''}
                onChange={(e) => {
                    const [startDate, endDate] = e.target.value.split('|');
                    onSelectPeriod({ startDate, endDate });
                }}
                className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
                {periods.map((period, index) => (
                    <option key={index} value={`${period.startDate}|${period.endDate}`}>
                        תקופה: {formatDate(period.startDate)} - {formatDate(period.endDate)}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
        </div>
    );
}
