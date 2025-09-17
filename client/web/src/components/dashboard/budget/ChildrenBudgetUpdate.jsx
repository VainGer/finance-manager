import { useState, useEffect } from 'react';
import { get } from '../../../utils/api';
import { formatDate } from '../../../utils/budgetUtils';
import Button from '../../common/Button';

export default function ChildrenBudgetUpdate({ username, profileName }) {
    const [budgets, setBudgets] = useState([]);
    const [open, setOpen] = useState(true);

    const fetchBudgets = async () => {
        try {
            const response = await get(`budgets/get-child-budgets?username=${username}&profileName=${profileName}`);
            if (response.ok) {
                setBudgets(response.budgets);
            }
        } catch (error) {
            console.error('Error fetching budgets:', error);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, [username, profileName]);

    if (budgets.length === 0) {
        return null;
    }
    return (
        <>
            {open && <div className="fixed inset-0 bg-gray-600/80 overflow-y-auto h-full w-full flex justify-center items-center z-100">
                <ul className="bg-white rounded-lg shadow-lg p-4">
                    <li><h3 className="text-lg font-semibold text-gray-800 mb-4">היי {profileName} קיבלת עידכון תקציב חדש, כנס ליצירת תקציב למימוש התקציב</h3></li>
                    {budgets.map((budget, index) => (
                        <li key={index}>
                            <span>תאריך התחלה: {formatDate(budget.startDate)}</span>
                            <span>תאריך סיום: {formatDate(budget.endDate)}</span>
                            <span>סכום: {budget.amount}</span>
                        </li>
                    ))}
                    <li><Button style="success" onClick={() => setOpen(false)}>סגור</Button></li>
                </ul>
            </div>}
        </>
    );
}
