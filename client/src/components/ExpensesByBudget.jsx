import { useEffect, useState } from "react";


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
        console.log(catBudgets);
    }

    useEffect(() => {
        fetchBudgets();
    }, [username, profileName]);


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

    return (
        <div>
            <div className="grid-cols-2 *:p-2 *:bg-blue-500 *:text-white *:hover:bg-blue-600 *:transition *:rounded-md *:m-2">
                <button onClick={(e) => {
                    setShowProfBudgetSelect(!showProfBudgetSelect);
                    setShowExpenses(() => { if (showExpenses) return false; });
                }}
                >הצג הוצאות לפי תאריך</button>
                <button onClick={(e) => {
                    setShowCategoryBudgetSelect(!showCategoryBudgetSelect);
                    setShowExpenses(() => { if (showExpenses) return false; });
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
                    <button onClick={(e) => {
                        removeBlankAndSetExpenses(true);
                        setShowExpenses(true);
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
                        <button onClick={(e) => {
                            removeBlankAndSetExpenses(false);
                            setShowExpenses(true);
                        }}
                        >הצג</button>
                    </div>
                )
            }
            {showExpenses && (
                expenses.length > 0 ? (
                    <div className=' grid max-h-110 overflow-y-auto border-1 rounded-md'>
                        {expenses.map((category, index) => {
                            return (
                                <div key={index}>
                                    <h3>קטגוריה: {category.categoryName}</h3>
                                    <div>
                                        {category.items.map((item, index) => {
                                            // מיון ההוצאות לפי תאריך
                                            const sortedTransactions = item.transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
                                            return (
                                                <div key={index}>
                                                    <h5>שם בעל העסק: {item.iName}</h5>
                                                    <h5>הוצאות:</h5>
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr className="border-1 *:border-1">
                                                                <th>תאריך</th>
                                                                <th>סכום</th>
                                                                <th>עריכה</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {sortedTransactions.map((transactions, index) => {
                                                                return (
                                                                    < >
                                                                        <tr key={index} className="border-1 *:border-1">
                                                                            <td className="border-1">{transactions.date}</td>
                                                                            <td className="border-1">{transactions.price}</td>
                                                                        </tr>
                                                                    </>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (<h3>לא נמצאו הוצאות</h3>)
            )}
        </div>
    );
}