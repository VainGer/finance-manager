import { useState, useEffect, use } from 'react';
import Login from './Login';


export default function Header({ username, profileName }) {
    const [showLogin, setShowLogin] = useState(false);

    return (
        <div className='grid grid-cols-3 text-center items-center w-full'>
            <img className='w-24 place-self-center' src="./src/assets/images/logo.jpg" alt="LOGO" />
            {username && profileName ? (
                <div>
                    Profile Name: {profileName}
                </div>
            ) : (
                <div>
                    {username && !profileName ? (
                        <div>
                            User name : {username}
                        </div>) : (
                        <div className='grid grid-cols-2 w-full *:w-max'>
                            {!showLogin && <button className='bg-red-100' onClick={() => setShowLogin(true)}>לכניסה</button>}
                            {showLogin && <Login />}
                            <a href="/register">להרשמה</a>
                        </div>)}
                </div>
            )}
        </div>
    );
}
