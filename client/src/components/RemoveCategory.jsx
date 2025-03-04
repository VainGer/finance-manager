import { useState } from 'react';
import GetCategories from './GetCategories'; 

export default function RemoveCategory({ username, profileName }) {
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);

    async function removeCat(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/profile/remove_cat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, category })
            });
            if (response.ok) {
                console.log(`Category ${category} removed successfully`);
                setCategories(categories.filter(cat => cat !== category));
            } else {
                console.log(`Failed to remove category ${category}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <GetCategories username={username} profileName={profileName} onCategoriesFetched={setCategories} />
            <form className='grid w-max text-center' onSubmit={removeCat}>
                <label>בחר קטגוריה להסרה</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">בחר קטגוריה</option>
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                    ))}
                </select>
                <input type="submit" value="הסר קטגוריה" />
            </form>
        </div>
    );
}