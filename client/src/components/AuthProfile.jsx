import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthProfile({ username, profileName, parent }) {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    async function authProf(e) {
        e.preventDefault();
        setError(null); 
        try {
            let response = await fetch('http://localhost:5500/api/user/enter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, pin })
            });
            let data = await response.json();

            if (response.ok) {
                navigate('/dashboard', { state: { username, profileName, parent } });
            } else {
                setError(data.message || "קוד שגוי, נסה שוב.");
            }
        } catch (error) {
            console.log(error);
            setError("שגיאה בחיבור, נסה שוב מאוחר יותר.");
        }
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="w-full max-w-md mx-auto mt-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-200"
        >
            <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">אימות פרופיל</h2>

      
            {error && (
                <motion.p 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="text-red-500 mb-4 text-center text-sm"
                >
                    {error}
                </motion.p>
            )}

            <form onSubmit={authProf} className="grid gap-4">
                <div className="flex flex-col">
                    <label className="text-gray-700 font-medium">הזן את הקוד הסודי</label>
                    <input 
                        className="w-full p-3 border border-gray-300 rounded-md text-gray-900 bg-white focus:border-blue-500 focus:ring focus:ring-blue-200 text-center"
                        type="password" 
                        placeholder="****"
                        onChange={(e) => setPin(e.target.value)}
                    />
                </div>

     
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-blue-700 transition"
                    type="submit"
                >
                    כניסה לפרופיל
                </motion.button>
            </form>
        </motion.div>
    );
}
