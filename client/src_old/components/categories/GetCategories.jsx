import { useState, useEffect } from 'react';
import { getCategoryNames, getAccountCategoryNames } from '../../API/category';

export default function GetCategories({
    username,
    profileName,
    onCategoryClick,
    onCategorySelect,
    select = false,
    forAccount = false,
    initialCategory = ""
}) {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchCategories() {
            setIsLoading(true);
            setError(null);

            const apiFunction = forAccount ? getAccountCategoryNames : getCategoryNames;
            const response = await apiFunction(username, profileName);
            if (response.status === 200) {
                setCategories(response.categoryNames);

                if (initialCategory && onCategorySelect) {
                    onCategorySelect(initialCategory);
                    setSelectedCategory(initialCategory);
                }

            } else if (response.status === 404) {
                setError("לא נמצאו קטגוריות");
                setCategories([]);
            } else if (response.status === 500) {
                setError("שגיאת שרת בטעינת הקטגוריות");
                setCategories([]);
            } else {
                setError(response.message || "שגיאה בטעינת הקטגוריות");
                setCategories([]);
            }

            setIsLoading(false);
        }

        if (username && profileName) {
            fetchCategories();
        }


    }, [username, profileName, forAccount, initialCategory, onCategorySelect]);

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setSelectedCategory(value);
        if (onCategorySelect) {
            onCategorySelect(value);
        }
    };

    if (error) {
        return <div className="text-red-500 text-center py-2">{error}</div>;
    }

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
                                    value={category}
                                    className="text-gray-900"
                                >
                                    {category}
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
                                onClick={() => onCategoryClick(category)}
                            >
                                {category}
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