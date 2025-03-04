import { useState, useEffect } from 'react';

export default function GetCategories({ username, profileName, onCategoriesFetched }) {
    const [categories, setCategories] = useState([]); 

    useEffect(() => {
        async function fetchCategories() {
            try {
                let response = await fetch('http://localhost:5500/api/profile/prof_categories', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, profileName })
                });
                let data = await response.json();
                if (response.ok) {
                    setCategories(data.categories);
                    if (onCategoriesFetched) {
                        onCategoriesFetched(data.categories);
                    }
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchCategories();
    }, [username, profileName, onCategoriesFetched]);

    return (
        <div>
            <h3>קטגוריות</h3>
            <ul>
                {categories.map((cat, index) => (
                    <li key={index}>{cat}</li>
                ))}
            </ul>
        </div>
    );
}