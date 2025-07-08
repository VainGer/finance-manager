import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { addBusiness } from '../../API/business';

export default function AddBusiness({ username, profileName, category, showConfirm }) {
    const [item, setItem] = useState('');
    const [error, setError] = useState(null);


    async function addItem(e) {
        e.preventDefault();

        const result = await addBusiness(username, profileName, category, item);
        if (result.status === 200) {
            console.log(`Item ${item} added successfully to category ${category}`);
            showConfirm(false);
        }
        else if (result.status === 404) {
            console.log(result.message);
            setError('שגיאה בהוספת פריט, נסה שם אחר')
        } else {
            console.log(result.message);
            setError('שגיאה בשרת, נסה שוב מאוחר יותר')
        }
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
            <form onSubmit={addItem} className='bg-white p-6 rounded-2xl shadow-2xl border border-blue-600 w-full max-w-md'>
                <h2 className='text-2xl font-bold text-blue-600 mb-4 text-center'>הוספת בעל עסק</h2>
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
                <input
                    className='w-full p-3 mb-4 border border-gray-300 rounded-md text-center text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-200'
                    type="text"
                    placeholder='הזן שם בעל עסק'
                    onChange={(e) => setItem(e.target.value)}
                    data-testid="business-name"
                />
                <div className='flex justify-between'>
                    <input
                        type="submit"
                        value="הוסף בעל עסק"
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
        </div>
    );
}