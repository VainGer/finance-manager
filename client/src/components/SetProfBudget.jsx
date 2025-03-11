import { useState } from 'react';
import { FaCalendarAlt, FaDollarSign, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function SetProfBudget({ username, profileName, showConfirm, refreshExpenses }) {
    const [amount, setAmount] = useState('');
    const [startDay, setStartDay] = useState(new Date().toISOString().slice(0, 10));
    const [endDay, setEndDay] = useState(new Date().toISOString().slice(0, 10));

    async function setBudget(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/profile/set_prof_budget', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, profileName, amount, startDay, endDay })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(data.message);
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-xl shadow-2xl w-96 relative"
            >
                <button 
                    onClick={() => showConfirm(false)} 
                    className="absolute top-4 left-4 text-gray-500 hover:text-red-500 transition-all"
                >
                    <FaTimes size={18} />
                </button>

                <h2 className="text-xl font-semibold text-blue-600 text-center mb-4">הגדרת תקציב פרופיל</h2>

                <form onSubmit={setBudget} className="grid gap-4">
                    <div className="relative">
                        <FaDollarSign className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="number"
                            placeholder="סכום תקציב"
                            className="w-full p-3 pl-10 border rounded-lg text-right focus:border-blue-500 focus:ring focus:ring-blue-200"
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="date"
                            className="w-full p-3 pl-10 border rounded-lg text-right focus:border-blue-500 focus:ring focus:ring-blue-200"
                            defaultValue={startDay}
                            onChange={(e) => setStartDay(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="date"
                            className="w-full p-3 pl-10 border rounded-lg text-right focus:border-blue-500 focus:ring focus:ring-blue-200"
                            defaultValue={endDay}
                            onChange={(e) => setEndDay(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
                        >
                            שמור תקציב
                        </button>
                        <button
                            type="button"
                            onClick={() => showConfirm(false)}
                            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-all"
                        >
                            ביטול
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
