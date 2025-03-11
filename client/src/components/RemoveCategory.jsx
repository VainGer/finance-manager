import { useState } from "react";
import { motion } from "framer-motion";

export default function RemoveCategory({ username, profileName, category, refreshExpenses, showConfirm }) {
    const [secretCode, setSecretCode] = useState('');
    const [error, setError] = useState('');
    
    async function removeCat(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/profile/rem_cat_items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, category, secretCode })
            });
            let data = await response.json();

            if (response.ok) {
                console.log(`Category ${category} removed successfully`);
                refreshExpenses();
                showConfirm(false);
            } else {
                setError(data.message || "הקוד הסודי שגוי, נסה שוב.");
            }
        } catch (error) {
            console.log(error);
            setError("שגיאה בביצוע הפעולה, נסה שוב.");
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md px-4"
        >
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md text-center">
                <h2 className="text-xl font-bold text-red-600 mb-4">מחיקת קטגוריה</h2>
                <p className="text-gray-700 mb-4">
                    הפעולה תמחק את הקטגוריה <span className="font-bold">{category}</span> ואת כל הפריטים שבתוכה.
                    <br />
                    <span className="text-red-500 font-bold">לא ניתן לשחזר פעולה זו!</span>
                </p>

                {/* שדה קוד סודי */}
                <label className="text-gray-700 font-medium">הזן את הקוד הסודי של הפרופיל כדי לאשר</label>
                <input
                    type="password"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-center mt-2"
                    placeholder="הכנס קוד סודי"
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value)}
                />

                {/* הודעת שגיאה */}
                {error && <p className="text-red-600 mt-2">{error}</p>}

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        className="px-4 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                        onClick={() => showConfirm(false)}
                    >
                        ביטול
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        onClick={removeCat}
                        disabled={!secretCode} // הכפתור יהיה מושבת עד שמזינים קוד
                    >
                        מחק קטגוריה
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
