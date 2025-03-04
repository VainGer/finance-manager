import { useState } from "react";

export default function AddTransact({ username, profileName }) {
    const [category, setCategory] = useState('');
    const [item, setItem] = useState('');
    const [price, setPrice] = useState('');
    const [date, setDate] = useState('');

    async function addTransaction(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/profile/add_trans', {
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
        <form className="border-1" onSubmit={addTransaction}>
            <label>קטגוריה:</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />

            <label>פריט:</label>
            <input type="text" value={item} onChange={(e) => setItem(e.target.value)} />

            <label>מחיר:</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />

            <label>תאריך:</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

            <input type="submit" value="הוסף עסקה" />
        </form>
    );
}