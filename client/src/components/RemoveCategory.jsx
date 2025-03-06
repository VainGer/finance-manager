import { useState } from 'react';


export default function RemoveCategory({ username, profileName, category, refreshExpenses }) {

    async function removeCat(e) {
        console.log(username, profileName, category)
        try {
            let response = await fetch('http://localhost:5500/api/profile/rem_cat_items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, category })
            });
            if (response.ok) {
                console.log(`Category ${category} removed successfully`);
                refreshExpenses();
            } else {
                console.log(`Failed to remove category ${category}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <button onClick={(e) => removeCat(e)}>מחק קטגוריה ואת הפריטים</button>
    );
}