import { useState, useEffect } from 'react';

export default function GetCats({ username, profileName, onCategoryClick }) {
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
        <div>
            {categories.length > 0 ? (
                <ul>
                    {categories.map((category, index) => (
                        <li key={index}><button onClick={(e) => onCategoryClick(category.categoryName)}>{category.categoryName}</button></li>
                    ))}
                </ul>
            ) : (
                <p>אין קטגוריות להצגה</p>
            )}
        </div>
    );
}