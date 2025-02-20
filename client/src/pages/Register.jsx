import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Register() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function register(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            if (response.ok) {
                navigate('/account', { state: { username } });
            }
            else {
                alert("Invalid username or password");
                //TODO
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={register}>
                <label>Username</label>
                <input className='border 2 border-solid' type="text" onChange={(e) => setUsername(e.target.value)} />
                <label>Password</label>
                <input className='border 2 border-solid' type="password" onChange={(e) => setPassword(e.target.value)} />
                <input type="submit" value="Register" />
            </form>
        </div>
    );
}