import { useEffect, useState } from "react";
import ExpensesTable from "./ExpensesTable";

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


    return (
        <div>
            <div className="grid-cols-2 *:p-2 *:bg-blue-500 *:text-white *:hover:bg-blue-600 *:transition *:rounded-md *:m-2">
                <button onClick={(e) => {
                    setShowProfBudgetSelect(!showProfBudgetSelect);
                    setShowExpenses(() => {
                        if (showExpenses) { return false; }
                    });
                    setShowCategoryBudgetSelect(false);
                }}
                >הצג הוצאות לפי תאריך</button>
                <button onClick={(e) => {
                    setShowCategoryBudgetSelect(!showCategoryBudgetSelect);
                    setShowExpenses(() => {
                        if (showExpenses) { return false; }
                    });
                    setShowProfBudgetSelect(false);
                }}
                >הצג הוצאות לפי קטגוריה</button>
            </div>
            {showProfBudgetSelect && (
                <div className="grid grid-cols-2 w-max mx-auto my-4">
                    <select onChange={(e) => {
                        const option = e.target.selectedOptions[0];
                        setStartDate(option.dataset.start);
                        setEndDate(option.dataset.end);
                    }}>
                        <option selected disabled>בחר תקופת תקציב</option>
                        {profBudgets.map((budget, index) => {
                            return (
                                <option data-start={budget.startDate} data-end={budget.endDate}
                                    key={index}>{budget.startDate + " - " + budget.endDate}</option>
                            );
                        })}
                    </select>
                    <button onClick={async (e) => {
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
                    >הצג</button>
                </div>
            )
            }
            {
                showCategoryBudgetSelect && (
                    <div className="grid grid-cols-2 w-max mx-auto my-4">
                        <select onChange={(e) => {
                            const option = e.target.selectedOptions[0];
                            setStartDate(option.dataset.start);
                            setEndDate(option.dataset.end);
                            setCategory(option.dataset.category);
                        }}>
                            <option selected disabled>בחר תקופת תקציב</option>
                            {catBudgets.map((budget, index) => {
                                return (
                                    <option
                                        data-start={budget.startDate}
                                        data-end={budget.endDate}
                                        data-category={budget.category}
                                        key={index}>{budget.category + " - "
                                            + budget.startDate + " - " + budget.endDate}</option>
                                );
                            })}
                        </select>
                        <button onClick={async (e) => {
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
                        >הצג</button>
                    </div>
                )
            }
            {showExpenses && (
                expenses.length > 0 ? (<div key={`summary-${sumKey}}`} className="grid grid-cols-2">
                    <div>
                        <h3>יעד: {budgetTarget}</h3>
                        <h3>סה"כ הוצאות: {transactionsSum}</h3>
                        <h3>נותר לשימוש: {budgetTarget - transactionsSum}</h3>
                    </div>
                    <ExpensesTable username={username}
                        profileName={profileName}
                        expenseData={expenses}
                        refreshExpenses={removeBlankAndSetExpenses}
                        showEditBtn={false}
                        showRelation={false}
                    />
                </div>
                )
                    : (<h3>לא נמצאו הוצאות</h3>)
            )}
        </div>
    );
}