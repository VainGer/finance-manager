import { useState } from "react";
import { motion } from "framer-motion";

export default function RenameCategory({ username, profileName, category, refreshExpenses, showConfirm }) {
    const [newName, setNewName] = useState('');
    const [error, setError] = useState('');

    function handleNewNameChange(e) {
        const newValue = e.target.value;
        setNewName(newValue);

        if (newValue === category) {
            setError('אי אפשר לשנות לאותו שם');
        } else {
            setError('');
        }
    }

    async function renameCategory(e) {
        e.preventDefault();
        if (newName === category) {
            setError('אי אפשר לשנות לאותו שם');
            return;
        }

        try {
            let response = await fetch('http://localhost:5500/api/profile/rename_cat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, category, newName })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(data.message);
                refreshExpenses();
                showConfirm(false);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
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
                <h2 className="text-xl font-bold text-blue-700 mb-4">שנה שם לקטגוריה: {category}</h2>

                <form onSubmit={renameCategory} className="grid gap-4">
                    <input
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                        type="text"
                        placeholder="שם חדש לקטגוריה"
                        value={newName}
                        onChange={handleNewNameChange}
                        required
                    />

                    
                    {error && <p className="text-red-500 font-medium">{error}</p>}

                    <div className="grid grid-cols-2 gap-4">
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
                            type="submit"
                            className={`px-4 py-3 text-white rounded-lg transition ${
                                error ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                            disabled={!!error}
                        >
                            שנה שם
                        </motion.button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}
