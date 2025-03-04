import { useState, useEffect } from 'react';

export default function RemoveItem({ username, profileName }) {
    const [category, setCategory] = useState('');
    const [item, setItem] = useState('');
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);

    // Fetch categories when the component mounts
    useEffect(() => {
        async function fetchCategories() {
            try {
                let response = await fetch('http://localhost:5500/api/profile/getCats', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, profileName })
                });
                let data = await response.json();
                if (response.ok) {
                    setCategories(data.categories);
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchCategories();
    }, [username, profileName]);

    // Fetch items when a category is selected
    useEffect(() => {
        async function fetchItems() {
            if (category) {
                try {
                    let response = await fetch('http://localhost:5500/api/profile/getItems', {
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
    }, [category, username, profileName]);

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
                setItems(items.filter(itm => itm !== item));
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className='grid w-max text-center' onSubmit={removeItem}>
            <label>בחר קטגוריה</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">בחר קטגוריה</option>
                {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                ))}
            </select>
            <label>בחר פריט</label>
            <select value={item} onChange={(e) => setItem(e.target.value)}>
                <option value="">בחר פריט</option>
                {items.map((itm, index) => (
                    <option key={index} value={itm}>{itm}</option>
                ))}
            </select>
            <input type="submit" value="הסר פריט" />
        </form>
    );
}