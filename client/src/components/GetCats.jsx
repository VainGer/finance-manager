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
        <div className='grid'>
            {categories.length > 0 ? (
                categories.map((category, index) => (
                    <button className='hover: cursor-pointer border-1 rounded-md mt-4 bg-blue-500 text-white p-3 hover:bg-blue-600'
                     key={index} onClick={(e) => onCategoryClick(category.categoryName)}>{category.categoryName}</button>
                ))
            ) : (
                <p>אין קטגוריות להצגה</p>
            )}
        </div>
    );
}