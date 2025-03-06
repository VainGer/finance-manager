import { useState, useEffect } from "react";
import ItemsToSelcet from "./ItemsToSelcet";

export default function AddTransactInReport({ username, profileName, category, item, onTransactionUpdate, closeAddTransact }) {
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
                onTransactionUpdate();
                closeAddTransact();
            } else {
                console.log(data.message);
                // TODO: Handle error
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <form className="grid grid-cols-2 bg-white p-6 rounded-lg shadow-lg *:border-1" onSubmit={addTransaction}>
                <label>מחיר:</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                <label>תאריך:</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                {price !== "" && date !== "" ?
                    (<input className="col-span-2 bg-green-200" type="submit" value="הוסף עסקה" />) :
                    (<input className="col-span-2 bg-gray-400" type="submit" value="הוסף עסקה" disabled />)}
                <button className="col-span-2" onClick={(e) => closeAddTransact()}>לחזרה</button>
            </form >
        </div>
    );
}