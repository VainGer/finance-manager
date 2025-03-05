import { useState, useEffect } from 'react';

export default function EditTransactionPrice({ username, profileName, category, item, id, onTransactionUpdate }) {

    const [newPrice, setNewPrice] = useState();

    async function editTransactionPrice(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/profile/edit_price', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, category, item, id, newPrice })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(`Transaction ${id} price updated to ${newPrice} successfully`);
                onTransactionUpdate();
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className="border-1 grid *:border-1" onSubmit={editTransactionPrice}>
            <input type="number" onChange={(e) => setNewPrice(e.target.value)} />
            <input type="submit" value="עדכן מחיר" />
        </form>
    );
}