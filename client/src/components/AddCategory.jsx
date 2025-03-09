import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTag, FaPlus } from 'react-icons/fa';

export default function AddCategory({ username, profileName, refreshExpenses }) {
    const [category, setCategory] = useState('');
    const [privateC, setPrivate] = useState(false);
    const [error, setError] = useState(null);

    async function addCat(e) {
        e.preventDefault();
        setError(null);

        if (!category.trim()) {
            setError("יש להזין שם קטגוריה.");
            return;
        }

        try {
            let response = await fetch('http://localhost:5500/api/profile/add_cat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, profileName, category, privacy: privateC })
            });

            if (response.ok) {
                refreshExpenses();
                setCategory('');
                setPrivate(false);
            } else {
                setError("שגיאה בהוספת הקטגוריה.");
            }
        } catch (error) {
            console.log(error);
            setError("שגיאה בחיבור לשרת, נסה שוב.");
        }
    }

    return (
        <div className="w-full max-w-md mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-blue-600 text-center mb-4">הוספת קטגוריה</h2>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <form className="grid gap-4 text-center" onSubmit={addCat}>

                {/* שדה שם קטגוריה */}
                <div className="relative">
                    <FaTag className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        className="w-full p-3 pr-10 border border-gray-300 rounded-md text-center focus:border-blue-500 focus:ring focus:ring-blue-200"
                        placeholder="שם קטגוריה"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>

                {/* צ'קבוקס קטגוריה פרטית */}
                <label className="flex items-center justify-center gap-2 text-gray-700">
                    <input
                        type="checkbox"
                        checked={privateC}
                        onChange={(e) => setPrivate(e.target.checked)}
                        className="w-4 h-4 accent-blue-600"
                    />
                    קטגוריה פרטית
                </label>

                {/* כפתור הוספת קטגוריה */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition"
                    type="submit"
                >
                    <FaPlus className="inline-block mr-2" /> הוסף קטגוריה
                </motion.button>
            </form>
        </div>
    );
}
