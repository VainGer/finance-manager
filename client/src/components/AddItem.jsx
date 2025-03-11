import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AddItem({ username, profileName, category, refreshExpenses, showConfirm }) {
    const [item, setItem] = useState('');

    useEffect(() => {
        console.log(item);
    }, [item]);

    async function addItem(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/profile/add_item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, category, item })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(`Item ${item} added successfully to category ${category}`);
                showConfirm(false);
                refreshExpenses();
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
                <h2 className="text-xl font-bold text-blue-700 mb-4">הוסף פריט לקטגוריה: {category}</h2>

                <form onSubmit={addItem} className="grid gap-4">
                    <input 
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center" 
                        type="text" 
                        placeholder="הזן שם פריט" 
                        onChange={(e) => setItem(e.target.value)} 
                        required 
                    />
                    
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
                            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            הוסף פריט
                        </motion.button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}
