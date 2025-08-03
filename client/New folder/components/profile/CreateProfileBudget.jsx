import { useState } from 'react';
import { post } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function CreateProfileBudget() {
    const { account, profile } = useAuth();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [amount, setAmount] = useState(null);


    const createBudget = async (e) => {
        e.preventDefault();
        const budget = {
            startDate,
            endDate,
            amount,
            spent: 0
        };
        const response = await post('/profile/create-budget',
            { username: account.username, profileName: profile.profileName, budget });
        if (response.ok) {
            console.log('Budget created successfully:', response.budget);
            // Optionally, you can update the UI or state to reflect the new budget
        }
    }

    return (
        <form>
            <input
                type="number"
                name="budget"
                id="budget"
                placeholder="הכנס סכום תקציב"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <label htmlFor="startDate">תאריך התחלה</label>
            <input
                type="date"
                name="startDate"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />
            <label htmlFor="endDate">תאריך סיום</label>
            <input
                type="date"
                name="endDate"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />
            <input type="submit" value="צור תקציב" />
        </form>
    )
}