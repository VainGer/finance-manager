import { useState, useEffect } from 'react';

export default function ItemsToSelcet({ username, profileName, category, onSelectedOpt }) {
    const [items, setItems] = useState([]);

    useEffect(() => {
        async function fetchItems() {
            if (category) {
                try {
                    let response = await fetch('http://localhost:5500/api/profile/get_items', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ username, profileName, categoryName: category })
                    });
                    let data = await response.json();
                    if (response.ok) {
                        setItems(data.items);
                    } else {
                        console.log(data.message);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        fetchItems();
    }, [username, profileName, category]);

    return (
        <div className='w-full'>
            {items.length > 0 ? (
                <select onChange={(e) => onSelectedOpt(e.target.value)} className='w-full'>
                    <option className='text-center' disabled selected>בחר ערך</option>
                    {items.map((item, index) => (
                        <option className='text-center' key={index}>{item}</option>
                    ))}
                </select>) : (
                <option>אין פריטים להצגה</option>
            )}
        </div>
    );
}