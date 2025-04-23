import { useState } from "react";
import { motion } from "framer-motion";

export default function TransactionEditor({ username, profileName, category, item, id, initialPrice, initialDate, onTransactionUpdate, onClose }) {
    const [price, setPrice] = useState(initialPrice || "");
    const [date, setDate] = useState(initialDate || "");

    async function updateTransaction(e) {
        e.preventDefault();
        
        // אם המחיר ריק או לא תקין, לא נאפשר שליחה
        if (price === "" || price === null || isNaN(Number(price))) {
            return;
        }

        try {
            // עדכון המחיר והתאריך
            let response = await fetch('http://localhost:5500/api/profile/edit_price', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    username, 
                    profileName, 
                    category, 
                    item, 
                    id, 
                    newPrice: Number(price),
                    date: date || initialDate // שימוש בתאריך המקורי אם אין תאריך חדש
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log("Error updating transaction:", errorData.message || "Unknown error");
                return;
            }

            const data = await response.json();
            console.log("Update successful:", data);
            
            // מעדכנים את הטבלה
            await onTransactionUpdate();
            // סוגרים את המודל
            onClose();
        } catch (error) {
            console.log("Error in updateTransaction:", error);
        }
    }

    async function deleteTransaction() {
        try {
            let response = await fetch('http://localhost:5500/api/profile/delete_spend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, category, item, id })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(data.message);
                await onTransactionUpdate();
                onClose();
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-md p-4 z-50">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
            >
                <h3 className="text-lg font-semibold mb-4 text-center">עריכת עסקה</h3>
                <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">קטגוריה:</span> {category}
                    </div>
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">פריט:</span> {item}
                    </div>
                </div>
                <form className="space-y-4" onSubmit={updateTransaction}>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">מחיר:</label>
                        <input
                            type="number"
                            value={price === null ? "" : price}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setPrice(newValue === "" ? "" : Number(newValue));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="הכנס מחיר"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">תאריך:</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col gap-2 mt-6">
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full px-4 py-2 rounded-lg text-white text-sm font-medium transition
                                ${price !== "" && date !== "" 
                                    ? "bg-blue-500 hover:bg-blue-600" 
                                    : "bg-gray-300 cursor-not-allowed"}`}
                            disabled={price === "" || date === ""}
                        >
                            עדכן עסקה
                        </motion.button>
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
                            onClick={deleteTransaction}
                        >
                            מחק עסקה
                        </motion.button>
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                            onClick={onClose}
                        >
                            סגור
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
