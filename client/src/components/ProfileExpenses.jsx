import { useState, useEffect } from "react";

export default function ProfileExpenses({ username, profileName }) {

    const [accExpenses, setAccExpenses] = useState([]);
    async function getAccExpenses() {
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
                return data.expenses
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
            const expnses = await getAccExpenses();
            if (expnses) {
                setAccExpenses(expnses);
            }
        }
        fetchExpenses();
    }, [username, profileName]);


    return (
        <div className="w-max">
            {accExpenses.map((category, index) => {
                return (
                    <div key={index}>
                        <h3>קטגוריה: {category.categoryName}</h3>
                        <h4>בעלי עסק:</h4>
                        <div >
                            {category.items.map((item, index) => {
                                return (<div key={index}>
                                    <h5>שם בעל העסק: {item.iName}</h5>
                                    <h5>הוצאות:</h5>
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-1">
                                                <th className="border-1">תאריך</th>
                                                <th className="border-1">סכום</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {item.transactions.map((transactions, index) => {
                                                return (
                                                    <tr key={index} className="table-auto border-1 text-center w-full">
                                                        <td className="border-1">{transactions.date}</td>
                                                        <td className="border-1">{transactions.price}</td>
                                                    </tr>);
                                            })}
                                        </tbody>
                                    </table>
                                </div>);
                            })}</div>
                    </div>
                )
            })}
        </div>
    )
}