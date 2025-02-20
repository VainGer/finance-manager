import { useState, useEffect } from 'react';
import AddProfile from './AddProfile';
export default function ProfileList({ username }) {
    const [profiles, setProfiles] = useState([]);

    async function getProfiles() {
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
                return data.profiles;
            }
            else {
                return null;
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function fetchProfiles() {
            const profiles = await getProfiles();
            if (profiles) {
                setProfiles(profiles);
            }
        }
        fetchProfiles();
    }, [username]);

    return (
        <div>
            {profiles.length > 0 ? (
                profiles.map((profile, index) => (
                    <div key={index}>
                        <h2>{profile}</h2>
                    </div>
                ))
            ) : (
                <AddProfile />
            )}
        </div>
    )
}