import { useState, useEffect } from 'react';

export default function GetCats({ username, profileName, onCategoryClick, onCategorySelect, select, forAccount }) {
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

    return (
        <div>
            {
                select ? (<select className='border w-full h-full rounded-md'
                    onChange={(e) => onCategorySelect(e.target.value)}>
                    <option className='text-center' selected disabled>בחר קטגוריה</option>
                    {categories.length > 0 ? (categories.map((category, index) => (
                        <option key={index} className='text-center'
                        >{category.categoryName}</option>
                    ))) : (<option>לא נמצאו קטגוריות</option>)}
                </select>
                ) :
                    <div className='grid'>
                        {categories.length > 0 ? (
                            categories.map((category, index) => (
                                <button className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition mt-4'
                                    key={index} onClick={(e) => onCategoryClick(category.categoryName)}>{category.categoryName}</button>
                            ))
                        ) : (
                            <p>אין קטגוריות להצגה</p>
                        )
                        }
                    </div >
            }</div>

    );
}