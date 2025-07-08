import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { openProfile } from '../../API/user.js';
import { useAuth } from '../../../src/context/AuthContext.jsx';

export default function AuthProfile({ username, profileName, parent, backToSelect }) {
    const [pin, setPin] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');
    const { setProfile } = useAuth();
    const navigate = useNavigate();

    async function authProf(e) {
        e.preventDefault();
        const result = await openProfile(username, profileName, pin);
        if (pin.length === 0) {
            setShowError(true);
            setError('נא להזין קוד סודי');
            return;
        }
        if (result.status === 401) {
            setShowError(true);
            setError('הקוד הסודי שגוי');
            return;
        }
        if (result.status === 200) {
            setProfile({ profileName: profileName, parent: parent });
            navigate('/dashboard');
        }
    }

    return (
        <form className='grid grid-cols-1 gap-4 text-center'
            onSubmit={(e) => authProf(e)}>
            <label className='font-medium'>הזן את הקוד הסודי</label>
            <input className='p-2 border border-gray-300 rounded-lg shadow-lg text-center' data-testid="pin"
                onChange={(e) => setPin(e.target.value)} type="password" />
            {showError && <p className='text-red-500'>{error}</p>}
            <motion.button
                transition={{ duration: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='p-2 bg-green-500 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-green-600 transition-all'
                type="submit"
                data-testid="submit"
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