import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginPopup from './LoginPopup';
import { motion } from 'framer-motion';

export default function Header() {
    const [showLogin, setShowLogin] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem("username") || null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

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
                localStorage.setItem("username", username); 
                setUsername(username); 
                navigate('/account', { state: { username } });
            }
        } catch (error) {
            console.log(error);
        }
    }

    function handleLogout() {
        localStorage.removeItem("username"); 
        setUsername(null); 
        navigate('/'); 
    }

    return (
        <header className='relative w-full h-20 bg-blue-600 text-white shadow-md flex justify-between items-center px-6'>
        
            <img className='h-12' src="./src/assets/images/logo.jpg" alt="LOGO" />

            <div className='flex gap-6 items-center'>
                {username ? (
                   
                    <div className='flex gap-4 items-center'>
                        <h2 className='text-lg font-medium'>שלום, {username}!</h2>
                        <motion.button 
                            whileHover={{ scale: 1.05 }} 
                            whileTap={{ scale: 0.95 }}
                            className='px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-200 transition'
                            onClick={handleLogout}
                        >
                            יציאה
                        </motion.button>
                    </div>
                ) : (
                 
                    <div className='flex gap-4 items-center'>
                        <motion.button 
                            whileHover={{ scale: 1.05 }} 
                            whileTap={{ scale: 0.95 }}
                            className='px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-200 transition'
                            onClick={() => setShowLogin(true)}
                        >
                            לכניסה
                        </motion.button>

                        <motion.a 
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
