import { useState } from 'react';
import SelectCategory from './SelectCategory'

export default function RemoveCategoryMoveItem({ username, profileName, category }) {
    const [newCategory, setNewCategory] = useState("");

    const onSelectedCategory = (opt) => {
        setNewCategory(opt);
        console.log(newCategory);
    }

    async function removeCat(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/profile/rem_cat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, category, newCategory })
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
        <div>
            <SelectCategory username={username} profileName={profileName} onSelectedCategory={onSelectedCategory} />
            <button onClick={(e) => removeCat(e)}>מחק קטגוריה והעבר פריטים</button>
        </div>
    );
}