import { useState, useEffect } from 'react';

export default function GetItems({ username, profileName, category, onItemsFetched }) {
    const [items, setItems] = useState([]);

    // Fetch items when the component mounts or when category changes
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
                        if (onItemsFetched) {
                            onItemsFetched(data.items);
                        }
                    } else {
                        console.log(data.message);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        fetchItems();
    }, [username, profileName, category, onItemsFetched]);

    return (
        <div>
            <h2>פריטים</h2>
            {items.length > 0 ? (
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            ) : (
                <p>אין פריטים להצגה</p>
            )}
        </div>
    );
}