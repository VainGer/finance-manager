import { useState } from 'react';
import { FaLock, FaCheck, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ChangePinCode({ username, profileName, setShowBtns, setShowChangePinCode }) {
    const [pin, setPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmNewPin, setConfirmNewPin] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    async function changePin(e) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (newPin.length < 4) {
            setError('הקוד הסודי חייב להיות לפחות 4 ספרות.');
            return;
        }

        if (newPin !== confirmNewPin) {
            setError('הקוד הסודי החדש ואישור הקוד אינם תואמים.');
            return;
        }

        try {
            let response = await fetch('http://localhost:5500/api/user/change_pin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, profileName, pin, newPin })
            });

            let data = await response.json();
            if (response.ok) {
                setSuccess('הקוד הסודי שונה בהצלחה!');
                setTimeout(() => {
                    setShowBtns(true);
                    setShowChangePinCode(false);
                }, 2000);
            } else {
                setError(data.message || 'שגיאה בעת שינוי הקוד הסודי.');
            }
        } catch (error) {
            console.log(error);
            setError('שגיאה בחיבור לשרת, נסה שוב.');
        }
    }

    return (
        <div className="w-full max-w-md mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-blue-600 text-center mb-4">שינוי קוד סודי</h2>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {success && <p className="text-green-500 text-center mb-4">{success}</p>}

            <form className="grid gap-4" onSubmit={changePin}>

               
                <div className="relative">
                    <FaLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                        type="password"
                        className="w-full p-3 pr-10 border border-gray-300 rounded-md text-center focus:border-blue-500 focus:ring focus:ring-blue-200"
                        placeholder="קוד סודי נוכחי"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                    />
                </div>

            
                <div className="relative">
                    <FaLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                        type="password"
                        className="w-full p-3 pr-10 border border-gray-300 rounded-md text-center focus:border-blue-500 focus:ring focus:ring-blue-200"
                        placeholder="קוד סודי חדש"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                    />
                </div>

               
                <div className="relative">
                    <FaLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                        type="password"
                        className="w-full p-3 pr-10 border border-gray-300 rounded-md text-center focus:border-blue-500 focus:ring focus:ring-blue-200"
                        placeholder="אישור קוד סודי חדש"
                        value={confirmNewPin}
                        onChange={(e) => setConfirmNewPin(e.target.value)}
                    />
                </div>

             
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-red-400 text-white font-medium rounded-lg shadow-md hover:bg-gray-500 transition"
                        type="button"
                        onClick={() => {
                            setShowChangePinCode(false);
                            setShowBtns(true);
                        }}
                    >
                        <FaTimes className="inline-block mr-2" /> ביטול
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition"
                        type="submit"
                    >
                        <FaCheck className="inline-block mr-2" /> שנה קוד סודי
                    </motion.button>
                </div>
            </form>
        </div>
    );
}
