import { useState, useEffect } from 'react';
import GetCats from './GetCats';
import ItemsToSelcet from './ItemsToSelcet';

export default function MoveItem({ username, profileName, category, refreshExpenses, showConfirm }) {
    const [nextCat, setnextCat] = useState('');
    const [itemName, setItemName] = useState('');
    const [currentCat, setCurrentCat] = useState(category);

    async function moveItem(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/profile/move_item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, currentCat, nextCat, itemName })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(`Item ${itemName} moved from ${category} to ${nextCat} successfully`);
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
                onSubmit={moveItem}>
                <label>בחר פריט</label>
                <ItemsToSelcet username={username} profileName={profileName} category={category} onSelectedOpt={setItemName} />
                <label>בחר קטגוריה אליה תעביר את הפריט</label>
                <GetCats username={username} profileName={profileName} onCategorySelect={setnextCat} select={true}></GetCats>
                <input type="submit" value="שמור" />
                <input type="button" value="סגור" onClick={(e) => { showConfirm(false); }} />
            </form>
        </div>
    );
}