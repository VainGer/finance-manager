import { formatDate } from '../../../utils/budgetUtils';
export default function BudgetPeriodSelector({ periods, selectedPeriod, onSelectPeriod }) {

    if (!periods || periods.length <= 1) return null;

    return (
        <div className=" w-1/3 mb-4">
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
        </div>
    );
}
