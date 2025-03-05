import { useState, useEffect } from 'react';

export default function EditTransactionPrice({ username, profileName, category, item, id }) {
    

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
                console.log(`Transaction ${transaction} price updated to ${newPrice} successfully`);
                setTransaction('');
                setNewPrice('');
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className="border-1" onSubmit={editTransactionPrice}>
            <label>בחר קטגוריה:</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">בחר קטגוריה</option>
                {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                ))}
            </select>
            <label>בחר עסקה:</label>
            <select value={transaction} onChange={(e) => setTransaction(e.target.value)}>
                <option value="">בחר עסקה</option>
                {transactions.map((trans, index) => (
                    <option key={index} value={trans}>{trans}</option>
                ))}
            </select>
            <label>מחיר חדש:</label>
            <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
            <input type="submit" value="עדכן מחיר" />
        </form>
    );
}