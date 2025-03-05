import { useState, useEffect } from "react";
import ItemsToSelcet from "./ItemsToSelcet";

export default function AddTransactInReport({ username, profileName, category, item }) {
    const [price, setPrice] = useState('');
    const [date, setDate] = useState('');

    async function addTransaction(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/profile/add_transact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, category, item, price, date })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(data.message);
            } else {
                console.log(data.message);
                // TODO: Handle error
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <form className="grid grid-cols-2 border-1 *:border-1" onSubmit={addTransaction}>

            <label>מחיר:</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />

            <label>תאריך:</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

            <input className="col-span-2" type="submit" value="הוסף עסקה" />
        </form >
    );
}