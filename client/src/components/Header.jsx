import { useState, useEffect, use } from 'react';
import Login from './Login';


export default function Header({ username, profileName, parent }) {
    const [showLogin, setShowLogin] = useState(false);
    return (
        <div className='grid grid-cols-3 text-center items-center w-full'>
            <img className='w-25 place-self-center' src="./src/assets/images/logo.jpg" alt="LOGO" />
            {username && profileName ? (
                <div>
                    <h2>Profile Name: {profileName}</h2>
                    <a href="/">לצאת מהמשתמש</a>
                </div>
            ) : (
                <div>
                    {username && !profileName ? (
                        <p>{username} ברוך הבא למשתמש, בחר את הפרופיל שלך</p>) : (
                        <div className='flex gap-4 justify-center items-center'>
                            <div>
                                {!showLogin && <button className='hover: cursor-pointer border-1' onClick={() => setShowLogin(true)}>לכניסה</button>}
                                {showLogin && <div className='w-max'><Login /></div>}
                            </div>
                            <a className='border-1' href="/register">להרשמה</a>
                        </div>)}
                </div>
            )}
        </div>
    );
}
