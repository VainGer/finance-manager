import { useState } from 'react';
import { setCategoryPrivacy } from '../../API/category';


//to implement
export default function SetCategoryPrivacy({ username, profileName, category, refreshExpenses }) {
    const [privacy, setPrivacy] = useState('');

    async function updatePrivacy(e) {
        e.preventDefault();

        const response = await setCategoryPrivacy(username, profileName, category, privacy);

        if (response.status === 200) {
            refreshExpenses();
        }
        else if (response.status === 404) {
            console.log("Category not found");
        } else if (response.status === 500) {
            console.log("Server error while updating category privacy");
        } else {
            console.log(response.message || "Error updating category privacy");
        }
    }

    return (
        <form onSubmit={updatePrivacy} className='bg-blue-300 rounded-md h-max'>
            <div>
                <label className='mx-4'>לסמן קטגוריה כפרטית</label>
                <input className='size-4 mt-3' type='checkbox' onChange={(e) => { setPrivacy(e.target.checked); }}></input>
            </div>
            <input className='my-2 px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition' type="submit" value={"שמור שינוי"} />
        </form>
    );
}