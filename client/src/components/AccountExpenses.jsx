import { useState, useEffect } from "react";
import ExpensesTable from "./ExpensesTable";
import GetCats from "./GetCats";

export default function AccountExpenses({ username, profileName }) {
    const [accExpenses, setAccExpenses] = useState([]);
    const [choosenCategory, setChoosenCategory] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showFilterDates, setShowFilterDates] = useState(false);
    const [showFilterCats, setShowFilterCats] = useState(false);
    const [showFilterDatesBtn, setShowFilterDatesBtn] = useState(false);

    async function getAccExpenses() {
        try {
            let response = await fetch('http://localhost:5500/api/profile/acc_expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName })
            });
            let data = await response.json();
            if (response.ok) {
                return data.expenses;
            }
            else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function getAccExpensesByDate() {
        try {
            let response = await fetch('http://localhost:5500/api/profile/get_cats_dates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, startDate, endDate, forAccount: true })
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
                body: JSON.stringify({ username, profileName, choosenCategory, forAccount: true })
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

    async function resetFilter() {
        setExpenses();
        let tmpTransactions = await getAccExpenses();
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
    async function setExpenses() {
        const updatedExpenses = await getAccExpenses();
        setAccExpenses(updatedExpenses);
    }

    function onCategorySelect(category) {
        setChoosenCategory(category);
    }

    async function setAccExpensesByDate() {
        let tmpTransactions = await getAccExpensesByDate();
        setAccExpenses(tmpTransactions);
    }

    useEffect(() => {
        async function fetchExpenses() {
            await setExpenses()
        }
        fetchExpenses();
    }, [username, profileName]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
            <h2 className="text-2xl font-semibold text-blue-600 text-center mb-4">הוצאות חשבון</h2>

            {!showFilterDatesBtn &&
                <div className="grid grid-cols-3 gap-4 justify-center mb-6">
                    <button className="w-48 px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition"
                        onClick={(e) => { setShowFilterDates(!showFilterDates); resetFilter(); }}>
                        סינון לפי תאריך
                    </button>
                    <button className="w-48 px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition"
                        onClick={(e) => { setShowFilterCats(!showFilterCats); }}>
                        סינון לפי קטגוריה
                    </button>
                    <button className="w-48 px-6 py-3 bg-gray-500 text-white font-medium rounded-lg shadow-md hover:bg-gray-600 transition"
                        onClick={async (e) => { await setExpenses() }}>
                        בטל סינון
                    </button>
                </div>
            }

            {showFilterCats &&
                <div className="mt-4 mb-6 text-center">
                    <GetCats username={username} profileName={profileName}
                        setExpenses={setExpenses} select={true} 
                        onCategorySelect={onCategorySelect} forAccount={true} />
                    <button className="mt-4 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                        onClick={async (e) => { setAccExpenses(await getOneCategory()) }}>
                        חפש
                    </button>
                </div>
            }

            {showFilterDates &&
                <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black/50">
                    <form className="grid grid-cols-2 gap-4 bg-white p-6 border-2 border-gray-300 shadow-xl rounded-lg w-max">
                        <label className="text-lg font-semibold">בחר תאריך התחלה:</label>
                        <input type="date" className="p-2 border rounded-md text-center" />

                        <label className="text-lg font-semibold">בחר תאריך סיום:</label>
                        <input type="date" className="p-2 border rounded-md text-center" />

                        <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                            onClick={resetFilter}>
                            אפס סינון
                        </button>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                            onClick={async (e) => { await setAccExpensesByDate(username, profileName, startDate, endDate); setShowFilterDates(false); }}>
                            חפש
                        </button>
                        <button className="col-span-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                            onClick={(e) => { setShowFilterDates(false); }}>
                            סגור
                        </button>
                    </form>
                </div>
            }

            <div className="mt-4">
                <ExpensesTable username={username}
                    profileName={profileName}
                    expenseData={accExpenses}
                    setExpenses={getAccExpenses}
                    showEditBtn={false}
                    showRelation={true}
                    showAddTransactBtn={false} />
            </div>
        </div>
    )
}
