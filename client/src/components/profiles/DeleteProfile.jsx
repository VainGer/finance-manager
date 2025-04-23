import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaTrash, FaTimes } from 'react-icons/fa';
import { deleteProfile } from '../../API/user';
import { useAuth } from '../../context/AuthContext.jsx';

export default function DeleteProfile({ username, profileName, setShowBtns, setShowDeleteProfile }) {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { setProfile } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        if (!pin.trim()) {
            setError("יש להזין קוד סודי למחיקת הפרופיל.");
            return;
        }

        const confirmDelete = window.confirm(`האם אתה בטוח שברצונך למחוק את הפרופיל "${profileName}"?`);
        if (!confirmDelete) return;

        const response = await deleteProfile(username, profileName, pin);
        if (response.status === 200) {
            alert("הפרופיל נמחק בהצלחה.");
            setProfile(null);
            navigate('/account');
        } else if (response.status === 400) {
            setError("הפרופיל לא קיים או שהקוד הסודי שגוי.");
        } else {
            setError("שגיאה לא ידועה. אנא נסה שוב מאוחר יותר.");
        }
    }

    return (
        <div className="w-full max-w-md mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-red-600 text-center mb-4">מחיקת פרופיל</h2>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <form className="grid gap-4 text-center" onSubmit={handleSubmit}>
                <label className="text-gray-700">הזן את הקוד הסודי שלך</label>

                <div className="relative">
                    <FaLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                        type="password"
                        className="w-full p-3 pr-10 border border-gray-300 rounded-md text-center focus:border-red-500 focus:ring focus:ring-red-200"
                        placeholder="קוד סודי"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gray-400 text-white font-medium rounded-lg shadow-md hover:bg-gray-500 transition"
                        type="button"
                        onClick={() => {
                            setShowBtns(true);
                            setShowDeleteProfile(false);
                        }}
                    >
                        <FaTimes className="inline-block mr-2" /> ביטול
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg shadow-md hover:bg-red-700 transition"
                        type="submit"
                    >
                        <FaTrash className="inline-block mr-2" /> מחק פרופיל
                    </motion.button>
                </div>
            </form>
        </div>
    );
}
