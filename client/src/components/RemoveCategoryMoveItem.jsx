import { useState } from 'react';
import SelectCategory from './SelectCategory'

export default function RemoveCategoryMoveItem({ username, profileName, category, refreshExpenses, showConfirm }) {
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
                refreshExpenses();
                showConfirm(false);
            } else {
                console.log(`Failed to remove category ${category}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
            <div className='bg-white grid border-blue-600 border-10 rounded-2xl h-50'>
                <SelectCategory username={username} profileName={profileName}
                 onSelectedCategory={onSelectedCategory} forAccount={false}/>
                <button onClick={(e) => removeCat(e)}>מחק קטגוריה והעבר פריטים</button>
                <button onClick={(e) => showConfirm(false)}>ביטול</button>
            </div>
        </div>
    );
}