import { FaCheck, FaEdit, FaPlus } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";

import AddTransactInReport from "../transactions/AddTransactInReport";

export default function ExpensesTable({ username, profileName, expenses }) {



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
        </div>
    );
}