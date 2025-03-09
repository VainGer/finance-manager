import { useState, useEffect } from 'react';
import ItemsToSelect from './ItemsToSelcet';

export default function RemoveItem({ username, profileName, category, refreshExpenses, showConfirm }) {
    const [item, setItem] = useState('');
    console.log("c" + category);

    async function removeItem(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/profile/remove_item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, category, item })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(`Item ${item} removed successfully from category ${category}`);
                refreshExpenses();
                showConfirm(false);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
            <form className='bg-white grid border-blue-600 border-10 rounded-2xl h-50'
                onSubmit={removeItem}>
                <label>בחר פריט</label>
                <ItemsToSelect username={username} profileName={profileName} category={category} onSelectedOpt={setItem} />
                <input type="submit" value="מחק פריט" />
            </form>
        </div>
    );
}