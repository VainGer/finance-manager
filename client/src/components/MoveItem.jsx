import { motion } from 'framer-motion';
import { useState } from 'react';
import GetCats from './GetCats';
import ItemsToSelcet from './ItemsToSelcet';
import { FaTimes } from "react-icons/fa";

export default function MoveItem({ username, profileName, category, refreshExpenses, showConfirm }) {
    const [nextCat, setNextCat] = useState('');
    const [itemName, setItemName] = useState('');
    const [currentCat] = useState(category); 
    const [error, setError] = useState('');

    function handleCategoryChange(selectedCategory) {
        setNextCat(selectedCategory);
        if (selectedCategory === currentCat) {
            setError('אי אפשר להעביר פריט לאותה קטגוריה');
        } else {
            setError('');
        }
    }

    async function moveItem(e) {
        e.preventDefault();
        if (nextCat === currentCat) {
            setError('אי אפשר להעביר פריט לאותה קטגוריה');
            return;
        }

        try {
            let response = await fetch('http://localhost:5500/api/profile/move_item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, currentCat, nextCat, itemName })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(`Item ${itemName} moved from ${category} to ${nextCat} successfully`);
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

                <h2 className="text-xl font-bold text-blue-700 mb-4">העברת פריט</h2>

                <form className="grid gap-4" onSubmit={moveItem}>
                    
                  
                    <label className="text-gray-700 font-medium">בחר פריט</label>
                    <ItemsToSelcet 
                        username={username} 
                        profileName={profileName} 
                        category={category} 
                        onSelectedOpt={setItemName} 
                    />

                    
                    <div className="bg-gray-100 text-gray-700 p-2 rounded-lg border border-gray-300">
                        <span>קטגוריה נוכחית: </span>
                        <strong>{currentCat}</strong>
                    </div>

                  
                    <label className="text-gray-700 font-medium">בחר קטגוריה אליה תעביר את הפריט</label>
                    <GetCats 
                        username={username}
                        profileName={profileName}
                        onCategorySelect={handleCategoryChange}
                        select={true}
                        forAccount={false} 
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
                                error ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
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
