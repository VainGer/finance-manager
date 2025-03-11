import { useEffect, useState } from "react";
import ExpensesTable from "./ExpensesTable";
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
        <div>
            <div className="grid-cols-2 *:p-2 *:bg-blue-500 *:text-white *:hover:bg-blue-600 *:transition *:rounded-md *:m-2">
                <motion.button
                    transition={{ duration: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='px-4 py-2 bg-gray-200 text-blue-600 rounded-md hover:bg-gray-300 transition' onClick={(e) => {
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
                    className='px-4 py-2 bg-gray-200 text-blue-600 rounded-md hover:bg-gray-300 transition'
                    onClick={(e) => {
                        setShowCategoryBudgetSelect(!showCategoryBudgetSelect);
                        setShowExpenses(() => {
                            if (showExpenses) { return false; }
                        });
                        setShowProfBudgetSelect(false);
                    }}
                >הצג הוצאות לפי קטגוריה</motion.button>
            </div>
            {showProfBudgetSelect && (
                <div className="flex flex-cols w-max mx-auto my-4 **:w-max **:mx-14 **:text-center">
                    <select className="border-1 rounded-xl"
                        onChange={(e) => {
                            const option = e.target.selectedOptions[0];
                            setStartDate(option.dataset.start);
                            setEndDate(option.dataset.end);
                        }}>
                        <option selected disabled>בחר תקופת תקציב</option>
                        {profBudgets.map((budget, index) => {
                            return (
                                <option data-start={budget.startDate} data-end={budget.endDate}
                                    key={index}>{reformatDate(budget.startDate) + " - " + reformatDate(budget.endDate)}</option>
                            );
                        })}
                    </select>
                    <motion.button
                        transition={{ duration: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='px-4 py-2 bg-green-400 text-white rounded-md hover:bg-green-500 transition
                        disabled:bg-gray-200 disabled:text-gray-400'
                        onClick={async (e) => {
                            await removeBlankAndSetExpenses(true);
                            setShowExpenses(true);
                            setShowCategoryBudgetSelect(false);
                            setBudgetTarget(() => {
                                let target = profBudgets.find(budget => {
                                    return budget.startDate === startDate && budget.endDate === endDate;
                                })
                                return target.amount;
                            })
                            setSumKey(() => sumKey + 1);
                        }}
                        disabled={!startDate || !endDate}
                    >הצג</motion.button>
                </div>
            )
            }
            {
                showCategoryBudgetSelect && (
                    <div className="flex flex-cols w-max mx-auto my-4 **:w-max **:mx-6 **:text-center">
                        <select className="border-1 rounded-xl"
                            onChange={(e) => {
                                const option = e.target.selectedOptions[0];
                                setStartDate(option.dataset.start);
                                setEndDate(option.dataset.end);
                                setCategory(option.dataset.category);
                            }}>
                            <option
                                selected disabled>בחר תקופת תקציב</option>
                            {catBudgets.map((budget, index) => {
                                return (
                                    <option
                                        data-start={budget.startDate}
                                        data-end={budget.endDate}
                                        data-category={budget.category}
                                        key={index}>{budget.category + " - "
                                            + reformatDate(budget.startDate) + " - " + reformatDate(budget.endDate)}</option>
                                );
                            })}
                        </select>
                        <motion.button
                            transition={{ duration: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='px-4 py-2 bg-green-400 text-white rounded-md hover:bg-green-500 transition
                        disabled:bg-gray-200 disabled:text-gray-400'
                            onClick={async (e) => {
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
                                setSumKey(() => sumKey + 1);
                            }}
                            disabled={!startDate || !endDate || !choosenCategory}
                        >הצג</motion.button>
                    </div>
                )
            }
            {showExpenses && (
                expenses.length > 0 ? (<div key={`summary-${sumKey}}`} className="md:grid md:grid-cols-3">
                    <div className="md:col-span-2">
                        <ExpensesTable username={username}
                            profileName={profileName}
                            expenseData={expenses}
                            refreshExpenses={removeBlankAndSetExpenses}
                            showEditBtn={false}
                            showRelation={false}
                        />
                    </div>
                    <table className="w-2/3 **:h-12 **:border text-center h-1/3">
                        <thead className="">
                            <tr>
                                <th className="bg-gray-200">יעד</th>
                                <td className="">{budgetTarget}</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th className="bg-gray-200">סה"כ הוצאות</th>
                                <td className="">{transactionsSum}</td>
                            </tr>
                            <tr >
                                <th className="bg-gray-200">יתרה</th>
                                <td className={`font-bold ${budgetTarget - transactionsSum < 0 ? "text-red-600" : "text-green-600"}`}>
                                    {budgetTarget - transactionsSum}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
                )
                    : (<h3>לא נמצאו הוצאות</h3>)
            )}
        </div>
    );
}