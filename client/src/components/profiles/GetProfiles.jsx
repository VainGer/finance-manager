import { useState, useEffect } from 'react';
import { getProfiles } from '../../API/user';

export default function GetProfs({ username, onProfilesFetched }) {

    const [profiles, setProfiles] = useState([]);

    useEffect(() => {

        async function fetchProfiles() {
            let response = await getProfiles(username);
            if (response.status === 200 || response.status === 404) {
                setProfiles(data.profiles);
                if (onProfilesFetched) {
                    onProfilesFetched(data.profiles);
                }
            }
            else {
                console.log(response.error);
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