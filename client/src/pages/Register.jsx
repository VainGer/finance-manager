import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
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
        <div dir="rtl" className="text-center">
            <div className="grid grid-cols-2 w-full h-max place-items-center">
                <img className="w-25" src="./src/assets/images/logo.jpg" alt="logo" />
                <a href="/">חזרה לדף הבית</a>
            </div>
            <h1>הרשמה</h1>
            <form onSubmit={register} className="grid text-center place-items-center">
                <label>Username</label>
                <input className='border-1' type="text" onChange={(e) => setUsername(e.target.value)} />
                <label>Password</label>
                <input className='border-1' type="password" onChange={(e) => setPassword(e.target.value)} />
                <input type="submit" value="Register" />
            </form>
        </div>
    );
}