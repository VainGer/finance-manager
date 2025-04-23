import { useNavigate } from 'react-router-dom';
import SelectProfile from '../components/profiles/SelectProfile.jsx';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
export default function Account() {
    
    const [showSelectH1, setShowSelectH1] = useState(true);
    const { user } = useAuth();

    return (
        <div dir='rtl' className="bg-gradient-to-br from-gray-100 to-gray-300 min-h-screen">
            <Header username={user} />

            <div className="flex flex-col items-center justify-center mt-16 mx-4 md:mx-0 text-gray-900">

                {showSelectH1 &&
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="text-4xl font-bold text-blue-700 text-center mb-6"
                    >
                        {user ? `${user}, בחר את הפרופיל שלך` : "בחר פרופיל"}
                    </motion.h1>
                }
                <SelectProfile username={user} showSelectH1={setShowSelectH1} />
            </div>
        </div>
    );
}
