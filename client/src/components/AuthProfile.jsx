import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthProfile({ username, profileName, parent, backToSelect }) {
    const [pin, setPin] = useState('');
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();

    async function authProf(e) {
        e.preventDefault();
        try {
            console.log('Sending request with:', { username, profileName, pin });
            let response = await fetch('http://localhost:5500/api/user/enter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, pin })
            });
            let data = await response.json();
            console.log('Response:', response);
            console.log('Data:', data);
            if (response.ok) {
                navigate('/dashboard', { state: { username, profileName, parent } });
            }
            else {
                console.log(data.message);
                setShowError(true);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <form className='grid grid-cols-1 gap-4 text-center'
            onSubmit={(e) => authProf(e)}>
            <label className='font-medium'>הזן את הקוד הסודי</label>
            <input className='p-2 border border-gray-300 rounded-lg shadow-lg text-center'
                onChange={(e) => setPin(e.target.value)} type="password" />
            {showError && <p className='text-red-500'>קוד סודי לא נכון</p>}
            <motion.button
                transition={{ duration: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='p-2 bg-green-500 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-green-600 transition-all'
                type="submit"
            >
                כניסה לפרופיל
            </motion.button>
            <motion.button
                transition={{ duration: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 font-medium rounded-lg shadow-md hover:bg-gray-400 transition"
                onClick={(e) => {
                    backToSelect();
                }}
            >
                חזרה לבחירת פרופיל
            </motion.button>
        </form>
    );
}