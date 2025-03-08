import { useState, useEffect, use } from 'react';

export default function AddItem({ username, profileName, category, refreshExpenses, showConfirm }) {
    const [item, setItem] = useState('');
    useEffect(() => {
        console.log(item)
    }, [item])
    async function addItem(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/profile/add_item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, category, item })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(`Item ${item} added successfully to category ${category}`);
                showConfirm(false);
                refreshExpenses();
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }



    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black opacity-50'>
            <form onSubmit={addItem} className='bg-white grid border-blue-600 border-10 rounded-2xl h-50 **:h-max items-center'>
                <input className='text-center' type="text" placeholder='הזן שם פריט' onChange={(e) => setItem(e.target.value)} />
                <div className='grid grid-cols-2 *:border-1 *:rounded-2xl *:p-2'>
                    <input type="submit" value="הוסף פריט" />
                    <input type="button" value="ביטול" onClick={(e) => showConfirm(false)}/>
                </div>
            </form>
            /</div>
    );
}