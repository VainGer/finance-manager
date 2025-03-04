import { useState, useEffect } from 'react';

export default function GetProfs({ username, onProfilesFetched }) {
    const [profiles, setProfiles] = useState([]);

    // Fetch profiles when the component mounts
    useEffect(() => {
        async function fetchProfiles() {
            try {
                let response = await fetch('http://localhost:5500/api/user/get-profiles', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username })
                });
                let data = await response.json();
                if (response.ok) {
                    setProfiles(data.profiles);
                    if (onProfilesFetched) {
                        onProfilesFetched(data.profiles);
                    }
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchProfiles();
    }, [username, onProfilesFetched]);

    return (
        <div>
            <h2>פרופילים</h2>
            {profiles.length > 0 ? (
                <ul>
                    {profiles.map((profile, index) => (
                        <li key={index}>{profile}</li>
                    ))}
                </ul>
            ) : (
                <p>אין פרופילים להצגה</p>
            )}
        </div>
    );
}