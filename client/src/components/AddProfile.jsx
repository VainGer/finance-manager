import { useState, useEffect } from "react";

export default function AddProfile({ username }) {
    const [profileName, setProfileName] = useState("");
    const [pin, setPin] = useState("");
    const [parent, setParent] = useState(false);

    async function addProf(e) {
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
                return data.profiles;
            }
            else {
                return null;
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className="grid grid-cols-2 w-max *:border-1 gap-1">
            <label >שם פרופיל</label>
            <input type="text" />
            <label >קוד סודי</label>
            <input type="password" />
            <label >פרופיל הורה</label>
            <input type="checkbox" />
            <input className="col-span-2" type="submit" />
        </form>
    );
}