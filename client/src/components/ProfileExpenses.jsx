import { useState, useEffect } from "react";
import AddTransactInReport from "./AddTransactInReport";
import TransactionEditor from "./TransactionEditor";
export default function ProfileExpenses({ username, profileName }) {

    const [accExpenses, setAccExpenses] = useState([]);
    const [showAddTransact, setShowAddTransact] = useState(false);
    const [choosenCategory, setChoosenCategory] = useState("");
    const [choosenItem, setChoosenItem] = useState("");
    const [id, setId] = useState("");

    async function getAccExpenses() {
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
                return data.expenses
            }
            else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function fetchExpenses() {
            const expnses = await getAccExpenses();
            if (expnses) {
                setAccExpenses(expnses);
            }
        }
        fetchExpenses();
    }, [username, profileName]);


    return (
        <div className="w-max m-auto">
            {accExpenses.map((category, index) => {
                return (
                    <div key={index}>
                        <h3>קטגוריה: {category.categoryName}</h3>
                        <h4>בעלי עסק:</h4>
                        <div >
                            {category.items.map((item, index) => {
                                return (<div key={index}>
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
                                            {item.transactions.map((transactions, index) => {
                                                return (
                                                    <tr key={index} className="border-1 *:border-1">
                                                        <td className="border-1">{transactions.date}</td>
                                                        <td className="border-1">{transactions.price}</td>
                                                        <td>
                                                            <button className="hover:bg-red-300 hover:cursor-pointer"
                                                                data-cat={category.categoryName} data-item={item.iName} data-id={transactions.id}
                                                                onClick={(e) => {
                                                                    const button = e.currentTarget;
                                                                    setId(button.dataset.id);
                                                                    setChoosenCategory(button.dataset.cat);
                                                                    setChoosenItem(button.dataset.item);
                                                                    console.log(choosenCategory, choosenItem, id)
                                                                }}>
                                                                <img src="./src/assets/images/edit.svg" alt="edit icon" />
                                                            </button>
                                                        </td>
                                                    </tr>);
                                            })}
                                            <tr className="border-1 *:border-1">
                                                <td colSpan={3}>
                                                    <button data-cat={category.categoryName} data-item={item.iName} onClick={(e) => {
                                                        setShowAddTransact(!showAddTransact);
                                                        setChoosenCategory(e.target.dataset.cat);
                                                        setChoosenItem(e.target.dataset.item);
                                                    }
                                                    }>הוספת עסקה</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    {showAddTransact && <AddTransactInReport username={username} profileName={profileName} category={choosenCategory} item={choosenItem}></AddTransactInReport>}
                                </div>);
                            })}</div>
                    </div>
                )
            })}
            <TransactionEditor username={username} profileName={profileName} category={choosenCategory} item={choosenItem} id={id} />
        </div>
    )
}