import { useEffect, useState } from "react"

export default function register() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function register(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            let data = await response;
            if (data.status === 401) {
                alert("Invalid username or password");
                //TODO
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    return <>
        <div>
            <h1>Register</h1>
            <form onSubmit={register}>
                <label>Username</label>
                <input className='border 2 border-solid' type="text" onChange={(e) => setUsername(e.target.value)} />
                <label>Password</label>
                <input type="password" onChange={(e) => setPassword(e.target.value)} />
                <input type="submit"></input>
            </form>
        </div>
    </>
}