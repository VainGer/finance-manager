import { FaCheck, FaEdit, FaPlus } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import AddTransactInReport from "./AddTransactInReport";
import TransactionEditor from "./TransactionEditor";

export default function ExpensesTable({ username, profileName, expenseData, refreshExpenses, showEditBtn, showRelation,
    showAddTransactBtn, onFilteredData, onTransactionUpdate }) {

    const [expenses, setExpenses] = useState([]);
    const [showAddTransact, setShowAddTransact] = useState(false);
    const [choosenCategory, setChoosenCategory] = useState("");
    const [id, setId] = useState("");
    const [price, setPrice] = useState("");
    const [date, setDate] = useState("");
    const [choosenItem, setChoosenItem] = useState("");
    const [showTransactionEditor, SetShowTransactionEditor] = useState(false);

    useEffect(() => {
        if (expenseData && expenseData.length > 0) {
            setExpenses(prevExpenses => {
                const prevDataString = JSON.stringify(prevExpenses);
                const newDataString = JSON.stringify(expenseData);
                if (prevDataString !== newDataString) {
                    console.log("Updating expenses from expenseData:", expenseData);
                    if (onFilteredData) {
                        onFilteredData(expenseData);
                    }
                    return expenseData;
                }
                return prevExpenses;
            });
        }
    }, [expenseData, onFilteredData]);

    async function handleTransactionUpdate() {
        try {
            console.log("Starting transaction update in ExpensesTable...");

            // קודם נעדכן את ההורה
            if (onTransactionUpdate) {
                console.log("Calling parent onTransactionUpdate");
                await onTransactionUpdate();
            }

            // אז נעדכן את הנתונים המקומיים
            const updatedExpenses = await refreshExpenses();
            console.log("Got updated expenses:", updatedExpenses);

            if (updatedExpenses && updatedExpenses.length > 0) {
                console.log("Setting new expenses state");
                setExpenses(updatedExpenses);

                if (onFilteredData) {
                    console.log("Updating filtered data");
                    onFilteredData(updatedExpenses);
                }
            }
        } catch (error) {
            console.error("Error in handleTransactionUpdate:", error);
        }
    }

    function closeEditor() {
        console.log("Closing editor");
        SetShowTransactionEditor(false);
        handleTransactionUpdate();
    }

    function closeAddTransact() {
        console.log("Closing add transaction");
        setShowAddTransact(false);
        handleTransactionUpdate();
    }

    function reformatDate(date) {
        if (!date || typeof date !== 'string') {
            return date; // מחזיר את התאריך כמו שהוא אם הוא לא תקין
        }
        try {
            let year = date.slice(0, 4);
            let month = date.slice(5, 7);
            let day = date.slice(8, 10);
            return day + "/" + month + "/" + year;
        } catch (error) {
            return date; // במקרה של שגיאה, מחזיר את התאריך המקורי
        }
    }

    function formatCurrency(amount) {
        if (!amount || isNaN(amount)) return "₪0.0";
        return new Intl.NumberFormat('he-IL', {
            style: 'currency',
            currency: 'ILS',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(amount);
    }

    return (
        <div className='w-full overflow-x-auto px-2 md:px-4'>
            {expenses.map((category, index) => {
                return (
                    <div key={index} className="mb-6 bg-white rounded-lg shadow-sm p-3 md:p-4">
                        <h3 className="text-lg font-semibold mb-3">קטגוריה: {category.categoryName}</h3>
                        <div className="space-y-4">
                            {category.items.map((item, index) => {
                                const sortedTransactions = item.transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
                                return (
                                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                                        <h5 className="font-medium mb-2">שם בעל העסק: {item.iName}</h5>
                                        <h5 className="font-medium mb-2">הוצאות:</h5>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="px-3 py-2 text-right text-sm font-medium text-gray-700">תאריך</th>
                                                        <th className="px-3 py-2 text-right text-sm font-medium text-gray-700">סכום</th>
                                                        {showEditBtn && <th className="px-3 py-2 text-right text-sm font-medium text-gray-700">עריכה</th>}
                                                        {showRelation && <th className="px-3 py-2 text-right text-sm font-medium text-gray-700">הוצאה שלי</th>}
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {sortedTransactions.map((transactions, index) => (
                                                        <tr key={index}>
                                                            <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">{reformatDate(transactions.date)}</td>
                                                            <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">{formatCurrency(Number(transactions.price))}</td>
                                                            {showEditBtn &&
                                                                <td className="px-3 py-2 text-sm text-gray-700">
                                                                    <motion.button
                                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                        transition={{ duration: 0.2 }}
                                                                        className="p-2 hover:bg-blue-100 rounded-full transition-colors"
                                                                        onClick={(e) => {
                                                                            setId(transactions.id);
                                                                            setChoosenCategory(category.categoryName);
                                                                            setChoosenItem(item.iName);
                                                                            setPrice(transactions.price);
                                                                            setDate(transactions.date);
                                                                            SetShowTransactionEditor(true);
                                                                        }}
                                                                    >
                                                                        <FaEdit className="text-blue-600 hover:text-blue-700" />
                                                                    </motion.button>
                                                                </td>
                                                            }
                                                            {showRelation &&
                                                                <td className="px-3 py-2 text-sm">
                                                                    {transactions.related ?
                                                                        <div className="text-green-500"><FaCheck className="mx-auto" /></div> :
                                                                        <div className="text-red-500"><RxCross2 className="mx-auto" /></div>
                                                                    }
                                                                </td>
                                                            }
                                                        </tr>
                                                    ))}
                                                    {showAddTransactBtn &&
                                                        <tr>
                                                            <td colSpan={showEditBtn ? 3 : 2}>
                                                                <motion.button
                                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    whileHover={{ scale: 1.02 }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                    transition={{ duration: 0.2 }}
                                                                    className="w-full py-2 px-4 text-sm text-gray-600 hover:bg-green-50 transition-all rounded-md flex items-center justify-center gap-2 border border-gray-200 hover:border-green-300"
                                                                    onClick={() => {
                                                                        setShowAddTransact(true);
                                                                        setChoosenCategory(category.categoryName);
                                                                        setChoosenItem(item.iName);
                                                                    }}
                                                                >
                                                                    <span>הוסף עסקה</span>
                                                                    <FaPlus className="text-green-500" />
                                                                </motion.button>
                                                            </td>
                                                        </tr>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
            <AnimatePresence>
                {showAddTransact && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md px-4 z-50"
                    >
                        <div className="md:p-6 rounded-lg shadow-2xl w-full max-w-lg text-center relative mx-4">
                            <AddTransactInReport
                                username={username}
                                profileName={profileName}
                                category={choosenCategory}
                                item={choosenItem}
                                onTransactionUpdate={handleTransactionUpdate}
                                closeAddTransact={closeAddTransact}
                            />
                        </div>
                    </motion.div>
                )}
                {showTransactionEditor && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md px-4 z-50"
                    >
                        <div className="md:p-6 rounded-lg shadow-2xl w-full max-w-lg text-center relative mx-4">
                            <TransactionEditor
                                username={username}
                                profileName={profileName}
                                category={choosenCategory}
                                item={choosenItem}
                                id={id}
                                initialPrice={price}
                                initialDate={date}
                                onTransactionUpdate={handleTransactionUpdate}
                                onClose={closeEditor}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}