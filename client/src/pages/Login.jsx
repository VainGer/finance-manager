import { useState, useEffect } from 'react';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function login(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            let data = await response.json();
            console.log('data ==> ', data);
            console.log('response ==> ', response);
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={login}>
                <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}