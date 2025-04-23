import { useEffect, useState } from "react";
// import ExpensesTable from "./ExpensesTable";
import { motion } from 'framer-motion';


export default function ExpensesByBudget({ username, profileName }) {
    const [profBudgets, setProfBudgets] = useState([]);
    const [catBudgets, setCatBudgets] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [choosenCategory, setCategory] = useState("");
    const [expenses, setExpenses] = useState([]);
    const [showProfBudgetSelect, setShowProfBudgetSelect] = useState(false);
    const [showExpenses, setShowExpenses] = useState(false);
    const [showCategoryBudgetSelect, setShowCategoryBudgetSelect] = useState(false);
    const [budgetTarget, setBudgetTarget] = useState(0);
    const [transactionsSum, setTransactionsSum] = useState(0);
    const [sumKey, setSumKey] = useState(0);

    function formatCurrency(amount) {
        if (!amount || isNaN(amount)) return "₪0.00";
        return new Intl.NumberFormat('he-IL', {
            style: 'currency',
            currency: 'ILS',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    async function getProfBudgetsDates() {
        try {
            let response = await fetch('http://localhost:5500/api/profile/get_prof_budget', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName })
            });
            let data = await response.json();
            if (response.ok) {
                return data.budget;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function getCatBudgets() {
        try {
            let response = await fetch('http://localhost:5500/api/profile/get_cat_budget', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName })
            });
            let data = await response.json();
            if (response.ok) {
                return data.budget;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }


    async function getProfileCategoriesByDate() {
        try {
            let response = await fetch('http://localhost:5500/api/profile/get_cats_dates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, startDate, endDate })
            });
            let data = await response.json();
            if (response.ok) {
                return data.categories;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function getCategoryByDate() {
        try {
            let response = await fetch('http://localhost:5500/api/profile/get_cat_date', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, choosenCategory, startDate, endDate })
            });
            let data = await response.json();
            if (response.ok) {
                return data.category;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }


    async function fetchBudgets() {
        const profBudgets = await getProfBudgetsDates();
        const catBudgets = await getCatBudgets();
        if (profBudgets) {
            setProfBudgets(profBudgets);
        }
        if (catBudgets) {
            setCatBudgets(catBudgets);
        }
    }

    async function removeBlankAndSetExpenses(byDate) {
        let expenses
        if (byDate) {
            expenses = await getProfileCategoriesByDate();
        }
        else {
            expenses = await getCategoryByDate();
        }
        let tmp = [];
        expenses.forEach(expense => {
            expense.items.forEach(item => {
                if (item.transactions.length > 0) {
                    tmp.push({
                        categoryName: expense.categoryName,
                        items: [{
                            iName: item.iName,
                            transactions: item.transactions
                        }]
                    });
                }
            })
        });
        setExpenses(tmp);
    }

    useEffect(() => {
        fetchBudgets();
    }, [username, profileName]);

    useEffect(() => {
        let sum = 0;
        expenses.forEach(expense => {
            expense.items.forEach(item => {
                item.transactions.forEach(transaction => {
                    sum += parseFloat(transaction.price);
                });
            });
        });
        setTransactionsSum(sum);
    }, [expenses]);



    function reformatDate(date) {
        let year = date.slice(0, 4);
        let month = date.slice(5, 7);
        let day = date.slice(8, 10);
        return day + "/" + month + "/" + year;
    }

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 max-w-2xl mx-auto">
                <motion.button
                    transition={{ duration: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm md:text-base font-medium"
                    onClick={() => {
                        setShowProfBudgetSelect(!showProfBudgetSelect);
                        setShowExpenses(() => {
                            if (showExpenses) { return false; }
                        });
                        setShowCategoryBudgetSelect(false);
                    }}
                >הצג הוצאות לפי תאריך</motion.button>
                <motion.button
                    transition={{ duration: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm md:text-base font-medium"
                    onClick={() => {
                        setShowCategoryBudgetSelect(!showCategoryBudgetSelect);
                        setShowExpenses(() => {
                            if (showExpenses) { return false; }
                        });
                        setShowProfBudgetSelect(false);
                    }}
                >הצג הוצאות לפי קטגוריה</motion.button>
            </div>

            {showProfBudgetSelect && (
                <div className="flex flex-col items-center justify-center gap-4 my-6 max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-sm">
                    <select 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                            const option = e.target.selectedOptions[0];
                            setStartDate(option.dataset.start);
                            setEndDate(option.dataset.end);
                        }}
                    >
                        <option selected disabled>בחר תקופת תקציב</option>
                        {profBudgets.map((budget, index) => (
                            <option 
                                key={index}
                                data-start={budget.startDate}
                                data-end={budget.endDate}
                            >
                                {reformatDate(budget.startDate) + " - " + reformatDate(budget.endDate)}
                            </option>
                        ))}
                    </select>
                    <motion.button
                        transition={{ duration: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed text-sm md:text-base font-medium"
                        onClick={async () => {
                            if (showExpenses) {
                                setShowExpenses(false);
                            } else {
                                await removeBlankAndSetExpenses(true);
                                setShowExpenses(true);
                                setShowCategoryBudgetSelect(false);
                                setBudgetTarget(() => {
                                    let target = profBudgets.find(budget => {
                                        return budget.startDate === startDate && budget.endDate === endDate;
                                    })
                                    return target.amount;
                                })
                                setSumKey(prev => prev + 1);
                            }
                        }}
                        disabled={!startDate || !endDate}
                    >
                        {showExpenses ? 'הסתר' : 'הצג'}
                    </motion.button>
                </div>
            )}

            {showCategoryBudgetSelect && (
                <div className="flex flex-col items-center justify-center gap-4 my-6 max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-sm">
                    <select 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                            const option = e.target.selectedOptions[0];
                            setStartDate(option.dataset.start);
                            setEndDate(option.dataset.end);
                            setCategory(option.dataset.category);
                        }}
                    >
                        <option selected disabled>בחר תקופת תקציב</option>
                        {catBudgets.map((budget, index) => (
                            <option
                                key={index}
                                data-start={budget.startDate}
                                data-end={budget.endDate}
                                data-category={budget.category}
                            >
                                {budget.category + " - " + reformatDate(budget.startDate) + " - " + reformatDate(budget.endDate)}
                            </option>
                        ))}
                    </select>
                    <motion.button
                        transition={{ duration: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed text-sm md:text-base font-medium"
                        onClick={async () => {
                            if (showExpenses) {
                                setShowExpenses(false);
                            } else {
                                await removeBlankAndSetExpenses(false);
                                setShowExpenses(true);
                                setShowProfBudgetSelect(false);
                                setBudgetTarget(() => {
                                    let target = catBudgets.find(budget => {
                                        return budget.startDate === startDate
                                            && budget.endDate === endDate
                                            && budget.category === choosenCategory
                                    })
                                    return Number(target.amount);
                                })
                                setSumKey(prev => prev + 1);
                            }
                        }}
                        disabled={!startDate || !endDate || !choosenCategory}
                    >
                        {showExpenses ? 'הסתר' : 'הצג'}
                    </motion.button>
                </div>
            )}

            {showExpenses && (
                expenses.length > 0 ? (
                    <div key={`summary-${sumKey}`} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            {/* <ExpensesTable
                                username={username}
                                profileName={profileName}
                                expenseData={expenses}
                                refreshExpenses={removeBlankAndSetExpenses}
                                showEditBtn={false}
                                showRelation={false}
                            /> */}
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="bg-gray-100 px-4 py-3 text-right font-medium text-gray-700">יעד</th>
                                        <td className="px-4 py-3 text-right">{formatCurrency(budgetTarget)}</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-t">
                                        <th className="bg-gray-100 px-4 py-3 text-right font-medium text-gray-700">סה"כ הוצאות</th>
                                        <td className="px-4 py-3 text-right">{formatCurrency(transactionsSum)}</td>
                                    </tr>
                                    <tr className="border-t">
                                        <th className="bg-gray-100 px-4 py-3 text-right font-medium text-gray-700">יתרה</th>
                                        <td className={`px-4 py-3 text-right font-bold ${budgetTarget - transactionsSum < 0 ? "text-red-600" : "text-green-600"}`}>
                                            {formatCurrency(budgetTarget - transactionsSum)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-600 mt-8">
                        <h3 className="text-lg font-medium">לא נמצאו הוצאות</h3>
                    </div>
                )
            )}
        </div>
    );
}