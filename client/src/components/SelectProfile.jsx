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
    const [parent, setParent] = useState(false); // Added parent state

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
            } else {
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

    return (
        <div className="grid text-center w-max m-auto align-middle border-1 *:border-1">
            {profiles.length > 0 ? (
                <div>
                    {toggleProfiles && <div className='grid *:border-1'>{
                        profiles.map((profile, index) => (
                            <button className='hover:bg-blue-100 hover:cursor-pointer' key={index} onClick={(e) => {
                                setProfileName(e.target.innerText);
                                setParent(profile.parent)
                                setToggleAuthProfile(true);
                                setToggleProfiles(false);
                                setToggleAddBtn(false);
                            }}>{profile.pName}</button>
                        ))
                    }
                    </div>
                    }
                    {toggleAuthProfile && <div>
                        <AuthProfile username={username} profileName={profileName} parent={parent} />
                        <button onClick={(e) => {
                            setToggleProfiles(true);
                            setToggleAddProfiles(false);
                            setToggleAddBtn(true);
                            setToggleAuthProfile(false);
                        }}>לחזרה</button>
                    </div>}
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