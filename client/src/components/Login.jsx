import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function login(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            let data = await response.json();
            if (response.ok) {
                navigate('/account', { state: { username } });
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <form className='grid grid-cols-3 *:border-1 gap-2 w-full' onSubmit={login}>
            <input className='text-center' type="text" placeholder="שם משתמש" onChange={(e) => setUsername(e.target.value)} />
            <input className='text-center' type="password" placeholder="סיסמה" onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">כניסה</button>
        </form>
    );
}