import { useState } from "react";
import { motion } from "framer-motion";

import { addTransaction } from "../../API/transactions";

export default function AddTransactInReport(
    { username, profileName, closeAddTransact, category, business, fetchData }) {
    const [price, setPrice] = useState('');
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);

    const inputStyles = "text-center w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
    const labelStyles = "block text-sm font-medium text-gray-700";
    const buttonBaseStyles = "w-full px-4 py-2 rounded-lg text-sm font-medium transition";

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError(null);
        const result = await addTransaction(username, profileName, category, business, price, date, description);
        console.log(result);
        if (result.status != 201) {
            setError(`שגיאה בהוספת עסקה, נסה שוב מאוחר יותר`);
        }

        else {
            fetchData();
            closeAddTransact();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
            >
                <h3 className="text-lg font-semibold mb-4 text-center">הוספת עסקה חדשה</h3>
                <div className="mb-4 text-sm text-gray-600 *:mb-4">
                    <p><span className="font-medium">קטגוריה:</span> {category}</p>
                    <p><span className="font-medium">בעל עסק:</span> {business}</p>
                </div>

                {error && (
                    <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-center" role="alert">
                        {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <label className={labelStyles} htmlFor="price">מחיר:</label>
                    <input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className={inputStyles}
                        placeholder="הכנס מחיר"
                        data-testid="price"
                        aria-describedby="price-description"
                    />

                    <label className={labelStyles} htmlFor="date">תאריך:</label>
                    <input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={inputStyles}
                        aria-describedby="date-description"
                    />

                    <label className={labelStyles} htmlFor="description">תיאור:</label>
                    <input
                        id="description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={inputStyles}
                        placeholder="הכנס תיאור"
                        data-testid="description"
                    />

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`${buttonBaseStyles} ${price && date ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-300 cursor-not-allowed text-white"}`}
                        disabled={!price || !date}
                        data-testid="submit"
                    >
                        הוסף עסקה
                    </motion.button>

                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`${buttonBaseStyles} border border-gray-300 text-gray-700 hover:bg-gray-50`}
                        onClick={closeAddTransact}
                    >
                        סגור
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
