import { useState, useEffect } from 'react';

export default function SelectCategory({ username, profileName, onSelectedCategory, forAccount }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function fetchCategories() {
            try {
                let response = await fetch('http://localhost:5500/api/profile/categories_list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, profileName, forAccount })
                });
                let data = await response.json();
                if (response.ok) {
                    setCategories(data.categories)
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchCategories();
    }, [username, profileName]);

    return (
        <select onChange={(e) => onSelectedCategory(e.target.value)}>
            <option className='text-center' selected disabled>בחר קטגוריה</option>
            {categories.map((cat, index) => (
                <option className='text-center' key={index}>{cat.categoryName}</option>
            ))}
        </select>
    );
}