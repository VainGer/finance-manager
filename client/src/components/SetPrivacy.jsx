import { useState } from 'react';

export default function SetPrivacy({ username, profileName }) {
    const [privacy, setPrivacy] = useState('');

    async function updatePrivacy(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/profile/set_privacy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, privacy })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(`Privacy setting updated to ${privacy}`);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className='grid w-max text-center' onSubmit={updatePrivacy}>
            <label>בחר הגדרת פרטיות</label>
            <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                <option value="">בחר הגדרת פרטיות</option>
                <option value="public">ציבורי</option>
                <option value="private">פרטי</option>
            </select>
            <input type="submit" value="עדכן פרטיות" />
        </form>
    );
}