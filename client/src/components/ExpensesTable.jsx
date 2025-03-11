import { FaCheck, FaEdit, FaPlus } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useState, useEffect } from 'react';
import AddTransactInReport from "./AddTransactInReport";
import TransactionEditor from "./TransactionEditor";
export default function ExpensesTable({ username, profileName, expenseData, refreshExpenses, showEditBtn, showRelation, showAddTransactBtn }) {
    const [expenses, setExpenses] = useState([]);
    const [showAddTransact, setShowAddTransact] = useState(false);
    const [choosenCategory, setChoosenCategory] = useState("");
    const [id, setId] = useState("");
    const [price, setPrice] = useState("");
    const [date, setDate] = useState("");
    const [choosenItem, setChoosenItem] = useState("");
    const [showTransactionEditor, SetShowTransactionEditor] = useState(false);

    useEffect(() => {
        setExpenses(expenseData);
    }, [expenseData]);

    function closeEditor() {
        SetShowTransactionEditor(false);
    }

    function closeAddTransact() {
        setShowAddTransact(false);
    }

    function reformatDate(date) {
        let year = date.slice(0, 4);
        let month = date.slice(5, 7);
        let day = date.slice(8, 10);
        return day + "/" + month + "/" + year;
    }

    return (
        <div className=' grid max-h-110 overflow-y-auto border-1 rounded-md w-1/2 *:m-2 mx-auto'>
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
                                                    {showEditBtn && <th>עריכה</th>}
                                                    {showRelation && <th>הוצאה שלי</th>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sortedTransactions.map((transactions, index) => {
                                                    return (
                                                        < >
                                                            <tr key={index} className="border-1 *:border-1">
                                                                <td className="border-1">{reformatDate(transactions.date)}</td>
                                                                <td className="border-1">{transactions.price}</td>
                                                                {showEditBtn &&
                                                                    <td className="hover:cursor-pointer"
                                                                        onClick={(e) => {
                                                                            const button = e.currentTarget;
                                                                            setId(button.dataset.id);
                                                                            setChoosenCategory(button.dataset.cat);
                                                                            setChoosenItem(button.dataset.item);
                                                                            setPrice(button.dataset.currentprice);
                                                                            setDate(button.dataset.currentdate);
                                                                            SetShowTransactionEditor(true);
                                                                        }}
                                                                    >
                                                                        <FaEdit className="mx-auto"
                                                                            data-cat={category.categoryName}
                                                                            data-item={item.iName}
                                                                            data-id={transactions.id}
                                                                            data-currentprice={transactions.price}
                                                                            data-currentdate={transactions.date}>
                                                                            <img src="./src/assets/images/edit.svg" alt="edit icon" />
                                                                        </FaEdit>
                                                                    </td>
                                                                }
                                                                {showRelation && <td>{transactions.related ? <div className="text-green-500 *:mx-auto"><FaCheck /> </div> : <div className="text-red-500 *:mx-auto"> <RxCross2 /></div>}</td>}
                                                            </tr >
                                                            {showTransactionEditor && (
                                                                <tr>
                                                                    <td colSpan={3}>
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
                                                                    </td>
                                                                </tr>
                                                            )
                                                            }
                                                        </>
                                                    );
                                                })}
                                                <tr className="border-1 *:border-1">
                                                    {showAddTransactBtn &&
                                                        <td colSpan={3}>
                                                            <button className="hover:bg-green-200 w-full"
                                                                data-cat={category.categoryName}
                                                                data-item={item.iName}
                                                                onClick={(e) => {
                                                                    setShowAddTransact(true);
                                                                    setChoosenCategory(e.target.dataset.cat);
                                                                    setChoosenItem(e.target.dataset.item);
                                                                }}>
                                                                <span className="mx-auto w-max flex flex-row items-center *:mx-4">
                                                                    הוסף עסקה
                                                                    <b className="text-green-500"><FaPlus /></b></span>
                                                            </button>
                                                        </td>
                                                    }
                                                </tr>
                                            </tbody>
                                        </table>
                                        {
                                            showAddTransact &&
                                            <AddTransactInReport
                                                username={username}
                                                profileName={profileName}
                                                category={choosenCategory}
                                                item={choosenItem}
                                                onTransactionUpdate={refreshExpenses}
                                                closeAddTransact={closeAddTransact} />
                                        }
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })
            }
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
            )
            }
        </div>
    );
}