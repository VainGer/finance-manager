import { useState } from 'react';

export default function RenameProfileName({ username, currentProfileName }) {
    const [newProfileName, setNewProfileName] = useState('');

    async function renameProfile(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/user/rename', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, currentProfileName, newProfileName })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(`Profile name changed to ${newProfileName} successfully`);
                setNewProfileName(''); 
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className="grid w-max text-center" onSubmit={renameProfile}>
            <label>שם פרופיל חדש</label>
            <input type="text" value={newProfileName} onChange={(e) => setNewProfileName(e.target.value)} />
            <input type="submit" value="שנה שם פרופיל" />
        </form>
    );
}