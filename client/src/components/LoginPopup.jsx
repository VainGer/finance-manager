import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaTimes } from 'react-icons/fa';

export default function LoginPopup({ isOpen, setIsOpen, login }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null); 

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null); 
    
        // בדיקה אם השדות ריקים
        if (!username.trim() || !password.trim()) {
            setError("שם משתמש וסיסמה אינם יכולים להיות ריקים.");
            return;
        }
    
        try {
            let response = await login(username, password); 
    
            if (!response.ok) { 
                let data = await response.json();
                setError(data.message || "שם משתמש או סיסמה שגויים."); 
            } else {
                setIsOpen(false);
            }
        }
        catch (error) {
            console.log(error);
            setError("שם משתמש או סיסמה שגויים.");
        }
    }
    
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className='w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl border border-gray-300 relative'
            >
                <button
                    className='absolute top-4 left-4 text-gray-500 hover:text-gray-700'
                    onClick={() => setIsOpen(false)}
                >
                    <FaTimes size={20} />
                </button>

                <form className='grid grid-cols-1 gap-6 text-center' onSubmit={handleSubmit}>
                    <h2 className='text-3xl font-bold text-blue-600'>התחברות</h2>

                
                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-500 text-center text-sm"
                        >
                            {error}
                        </motion.p>
                    )}

                    <div className='relative'>
                        <FaUser className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' />
                        <input
                            className='w-full p-3 pl-10 border border-gray-300 rounded-md text-center text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-200'
                            type="text"
                            placeholder="שם משתמש"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className='relative'>
                        <FaLock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' />
                        <input
                            className='w-full p-3 pl-10 border border-gray-300 rounded-md text-center text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-200'
                            type="password"
                            placeholder="סיסמה"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-blue-700 transition-all'
                        type="submit"
                    >
                        כניסה
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
