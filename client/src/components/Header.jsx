import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoginPopup from './LoginPopup';
import { div } from 'framer-motion/client';

export default function Header({ username, profileName, parent }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [showLogin, setShowLogin] = useState(false);

    async function login(username, password) {
        try {
            let response = await fetch('http://localhost:5500/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            let data = await response.json();

            if (response.ok) {
                setShowLogin(false); // סוגר את הפופ-אפ אם ההתחברות הצליחה
                navigate('/account', { state: { username } });
            } else {
                return { ok: false, message: data.message };
            }
        }
        catch (error) {
            console.log(error);
            return { ok: false, message: "שגיאה בחיבור, נסה שוב מאוחר יותר." };
        }
    }

    return (
        <header className='relative w-full h-16 bg-blue-600 text-white shadow-md flex items-center px-6'>
            <img className='h-12' src="./src/assets/images/logo.jpg" alt="LOGO" />

            <div className='flex gap-6 items-center mx-auto'>
                {username && !profileName && (
                    <div className='flex gap-4 items-center'>
                        <h2 className='place-self-start text-lg font-medium'>שלום, {username}!</h2>
                        {location.pathname === '/dashboard' && (
                            <motion.button
                                transition={{ duration: 0 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className='px-4 py-2 bg-gray-200 text-blue-600 rounded-md hover:bg-gray-300 transition'
                                onClick={() => navigate('/acc_settings', { state: { username, profileName, parent } })}
                            >
                                הגדרות משתמש
                            </motion.button>
                        )}
                        <motion.button
                            transition={{ duration: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-200 transition'
                            onClick={() => navigate('/')}
                        >
                            יציאה
                        </motion.button>
                    </div>
                )}
                {username && profileName ? (
                    <div className='flex gap-4 items-center'>
                        <h2 className='text-lg font-medium'>שלום, {profileName}!</h2>
                        {location.pathname === '/dashboard' && (
                            <div className='*:mx-4'>
                                <motion.button
                                    transition={{ duration: 0 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className='px-4 py-2 bg-gray-200 text-blue-600 rounded-md hover:bg-gray-300 transition'
                                    onClick={() => navigate('/acc_settings', { state: { username, profileName, parent } })}
                                >
                                    הגדרות משתמש
                                </motion.button>
                                <motion.button
                                    transition={{ duration: 0 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className='px-4 py-2 bg-gray-200 text-blue-600 rounded-md hover:bg-gray-300 transition'
                                    onClick={() => navigate('/account', { state: { username, profileName, parent } })}
                                >
                                    לצאת מהפרופיל
                                </motion.button>
                            </div>
                        )}
                        <motion.button
                            transition={{ duration: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-200 transition'
                            onClick={() => navigate('/')}
                        >
                            יציאה
                        </motion.button>
                    </div>
                ) : (!username && !profileName &&
                    <div className='flex gap-4 items-center'>
                        <motion.button
                            transition={{ duration: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-200 transition'
                            onClick={() => setShowLogin(true)}
                        >
                            לכניסה
                        </motion.button>
                        <motion.a
                            transition={{ duration: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-200 transition'
                            href="/register"
                        >
                            להרשמה
                        </motion.a>
                    </div>
                )}
            </div>

            {showLogin && <LoginPopup isOpen={showLogin} setIsOpen={setShowLogin} login={login} />}
        </header>

    );
}
