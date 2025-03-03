import { useState, useEffect } from 'react';

export default function AddCategory({ username, profileName }) {

    const [category, setCategory] = useState('');
    const [privateC, setPrivate] = useState(false);
    
    async function addCat(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/profile/add_cat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, category, privacy: privateC })
            });
            if (response.ok) {
                //TODO
            }
            else {

                //TODO
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    return (<form className='grid w-max text-center' onSubmit={addCat}>
        <label>שם קטגוריה</label>
        <input className='border 2 border-solid' type="text" onChange={(e) => setCategory(e.target.value)} />
        <label >קטגוריה פרטית</label>
        <input type="checkbox" onChange={(e)=> setPrivate(e.target.checked)}/>
        <input type="submit" value="הוסף קטגוריה" />
    </form>)
}