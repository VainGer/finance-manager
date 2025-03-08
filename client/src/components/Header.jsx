import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';


export default function Header({ username, profileName, parent }) {
    const [showLogin, setShowLogin] = useState(false);
    const navigate = useNavigate();

    return (
        <div className='grid grid-cols-3 text-center items-center w-full'>
            <img className='w-25 place-self-center' src="./src/assets/images/logo.jpg" alt="LOGO" />
            {location.pathname === '/dashboard' ? (
                <div className='grid col-span-2 grid-cols-3'>
                    <h2>Profile Name: {profileName}</h2>
                    <button onClick={(e) => navigate('/acc_settings', { state: { username, profileName, parent } })
                    }>הגדרות משתמש</button>
                    <button onClick={(e) => navigate('/')}>לצאת מהמשתמש</button>
                </div>
            ) : (
                <div>
                    {location.pathname === '/account' ? (
                        <p>{username} ברוך הבא למשתמש, בחר את הפרופיל שלך</p>) : (
                        location.pathname === '/acc_settings' ? (
                            <div className='grid grid-cols-3'>
                                <h2>Profile Name: {profileName}</h2>
                                <button onClick={(e) => navigate('/dashboard', { state: { username, profileName, parent } })
                                }>חזרה לעמוד</button>
                                <button onClick={(e) => navigate('/')}>לצאת מהמשתמש</button>
                            </div>
                        ) : (< div className='flex gap-4 justify-center items-center'>
                            <div>
                                {!showLogin && <button className='hover: cursor-pointer border-1' onClick={() => setShowLogin(true)}>לכניסה</button>}
                                {showLogin && <div className='w-max'><Login /></div>}
                            </div>
                            <a className='border-1' href="/register">להרשמה</a>
                        </div>)
                    )}
                </div>
            )}
        </div >
    );
}
