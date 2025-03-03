import { useState, useEffect, useLayoutEffect } from "react";

export default function EditCategories({ username, profileName }) {

    const [categoriesList, setCategoriesList] = useState([]);
    const [choosenCategory, setChoosenCategory] = useState('');
    const [viewCategories, setViewCategories] = useState(true);
    async function getCategoriesList() {
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
                return data.categories;
            }
            else {
                //TODO
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function fetchCategories() {
            const categories = await getCategoriesList();
            if (categories) {
                setCategoriesList(categories);
            }
        } fetchCategories();
    }, [username, profileName]);


    return (
        <div>
            {viewCategories && <ul>
                {categoriesList.map((category, index) => {
                    return (
                        <li key={index}>
                            <button>{category}</button>
                        </li>
                    )
                })}
            </ul>}
        </div>
    )
}