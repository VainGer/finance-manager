import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DeleteProfile({ username, profileName }) {
    const [confirmation, setConfirmation] = useState('');
    const navigate = useNavigate();

    async function deleteProfile(e) {
        e.preventDefault();
        if (confirmation !== 'DELETE') {
            alert('Please type DELETE to confirm');
            return;
        }
        try {
            let response = await fetch('http://localhost:5500/api/user/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(`Profile ${profileName} deleted successfully`);
                navigate('/'); 
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className="grid w-max text-center" onSubmit={deleteProfile}>
            <label>Type DELETE to confirm</label>
            <input type="text" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} />
            <input type="submit" value="Delete Profile" />
        </form>
    );
}