import { useState, useEffect } from 'react';

export default function AddItem({ username, profileName, category }) {
    const [item, setItem] = useState('');
    const [categories, setCategories] = useState([]);

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
                setItem(''); // Clear the item input field
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className='grid w-max text-center' onSubmit={addItem}>
            <input type="text" value={item} onChange={(e) => setItem(e.target.value)} />
            <input type="submit" value="הוסף פריט" />
        </form>
    );
}