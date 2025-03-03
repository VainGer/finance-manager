import { useState, useEffect } from 'react';
import AddProfile from './AddProfile';
import AuthProfile from './AuthProfile';

export default function SelectProfile({ username }) {
    const [profiles, setProfiles] = useState([]);
    const [toggleProfiles, setToggleProfiles] = useState(true);
    const [toggleAddProfiles, setToggleAddProfiles] = useState(false);
    const [toggleAddBtn, setToggleAddBtn] = useState(true);
    const [toggleAuthProfile, setToggleAuthProfile] = useState(false);
    const [profileName, setProfileName] = useState('');
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
                return [];
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

    function selectProfile(e) {
        setProfileName(e.target.innerText);
        setToggleProfiles(false);
        setToggleAuthProfile(true);
    }

    return (
        <div className="grid text-center w-max m-auto align-middle border-1 *:border-1">
            {profiles.length > 0 ? (
                <div className='*:border-1'>
                    {toggleProfiles && <div>{
                        profiles.map((profile, index) => (
                            <button key={index} onClick={(e) => selectProfile(e)}>{profile}</button>
                        ))}
                    </div>
                    }
                    {toggleAuthProfile && <AuthProfile username={username} profileName={profileName} />}
                    {toggleAddBtn && <button onClick={(e) => {
                        setToggleProfiles(false);
                        setToggleAddProfiles(true);
                        setToggleAddBtn(false);
                    }
                    }>הוסף פרופיל</button>}
                    {toggleAddProfiles && <div><AddProfile username={username} />
                        <button onClick={(e) => {
                            setToggleProfiles(true);
                            setToggleAddProfiles(false);
                            setToggleAddBtn(true);
                        }}>לחזרה</button>
                    </div>}
                </div>
            ) : (
                <div>
                    <h1>לא נמצאו פרופילים, צור פרופיל חדש</h1>
                    <AddProfile username={username} />
                </div>
            )
            }
        </div >
    )
}