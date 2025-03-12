import { useState, useEffect } from 'react';

export default function GetCats({ username, profileName, onCategoryClick, onCategorySelect, select, forAccount, initialCategory }) {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory || "");

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
                    setCategories(data.categories || []);
                    setIsLoading(false);
                    // If we have an initial category, trigger the select callback
                    if (initialCategory && onCategorySelect) {
                        onCategorySelect(initialCategory);
                        setSelectedCategory(initialCategory);
                    }
                } else {
                    console.error("Failed to fetch categories:", data.message);
                    setCategories([]);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                setCategories([]);
                setIsLoading(false);
            }
        }
        fetchCategories();
    }, [username, profileName]);

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setSelectedCategory(value);
        if (onCategorySelect) {
            onCategorySelect(value);
        }
    };

    return (
        <div className="relative">
            {select ? (
                <>
                    {isLoading ? (
                        <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-500">
                            טוען קטגוריות...
                        </div>
                    ) : (
                        <select
                            className='w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                            onChange={handleCategoryChange}
                            value={selectedCategory}
                        >
                            <option value="" className="text-gray-500">
                                {categories.length === 0 ? 'לא נמצאו קטגוריות' : 'בחר קטגוריה'}
                            </option>
                            {categories.map((category, index) => (
                                <option
                                    key={index}
                                    value={category.categoryName}
                                    className="text-gray-900"
                                >
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                    )}
                </>
            ) : (
                <div className='grid'>
                    {isLoading ? (
                        <div className="text-center text-gray-500">טוען קטגוריות...</div>
                    ) : categories.length > 0 ? (
                        categories.map((category, index) => (
                            <button
                                className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition mt-4'
                                key={index}
                                onClick={() => onCategoryClick(category.categoryName)}
                            >
                                {category.categoryName}
                            </button>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">אין קטגוריות להצגה</p>
                    )}
                </div>
            )}
        </div>
    );
}