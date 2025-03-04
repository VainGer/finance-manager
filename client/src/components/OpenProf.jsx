import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OpenProf({ username }) {
    const [profileName, setProfileName] = useState('');
    const [pin, setPin] = useState('');
    const navigate = useNavigate();

    async function openProfile(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/user/enter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, pin })
            });
            let data = await response.json();
            if (response.ok) {
                navigate('/dashboard', { state: { username, profileName } });
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className="grid w-max text-center" onSubmit={openProfile}>
            <label>שם פרופיל</label>
            <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
            <label>קוד סודי</label>
            <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} />
            <input type="submit" value="פתח פרופיל" />
        </form>
    );
}