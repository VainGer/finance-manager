import { useState, useEffect } from 'react';

export default function DeleteTransact({ username, profileName, category, item, id }) {

    async function deleteTransaction(e) {
        console.log(username, profileName, category, item, id)
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
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <button onClick={deleteTransaction}>מחק הוצאה</button>
    );
}