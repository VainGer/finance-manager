import { FaCheck, FaEdit, FaPlus } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import AddTransactInReport from "../transactions/AddTransactInReport";

const tableHeaderClass = "px-3 py-2 text-sm font-medium text-gray-700";
const tableCellClass = "px-3 py-2 text-sm text-gray-700 whitespace-nowrap";
const buttonClass = "p-2 hover:bg-blue-100 rounded-full transition-colors";
const addTransactionButtonClass = `w-full py-2 px-4 text-sm text-gray-600 hover:bg-green-50 
transition-all rounded-md flex items-center justify-center gap-2 border border-gray-200 hover:border-green-300`;

export default function ExpensesTable({ username, profileName, expenses, forAccountView, fetchData }) {

    const [showAddTransact, setShowAddTransact] = useState(false);
    const [category, setCategory] = useState('');
    const [business, setBusiness] = useState('');

    const closeAddTransact = () => {
        setShowAddTransact(false);
    }


    return (
        <div className="w-full px-2 md:px-4 text-center">
            {expenses.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-6 bg-white rounded-lg shadow-sm p-3 md:p-4">
                    <h3 className="text-lg font-semibold mb-3">קטגוריה: {category.name}</h3>
                    {category.businesses.map((business, businessIndex) => (
                        <div key={businessIndex} className="bg-gray-50 rounded-lg p-3 mb-4">
                            <h5 className="font-medium mb-2">שם בעל העסק: {business.name}</h5>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className={tableHeaderClass}>תאריך</th>
                                        <th className={tableHeaderClass}>סכום</th>
                                        <th className={tableHeaderClass}>תיאור</th>
                                        <th className={tableHeaderClass}>עריכה</th>
                                        {forAccountView && <th className={tableHeaderClass}>הוצאה שלי</th>}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {business.transactions.map((transaction, transactionIndex) => (
                                        <tr key={transactionIndex}>
                                            <td className={tableCellClass}>{transaction.date}</td>
                                            <td className={tableCellClass}>{transaction.price}</td>
                                            <td className={tableCellClass}>{transaction.description ? transaction.description : '-'}</td>
                                            <td className={tableCellClass}>
                                                <motion.button className={buttonClass}>
                                                    <FaEdit className="text-blue-600 hover:text-blue-700" />
                                                </motion.button>
                                            </td>
                                            {forAccountView &&
                                                <td className="px-3 py-2 text-sm">
                                                    {transaction.related ? (
                                                        <FaCheck className="text-green-500 mx-auto" />
                                                    ) : (
                                                        <RxCross2 className="text-red-500 mx-auto" />
                                                    )}
                                                </td>
                                            }
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan={4}>
                                            <motion.button className={addTransactionButtonClass}
                                                onClick={() => {
                                                    setShowAddTransact(true);
                                                    setCategory(category.name);
                                                    setBusiness(business.name);
                                                }}>
                                                <span>הוסף עסקה</span>
                                                <FaPlus className="text-green-500" />
                                            </motion.button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            ))
            }
            {
                showAddTransact &&
                <AddTransactInReport username={username} profileName={profileName}
                    closeAddTransact={closeAddTransact} fetchData={fetchData}
                    category={category} business={business} />
            }
        </div >
    );
}
