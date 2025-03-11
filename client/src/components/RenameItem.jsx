import { motion } from "framer-motion";
import ItemsToSelcet from "./ItemsToSelcet";
import { FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function RenameItem({ username, profileName, category, refreshExpenses, showConfirm }) {
    const [item, setItem] = useState('');
    const [newName, setNewName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        console.log("נבחר פריט:", item);
    }, [item]);

    function handleNewNameChange(e) {
        const newValue = e.target.value;
        setNewName(newValue);

        if (newValue === item) {
            setError('אי אפשר לשנות לאותו שם');
        } else {
            setError('');
        }
    }

    async function renameItem(e) {
        e.preventDefault();
        if (newName === item) {
            setError('אי אפשר לשנות לאותו שם');
            return;
        }

        try {
            let response = await fetch('http://localhost:5500/api/profile/rename_item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, category, item, newName })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(`Item ${item} renamed to ${newName} successfully`);
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md px-4"
        >
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md text-center relative">
                
                <button className="absolute top-3 left-3 text-gray-500 hover:text-gray-700" onClick={() => showConfirm(false)}>
                    <FaTimes size={20} />
                </button>

                <h2 className="text-xl font-bold text-blue-700 mb-4">שינוי שם פריט</h2>

                <form className="grid gap-4" onSubmit={renameItem}>
                    <label className="text-gray-700 font-medium">בחר פריט</label>
                    
                   
                    <ItemsToSelcet 
                        key={item} 
                        username={username} 
                        profileName={profileName} 
                        category={category} 
                        onSelectedOpt={(selectedItem) => {
                            console.log("עדכון פריט שנבחר:", selectedItem);
                            setItem(selectedItem);
                            setNewName(''); 
                            setError('');
                        }} 
                    />

                   
                    <input
                        type="text"
                        className="border rounded-lg p-2 text-center outline-blue-500"
                        placeholder="פריט שנבחר"
                        value={item}
                        readOnly
                    />

                    <label className="text-gray-700 font-medium">שם חדש</label>
                    <input
                        type="text"
                        className="border rounded-lg p-2 text-center outline-blue-500"
                        placeholder="הזן שם חדש"
                        value={newName}
                        onChange={handleNewNameChange}
                    />

                    
                    {error && <p className="text-red-500 font-medium">{error}</p>}

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
                            type="submit"
                            className={`px-4 py-3 text-white rounded-lg transition ${
                                error ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                            disabled={!!error}
                        >
                            שמור
                        </motion.button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}
