import { useState } from 'react';

export default function SetPrivacy({ username, profileName, category, refreshExpenses }) {
    const [privacy, setPrivacy] = useState('');

    async function updatePrivacy(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/profile/set_privacy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, category, privacy })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(`Privacy setting updated to ${privacy}`);
                refreshExpenses();
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
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