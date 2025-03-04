import { useState, useEffect } from 'react';

export default function MoveItem({ username, profileName }) {
    const [sourceCategory, setSourceCategory] = useState('');
    const [targetCategory, setTargetCategory] = useState('');
    const [item, setItem] = useState('');
    const [categories, setCategories] = useState([]);

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


    async function moveItem(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/profile/move_item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, sourceCategory, targetCategory, item })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(`Item ${item} moved from ${sourceCategory} to ${targetCategory} successfully`);
                setItem(''); 
                setTargetCategory(''); 
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className='grid w-max text-center' onSubmit={moveItem}>
            <label>בחר קטגוריית מקור</label>
            <select value={sourceCategory} onChange={(e) => setSourceCategory(e.target.value)}>
                <option value="">בחר קטגוריית מקור</option>
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
            <label>בחר קטגוריית יעד</label>
            <select value={targetCategory} onChange={(e) => setTargetCategory(e.target.value)}>
                <option value="">בחר קטגוריית יעד</option>
                {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                ))}
            </select>
            <input type="submit" value="העבר פריט" />
        </form>
    );
}