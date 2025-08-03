import { useState } from 'react';
import { post } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function CreateProfileBudget() {
    const { account, profile } = useAuth();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [amount, setAmount] = useState(null);
    const [categoryBudgets, setCategoryBudgets] = useState([{ name: 'category', amount: 500 }]);


    const createBudget = async (e) => {
        e.preventDefault();
        //validation dates --> await get
        //validation logic
        //navigate to category budget component creation if needed
        // if (categoryBudgets.length > 0) {
            //create category budgets array[name, amount] only if total amount of the array <= amount
        //}
        //procceed to response
        const response = await post('profile/add-budget',
            {
                username: account.username,
                profileName: profile.profileName,
                refId: profile.expenses,
                profileBudget: {
                    startDate,
                    endDate,
                    amount: parseFloat(amount),
                    spent: 0
                },
                categoriesBudgets: []
            });
        console.log(response)
        if (response.ok) {
            // Budget created successfully
            // Optionally, you can update the UI or state to reflect the new budget
        }
    }

    return (
        <form onSubmit={createBudget}>
            <input
                type="number"
                name="budget"
                id="budget"
                placeholder="הכנס סכום תקציב"
                onChange={(e) => setAmount(e.target.value)}
            />
            <label htmlFor="startDate">תאריך התחלה</label>
            <input
                type="date"
                name="startDate"
                id="startDate"
                onChange={(e) => setStartDate(e.target.value)}
            />
            <label htmlFor="endDate">תאריך סיום</label>
            <input
                type="date"
                name="endDate"
                id="endDate"
                onChange={(e) => setEndDate(e.target.value)}
            />
            <input type="submit" value="צור תקציב" />
        </form>
    )
}