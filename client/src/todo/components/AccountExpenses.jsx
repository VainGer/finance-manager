import { useState, useEffect } from "react";
// import ExpensesTable from "./ExpensesTable";
import GetCats from "../../components/categories/GetCategories";
import { PiCornersOutLight } from "react-icons/pi";
import { motion } from 'framer-motion';
export default function AccountExpenses({ username, profileName, onFilteredData, showOnlyFilters, inGraph }) {

    const [accExpenses, setAccExpenses] = useState([]);
    const [choosenCategory, setChoosenCategory] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showFilterDates, setShowFilterDates] = useState(false);
    const [showFilterCats, setShowFilterCats] = useState(false);
    const [showFilterDatesBtn, setShowFilterDatesBtn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
        if (onFilteredData) {
            onFilteredData(updatedExpenses);
        }
    }

    function onCategorySelect(category) {
        setChoosenCategory(category);
    }

    async function setAccExpensesByDate() {
        let tmpTransactions = await getAccExpensesByDate();
        setAccExpenses(tmpTransactions);
        if (onFilteredData) {
            onFilteredData(tmpTransactions);
        }
    }

    useEffect(() => {
        async function fetchExpenses() {
            await setExpenses()
        }
        fetchExpenses();
    }, [username, profileName]);


    return (
        < div >
            {!inGraph && <div>
                {!showFilterDatesBtn &&
                    <div className="grid grid-cols-3 *:w-max *:place-self-center">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition mb-4"
                            onClick={(e) => { setShowFilterDates(!showFilterDates); resetFilter(); }}>סינון לפי תאריך</button>
                        <button className=" px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition mb-4"
                            onClick={(e) => { setShowFilterCats(!showFilterCats); }}>סינון לפי קטגוריה</button>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition mb-4"
                            onClick={async (e) => {
                                const updatedExpenses = await getAccExpenses();
                                setAccExpenses(updatedExpenses);
                                if (onFilteredData) {
                                    onFilteredData(updatedExpenses);
                                }
                            }}>בטל סינון</button>
                    </div>
                }
                {showFilterCats && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 my-6 max-w-2xl mx-auto p-4">
                        <div className="w-full sm:w-2/3">
                            <GetCats
                                username={username}
                                profileName={profileName}
                                setExpenses={setExpenses}
                                select={true}
                                onCategorySelect={onCategorySelect}
                                forAccount={true}
                            />
                        </div>
                        <motion.button
                            className="w-full sm:w-1/3 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:bg-gray-200 disabled:text-gray-400 text-sm md:text-base font-medium shadow-sm"
                            onClick={async () => {
                                try {
                                    const categoryData = await getOneCategory();
                                    setAccExpenses(categoryData);
                                    if (onFilteredData) {
                                        onFilteredData(categoryData);
                                    }
                                } catch (error) {
                                    console.error("Error in category filter:", error);
                                    setAccExpenses([]);
                                    if (onFilteredData) {
                                        onFilteredData([]);
                                    }
                                }
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'טוען...' : 'חפש'}
                        </motion.button>
                    </div>
                )}

                {showFilterDates && (
                    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black/50 p-4 z-50">
                        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4 text-center">סינון לפי תאריכים</h3>
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">תאריך התחלה:</label>
                                    <input
                                        key={`start${startDate}`}
                                        type="date"
                                        defaultValue={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">תאריך סיום:</label>
                                    <input
                                        key={`end${endDate}`}
                                        type="date"
                                        defaultValue={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex flex-col gap-2 mt-6">
                                    <button
                                        type="button"
                                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                                        onClick={async () => {
                                            const filteredData = await getAccExpensesByDate();
                                            setAccExpenses(filteredData);
                                            if (onFilteredData) {
                                                onFilteredData(filteredData);
                                            }
                                            setShowFilterDates(false);
                                        }}
                                    >
                                        חפש
                                    </button>
                                    <button
                                        type="button"
                                        className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
                                        onClick={resetFilter}
                                    >
                                        אפס סינון
                                    </button>
                                    <button
                                        type="button"
                                        className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                                        onClick={() => setShowFilterDates(false)}
                                    >
                                        סגור
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
            }
            {/* {
                !showOnlyFilters && (
                    <ExpensesTable username={username}
                        profileName={profileName}
                        expenseData={accExpenses}
                        setExpenses={getAccExpenses}
                        showEditBtn={false}
                        showRelation={true}
                        showAddTransactBtn={false}
                        onFilteredData={onFilteredData} />
                )
            } */}
        </div >
    )
}
