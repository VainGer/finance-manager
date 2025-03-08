import { useState, useEffect } from "react";
import AddTransactInReport from "./AddTransactInReport";
import TransactionEditor from "./TransactionEditor";

export default function ProfileExpenses({ username, profileName, refreshExpenses }) {
    const [accExpenses, setAccExpenses] = useState([]);
    const [showAddTransact, setShowAddTransact] = useState(false);
    const [editTransaction, setEditTransaction] = useState(null);
    const [choosenCategory, setChoosenCategory] = useState("");
    const [choosenItem, setChoosenItem] = useState("");
    const [id, setId] = useState("");
    const [price, setPrice] = useState("");
    const [date, setDate] = useState("");
    const [showTransactionEditor, SetShowTransactionEditor] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showFilterDates, setShowFilterDates] = useState(false);

    function closeEditor() {
        SetShowTransactionEditor(false);
    }

    function closeAddTransact() {
        setShowAddTransact(false);
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


    async function filterDates(e) {
        e.preventDefault();
        let tmpExpenses = await getProfExpenses();
        let res = [];
        tmpExpenses.forEach(cat => {
            res.push({ categoryName: cat.categoryName, items: [] });
            cat.items.forEach(i => {
                let category = res.find(c => c.categoryName === cat.categoryName);
                category.items.push({ iName: i.iName, transactions: [] });
                i.transactions.forEach(t => {
                    let item = category.items.find(it => it.iName === i.iName);
                    let transactionDate = new Date(t.date);
                    if (transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate)) {
                        item.transactions.push(t);
                    }
                });
            });
        });
        setShowFilterDates(false);
        setAccExpenses(res);
    }

    async function resetFilter() {
        refreshExpenses();
        let tmpTransactions = await getProfExpenses();
        console.log(tmpTransactions)
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
                setAccExpenses(expnses);
            }
        }
        fetchExpenses();
    }, [username, profileName]);


    async function refreshExpenses() {
        const updatedExpenses = await getProfExpenses();
        setAccExpenses(updatedExpenses);
    }


    useEffect(() => {
        refreshExpenses();
    }, [username, profileName]);

    return (
        <div className="w-max m-auto">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition mb-4"
                onClick={(e) => { setShowFilterDates(!showFilterDates); resetFilter(); }}>סינון לפי תאריך</button>
            {showFilterDates &&
                <form className="grid fixed inset-0 w-full h-full bg-black/50 items-center justify-center"
                    onSubmit={(e) => { filterDates(e) }}>
                    <div className="grid grid-cols-2 *:border-1 bg-white border-6 border-white rounded-md">
                        <label>בחר תאריך התחלה:</label>
                        <input type="date" defaultValue={startDate} onChange={(e) => { setStartDate(e.target.value); }}></input>
                        <label>בחר תאריך סיום:</label>
                        <input type="date" defaultValue={endDate} onChange={(e) => { setEndDate(e.target.value); }}></input>
                        <input type="button" value="אפס סינון" onClick={resetFilter} />
                        <input type="submit" value="חפש" />
                        <input className="col-span-2"
                            type="button" value="סגור" onClick={(e) => { setShowFilterDates(false); }} />
                    </div>
                </form>
            }
            {accExpenses.map((category, index) => {
                return (
                    <div key={index}>
                        <h3>קטגוריה: {category.categoryName}</h3>
                        <h4>בעלי עסק:</h4>
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
                                                    const isEditing = editTransaction === transactions.id;
                                                    return (
                                                        < >
                                                            <tr key={index} className="border-1 *:border-1">
                                                                <td className="border-1">{transactions.date}</td>
                                                                <td className="border-1">{transactions.price}</td>
                                                                <td>
                                                                    <button className="hover:bg-red-300 hover:cursor-pointer"
                                                                        data-cat={category.categoryName}
                                                                        data-item={item.iName}
                                                                        data-id={transactions.id}
                                                                        data-currentprice={transactions.price}
                                                                        data-currentdate={transactions.date}
                                                                        onClick={(e) => {
                                                                            const button = e.currentTarget;
                                                                            setId(button.dataset.id);
                                                                            setChoosenCategory(button.dataset.cat);
                                                                            setChoosenItem(button.dataset.item);
                                                                            setPrice(button.dataset.currentprice);
                                                                            setDate(button.dataset.currentdate);
                                                                            SetShowTransactionEditor(true);
                                                                        }}>
                                                                        <img src="./src/assets/images/edit.svg" alt="edit icon" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            {isEditing && (
                                                                <tr>
                                                                    <td colSpan={3}>
                                                                        <TransactionEditor
                                                                            username={username}
                                                                            profileName={profileName}
                                                                            category={choosenCategory}
                                                                            item={choosenItem}
                                                                            id={id}
                                                                            onTransactionUpdate={refreshExpenses}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </>
                                                    );
                                                })}
                                                <tr className="border-1 *:border-1">
                                                    <td colSpan={3}>
                                                        <button data-cat={category.categoryName} data-item={item.iName} onClick={(e) => {
                                                            setShowAddTransact(!showAddTransact);
                                                            setChoosenCategory(e.target.dataset.cat);
                                                            setChoosenItem(e.target.dataset.item);
                                                        }}>
                                                            הוספת עסקה
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        {showAddTransact && <AddTransactInReport username={username} profileName={profileName}
                                            category={choosenCategory} item={choosenItem} onTransactionUpdate={refreshExpenses} closeAddTransact={closeAddTransact} />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
            {
                showTransactionEditor &&
                <TransactionEditor
                    username={username}
                    profileName={profileName}
                    category={choosenCategory}
                    item={choosenItem}
                    id={id}
                    currentPrice={price}
                    currentDate={date}
                    onTransactionUpdate={refreshExpenses}
                    closeEditor={closeEditor}
                />
            }
        </div >
    );
}