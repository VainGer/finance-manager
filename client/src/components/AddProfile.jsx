import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AddProfile({ username }) {
    const [profileName, setProfileName] = useState("");
    const [pin, setPin] = useState("");
    const [parent, setParent] = useState(false);
    const navigate = useNavigate();

    async function addProf(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/user/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, pin, parent })
            });
            if (response.ok) {
                navigate('/dashboard', { state: { username, profileName, parent } });
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="w-full max-w-md mx-auto mt-6 p-6 bg-white rounded-2xl shadow-lg border border-gray-200"
        >
            <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">הוספת פרופיל</h2>

            <form onSubmit={addProf} className="grid gap-4">
     
                <div className="flex flex-col">
                    <label className="text-gray-700 font-medium">שם פרופיל</label>
                    <input 
                        type="text" 
                        className="w-full p-3 border border-gray-300 rounded-md text-gray-900 bg-white focus:border-blue-500 focus:ring focus:ring-blue-200"
                        placeholder="הכנס שם פרופיל"
                        onChange={(e) => setProfileName(e.target.value)} 
                    />
                </div>

         
                <div className="flex flex-col">
                    <label className="text-gray-700 font-medium">קוד סודי</label>
                    <input 
                        type="password" 
                        className="w-full p-3 border border-gray-300 rounded-md text-gray-900 bg-white focus:border-blue-500 focus:ring focus:ring-blue-200"
                        placeholder="הכנס קוד סודי"
                        onChange={(e) => setPin(e.target.value)} 
                    />
                </div>


                <div className="flex items-center gap-2">
                    <input 
                        type="checkbox" 
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                        onChange={(e) => setParent(e.target.checked)} 
                    />
                    <label className="text-gray-700 font-medium">הגדר כפרופיל הורה</label>
                </div>

                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-blue-700 transition"
                    type="submit"
                >
                    צור פרופיל
                </motion.button>
            </form>
        </motion.div>
    );
}
