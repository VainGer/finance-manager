import { useState, useEffect } from 'react';

export default function GetAccountExpenses({ username, profileName }) {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchExpenses() {
            try {
                let response = await fetch('http://localhost:5500/api/profile/acc_expenses', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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
            } finally {
                setLoading(false);
            }
        }

        fetchExpenses();
    }, [username, profileName]);

    return (
        <div className="w-full max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-blue-600 text-center mb-4">הוצאות חשבון</h2>

            {loading ? (
                <p className="text-center text-gray-500">טוען נתונים...</p>
            ) : expenses.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="px-4 py-3 border border-gray-300">קטגוריה</th>
                                <th className="px-4 py-3 border border-gray-300">סכום</th>
                                <th className="px-4 py-3 border border-gray-300">מטבע</th>
                                <th className="px-4 py-3 border border-gray-300">תאריך</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense, index) => (
                                <tr key={index} className="text-center border border-gray-200 hover:bg-gray-100 transition">
                                    <td className="px-4 py-2 border border-gray-300">{expense.category}</td>
                                    <td className="px-4 py-2 border border-gray-300">{expense.amount}</td>
                                    <td className="px-4 py-2 border border-gray-300">{expense.currency}</td>
                                    <td className="px-4 py-2 border border-gray-300">{expense.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500">אין הוצאות להצגה.</p>
            )}
        </div>
    );
}
