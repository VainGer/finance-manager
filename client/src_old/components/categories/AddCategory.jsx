import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTag, FaPlus, FaCheck } from 'react-icons/fa';
import { addCategory } from '../../API/category.js';

export default function AddCategory({ username, profileName, refreshExpenses, onClose }) {
    const [category, setCategory] = useState('');
    const [privateC, setPrivate] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    async function addCat(e) {
        e.preventDefault();
        setError(null);

        if (!category.trim()) {
            setError("יש להזין שם קטגוריה.");
            return;
        }

        const result = await addCategory(username, profileName, category, privateC);

        if (result.status === 201) {
            setSuccess(true);
            refreshExpenses();
            setTimeout(() => {
                onClose();
            }, 1500);
        }
        else if (result.status === 400) {
            setError("שם קטגוריה קיים, נסה שם אחר.");
        }
        else if (result.status === 500) {
            console.error(error);
            setError("שגיאה בחיבור לשרת, נסה שוב.");
        }
    }

    return (
        <AnimatePresence>
            {success ? (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex flex-col items-center justify-center gap-4"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center"
                    >
                        <FaCheck className="text-white text-3xl" />
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-lg font-medium text-green-600"
                        data-testid="success"
                    >
                        הקטגוריה נוספה בהצלחה!
                    </motion.p>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <h2 className="text-2xl font-semibold text-blue-600 text-center mb-6">הוספת קטגוריה</h2>

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

                    <form className="grid gap-4 text-center" onSubmit={addCat}>
                        <div className="relative">
                            <FaTag className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                className="w-full p-3 pr-10 border border-gray-300 rounded-lg text-center focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                                placeholder="שם קטגוריה"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                data-testid="category"
                            />
                        </div>

                        <label className="flex items-center justify-center gap-2 text-gray-700">
                            <input
                                type="checkbox"
                                checked={privateC}
                                onChange={(e) => setPrivate(e.target.checked)}
                                className="w-4 h-4 accent-blue-600"
                            />
                            קטגוריה פרטית
                        </label>

                        <div className="flex gap-3 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition flex items-center"
                                type="submit"
                                data-testid="submit"
                            >
                                <FaPlus className="inline-block mr-2" /> הוסף קטגוריה
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-gray-500 text-white font-medium rounded-lg shadow-md hover:bg-gray-600 transition"
                                type="button"
                                onClick={onClose}
                            >
                                ביטול
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
