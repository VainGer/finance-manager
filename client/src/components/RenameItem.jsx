import { useState, useEffect } from 'react';
import ItemsToSelcet from './ItemsToSelcet';

export default function RenameItem({ username, profileName, category, refreshExpenses, showConfirm }) {
    const [item, setItem] = useState('');
    const [newName, setNewName] = useState('');


    async function renameItem(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/profile/rename_item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, category, item, newName })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(`Item ${item} renamed to ${newName} successfully`);
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
                onSubmit={renameItem}>
                <label>בחר פריט</label>
                <ItemsToSelcet key={item} username={username} profileName={profileName} category={category} onSelectedOpt={setItem} />
                <label>הכנס שם חדש</label>
                <input type="text" onChange={(e) => setNewName(e.target.value)} />
                <input type="submit" value="שמור" />
                <input type="button" value="סגור" onClick={(e) => { showConfirm(false); }} />
            </form>
        </div>
    );
}