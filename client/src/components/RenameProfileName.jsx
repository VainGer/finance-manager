import { useState } from 'react';

export default function RenameProfileName({ username, profileName, setProfileName, setShowBtns, setShowRenameProfile }) {
    const [newProfileName, setNewProfileName] = useState('');

    async function renameProfile(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/user/rename', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, newProfileName })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(`Profile name changed to ${newProfileName} successfully`);
                profileName = newProfileName;
                setProfileName(newProfileName);
                setShowBtns(true);
                setShowRenameProfile(false);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className="grid w-max text-center *:border-1" onSubmit={renameProfile}>
            <label>שם פרופיל חדש</label>
            <input type="text" onChange={(e) => { setNewProfileName(e.target.value) }} />
            <div className='grid grid-cols-2 *:border-1'>
                <input type="button" value="ביטול" onClick={(e) => { setShowRenameProfile(false); setShowBtns(true); }} />
                <input type="submit" value="שנה שם פרופיל" />
            </div>
        </form>
    );
}