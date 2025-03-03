import { useState, useEffect } from "react";

export default function AddTransact({ username, profileName }) {
    const [category, setCategory] = useState('');
    const [item, setItem] = useState('');
    const [price, setPrice] = useState('');
    const [date, setDate] = useState('');
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

    async function addTransaction(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/profile/add_trans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, category, item, price, date })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(data.message);
            } else {
                console.log(data.message);
                // TODO: Handle error
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className="border-1" onSubmit={addTransaction}>
            <label>קטגוריה:</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">בחר קטגוריה</option>
                {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                ))}
            </select>

            <label>פריט:</label>
            <input type="text" value={item} onChange={(e) => setItem(e.target.value)} />

            <label>מחיר:</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />

            <label>תאריך:</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

            <input type="submit" value="הוסף עסקה" />
        </form>
    );
}