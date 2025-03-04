import { useState, useEffect } from 'react';

export default function GetCats({ username, profileName, onCategoriesFetched }) {
    const [categories, setCategories] = useState([]);

    // Fetch categories when the component mounts
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
            <h2>קטגוריות</h2>
            {categories.length > 0 ? (
                <ul>
                    {categories.map((category, index) => (
                        <li key={index}>{category}</li>
                    ))}
                </ul>
            ) : (
                <p>אין קטגוריות להצגה</p>
            )}
        </div>
    );
}