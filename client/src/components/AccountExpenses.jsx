import { useState, useEffect } from "react";
import ExpensesTable from "./ExpensesTable";
export default function AccountExpenses({ username, profileName }) {

    const [accExpenses, setAccExpenses] = useState([]);

    async function getAccExpenses() {
        try {
            let response = await fetch('http://localhost:5500/api/profile/acc_expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName })
            });
            let data = await response.json();
            if (response.ok) {
                setAccExpenses(data.expenses);
            }
            else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function fetchExpenses() {
            const expenses = await getAccExpenses();
            if (expenses) {
                setAccExpenses(expenses);
            }
        }
        fetchExpenses();
    }, [username, profileName]);

    return (
        <ExpensesTable username={username} profileName={profileName} expenseData={accExpenses} refreshExpenses={getAccExpenses} showEditBtn={false} showRelation={true} />
    )
}
