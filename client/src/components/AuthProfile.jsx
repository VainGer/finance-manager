import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export default function AuthProfile({ username, profileName, parent }) {
    const [pin, setPin] = useState('');
    const navigate = useNavigate();

    async function authProf(e) {
        e.preventDefault();
        try {
            console.log('Sending request with:', { username, profileName, pin });
            let response = await fetch('http://localhost:5500/api/user/enter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, pin })
            });
            let data = await response.json();
            console.log('Response:', response);
            console.log('Data:', data);
            if (response.ok) {
                navigate('/dashboard', { state: { username, profileName, parent } });
            }
            else {
                console.log(data.message);
                //TODO
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <form onSubmit={(e) => authProf(e)}>
            <label>הזן את הקוד הסודי</label>
            <input onChange={(e) => setPin(e.target.value)} type="password" />
            <input type="submit" value="כניסה לפרופיל" />
        </form>
    );
}