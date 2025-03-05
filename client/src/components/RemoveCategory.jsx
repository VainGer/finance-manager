import { useState } from 'react';


export default function RemoveCategory({ username, profileName, category }) {

    async function removeCat(e) {
        e.preventDefault();
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