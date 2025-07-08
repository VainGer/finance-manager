import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Login from './auth/Login';
import Register from './auth/Register';
import { TiThMenu } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";

export default function Header({ username, profileName, parent }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [inMobile, setInMobile] = useState(window.innerWidth < 768);
    const [showNav, setShowNavAsMenu] = useState(!inMobile);

    window.addEventListener('resize', () => {
        setInMobile(window.innerWidth < 768);
        setShowNavAsMenu(!inMobile);
    });

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
                    <div className='md:flex md:gap-4 md:items-center *:mx-auto grid'>
                        {!inMobile && <h2 className='text-lg font-medium'>שלום, {profileName}!</h2>}
                        {location.pathname === '/dashboard' && (
                            <div>
                                {inMobile &&
                                    <div className='w-12 h-12  *:w-full *:h-full'>
                                        <TiThMenu
                                            onClick={() => {
                                                setShowNavAsMenu(!showNav);
                                            }}
                                        /></div>}
                                <AnimatePresence>
                                    {showNav && (
                                        <motion.div initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0 }}
                                            className='flex md:gap-4 md:static md:h-auto md:w-auto md:bg-white/0 md:*:w-auto md:*:h-auto md:flex-row md:pt-0
                                absolute bg-indigo-900/85 w-screen h-screen z-50 inset-0 flex-col pt-30 gap-4'>
                                            {inMobile && <div> <h2 className='text-lg font-medium'>שלום, {profileName}!</h2>
                                                <motion.button className='absolute top-4 right-4 text-2xl text-white w-10 h-10 *:w-full *:h-full'
                                                    whileTap={{ y: 3 }}
                                                    onClick={() => setShowNavAsMenu(!showNav)}>
                                                    <RxCross2 />
                                                </motion.button>
                                            </div>}
                                            <motion.button
                                                transition={{ duration: 0 }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className='px-4 py-2 bg-gray-200 text-blue-600 rounded-md hover:bg-gray-300 transition mx-4'
                                                onClick={() => navigate('/acc_settings', { state: { username, profileName, parent } })}
                                            >
                                                הגדרות משתמש
                                            </motion.button>
                                            <motion.button
                                                transition={{ duration: 0 }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className='px-4 py-2 bg-gray-200 text-blue-600 rounded-md hover:bg-gray-300 transition mx-4'
                                                onClick={() => navigate('/account', { state: { username, profileName, parent } })}
                                            >
                                                לצאת מהפרופיל
                                            </motion.button>
                                            <motion.button
                                                transition={{ duration: 0 }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className='px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-200 transition mx-4'
                                                onClick={() => navigate('/')}
                                            >
                                                יציאה
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
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
                        <motion.button
                            transition={{ duration: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-200 transition'
                            onClick={() => setShowRegister(true)}
                        >
                            להרשמה
                        </motion.button>
                    </div>
                )}
            </div>

            {showLogin && <Login setIsOpen={setShowLogin} />}
            {showRegister && <Register setIsOpen={setShowRegister} />}
        </header >

    );
}
