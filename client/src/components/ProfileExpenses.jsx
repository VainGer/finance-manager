import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from "react";
import GetCats from "./GetCats";
import ExpensesTable from "./ExpensesTable";

export default function ProfileExpenses({ username, profileName, showFilterDatesBtn }) {
    const [profExpenses, setProfExpenses] = useState([]);
    const [choosenCategory, setChoosenCategory] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showFilterDates, setShowFilterDates] = useState(false);
    const [showFilterCats, setShowFilterCats] = useState(false);


    function onCategorySelect(category) {
        setChoosenCategory(category);
    }

    async function getProfExpenses() {
        try {
            let response = await fetch('http://localhost:5500/api/profile/profile_expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName })
            });
            let data = await response.json();
            if (response.ok) {
                return data.expenses;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function getProfExpensesByDate() {
        try {
            let response = await fetch('http://localhost:5500/api/profile/get_cats_dates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, startDate, endDate, forAccount: false })
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

    async function getOneCategory() {
        try {
            let response = await fetch('http://localhost:5500/api/profile/get_cat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, choosenCategory, forAccount: false })
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

    async function setProfExpensesByDate() {
        let tmpTransactions = await getProfExpensesByDate();
        setProfExpenses(tmpTransactions);
    }

    async function resetFilter() {
        refreshExpenses();
        let tmpTransactions = await getProfExpenses();
        let minDate = new Date();
        let maxDate = new Date(0);
        tmpTransactions.forEach(cat => {
            cat.items.forEach(i => {
                i.transactions.forEach(t => {
                    let transactionDate = new Date(t.date);
                    if (transactionDate < minDate) minDate = transactionDate;
                    if (transactionDate > maxDate) maxDate = transactionDate;
                });
            });
        });
        setStartDate(minDate.toISOString().slice(0, 10));
        setEndDate(maxDate.toISOString().slice(0, 10));
    }

    useEffect(() => {
        async function fetchExpenses() {
            const expnses = await getProfExpenses();
            if (expnses) {
                setProfExpenses(expnses);
            }
        }
        fetchExpenses();
    }, [username, profileName]);


    async function refreshExpenses() {
        const updatedExpenses = await getProfExpenses();
        setProfExpenses(updatedExpenses);
    }


    useEffect(() => {
        refreshExpenses();
    }, [username, profileName]);


    return (
        <div>
            {!showFilterDatesBtn &&
                <div className="grid grid-cols-3 *:w-max *:place-self-center">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition mb-4"
                        onClick={(e) => { setShowFilterDates(!showFilterDates); resetFilter(); }}>סינון לפי תאריך</button>
                    <button className=" px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition mb-4"
                        onClick={(e) => { setShowFilterCats(!showFilterCats); }}>סינון לפי קטגוריה</button>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition mb-4"
                        onClick={async (e) => { setProfExpenses(await getProfExpenses()); }}>בטל סינון</button>
                </div>
            }
            {
                showFilterCats &&
                <div className="mt-2 mb-4 text-center">
                    <GetCats username={username} profileName={profileName}
                        refreshExpenses={refreshExpenses} select={true} onCategorySelect={onCategorySelect} forAccount={false} />
                    <button
                        onClick={async (e) => { setProfExpenses(await getOneCategory()); }}
                    >חפש</button>
                </div>
            }
            {showFilterDates &&
                <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black/50">
                    <form className="grid grid-cols-2 *:border-1 bg-white border-6 border-white rounded-md w-max h-max">
                        <label>בחר תאריך התחלה:</label>
                        <input key={`start${startDate}`} type="date" defaultValue={startDate} onChange={(e) => { setStartDate(e.target.value); }}></input>
                        <label>בחר תאריך סיום:</label>
                        <input key={`end${endDate}`} type="date" defaultValue={endDate} onChange={(e) => { setEndDate(e.target.value); }}></input>
                        <input type="button" value="אפס סינון" onClick={resetFilter} />
                        <input type="button" value="חפש"
                            onClick={async (e) => { await setProfExpensesByDate(username, profileName, startDate, endDate); setShowFilterDates(false); }} />
                        <input className="col-span-2"
                            type="button" value="סגור" onClick={(e) => { setShowFilterDates(false); }} />
                    </form>
                </div>
            }
            <ExpensesTable username={username}
                profileName={profileName}
                expenseData={profExpenses}
                refreshExpenses={refreshExpenses}
                showRelation={false}
                showEditBtn={true}
                showAddTransactBtn={true} />
        </div>
    );
}