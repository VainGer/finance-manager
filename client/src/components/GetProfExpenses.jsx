import { useState, useEffect } from 'react';

export default function GetProfExpenses({ username, profileName }) {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        async function fetchExpenses() {
            try {
                let response = await fetch('http://localhost:5500/api/profile/profile_expenses', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, profileName })
                });
                let data = await response.json();
                if (response.ok) {
                    setExpenses(data.expenses);
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchExpenses();
    }, [username, profileName]);

    return (
        <div>
            <h2>הוצאות פרופיל</h2>
            {expenses.length > 0 ? (
                <ul>
                    {expenses.map((expense, index) => (
                        <li key={index}>
                            {expense.category}: {expense.amount} {expense.currency} - {expense.date}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>אין הוצאות להצגה</p>
            )}
        </div>
    );
}