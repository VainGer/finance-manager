import { useState } from 'react';

export default function SetPrivacy({ username, profileName, category }) {
    const [privacy, setPrivacy] = useState('');

    async function updatePrivacy(e) {
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
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <label>לסמן קטגוריה כפרטית</label>
            <input type='checkbox' onChange={(e) => { setPrivacy(e.target.checked); updatePrivacy(e); }}></input>
        </div>
    );
}