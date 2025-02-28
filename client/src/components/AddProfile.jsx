import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AddProfile({ username }) {

    const [profileName, setProfileName] = useState("");
    const [pin, setPin] = useState("");
    const [parent, setParent] = useState(false);
    const navigate = useNavigate();

    async function addProf(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/user/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, pin, parent })
            });
            let data = await response.json();
            if (response.ok) {
                navigate('/dashboard', { state: { username, profileName } });
            }
            else {
                return null;
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className="grid grid-cols-2 w-max *:border-1 gap-1"
            onSubmit={(e) => addProf(e)}>
            <label >שם פרופיל</label>
            <input type="text" onChange={(e) => setProfileName(e.target.value)} />
            <label >קוד סודי</label>
            <input type="password" onChange={(e) => setPin(e.target.value)} />
            <label >פרופיל הורה</label>
            <input type="checkbox" onChange={(e) => setParent(e.target.checked)} />
            <input className="col-span-2" type="submit" />
        </form>
    );
}