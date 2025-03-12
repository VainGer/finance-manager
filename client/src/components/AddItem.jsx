import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
export default function AddItem({ username, profileName, category, refreshExpenses, showConfirm }) {
    const [item, setItem] = useState('');
    const [error, setError] = useState(null);
    useEffect(() => {
        console.log(item)
    }, [item])
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
                setError('שגיאה בהוספת פריט, נסה שם אחר')
            }
        } catch (error) {
            console.log(error);
            setError('שגיאה בשרת, נסה שוב מאוחר יותר')
        }
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
            <form onSubmit={addItem} className='bg-white p-6 rounded-2xl shadow-2xl border border-blue-600 w-full max-w-md'>
                <h2 className='text-2xl font-bold text-blue-600 mb-4 text-center'>הוסף פריט</h2>
                <input
                    className='w-full p-3 mb-4 border border-gray-300 rounded-md text-center text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-200'
                    type="text"
                    placeholder='הזן שם פריט'
                    onChange={(e) => setItem(e.target.value)}
                    data-testid="itemname"
                />
                <div className='flex justify-between'>
                    <input
                        type="submit"
                        value="הוסף פריט"
                        className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition'
                        data-testid="submit"
                    />
                    <input
                        type="button"
                        value="ביטול"
                        onClick={(e) => showConfirm(false)}
                        className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition'
                    />
                </div>
            </form>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-center mb-4"
                    data-testid="error"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
}