import { useState, useEffect } from 'react';

export default function DeleteTransact({ username, profileName, category, item, id, onTransactionUpdate, closeEditor }) {

    async function deleteTransaction(e) {
        try {
            let response = await fetch('http://localhost:5500/api/profile/delete_spend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, category, item, id })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(`Transaction ${id} deleted successfully from category ${category}`);
                onTransactionUpdate();
                closeEditor();
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <button className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition" onClick={deleteTransaction}>מחק הוצאה</button>
    );
}