import { useState, useEffect } from "react";
import GetCats from "./GetCats";
import ExpensesTable from "./ExpensesTable";
import { motion } from 'framer-motion';

export default function ProfileExpenses({ username, profileName, showFilterDatesBtn, onFilteredData, showOnlyFilters, onTransactionUpdate }) {
    const [profExpenses, setProfExpenses] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showFilterDates, setShowFilterDates] = useState(false);
    const [showFilterCats, setShowFilterCats] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCategorySelect = (category) => {
        console.log("Category selected:", category);
        setSelectedCategory(category);
    };

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

    async function getOneCategory(category) {
        try {
            setIsLoading(true);
            console.log("Fetching category:", category);
            let response = await fetch('http://localhost:5500/api/profile/profile_expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    profileName
                })
            });
            let data = await response.json();
            console.log("Raw data from server:", data);

            if (response.ok && data.expenses) {
                return data.expenses.filter(cat => cat.categoryName === category);
            } else {
                console.log("No expenses data received");
                return [];
            }
        } catch (error) {
            console.error("Error fetching expenses:", error);
            return [];
        } finally {
            setIsLoading(false);
        }
    }

    async function setProfExpensesByDate() {
        let tmpTransactions = await getProfExpensesByDate();
        setProfExpenses(tmpTransactions);
    }

    async function resetFilter() {
        setSelectedCategory("");
        setShowFilterCats(false);
        let tmpTransactions = await getProfExpenses();
        setProfExpenses(tmpTransactions);
        if (onFilteredData) {
            onFilteredData(tmpTransactions);
        }
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

    async function refreshExpenses() {
        try {
            console.log("ProfileExpenses: Refreshing expenses...");
            const updatedExpenses = await getProfExpenses();
            if (updatedExpenses && updatedExpenses.length > 0) {
                console.log("ProfileExpenses: Setting new expenses:", updatedExpenses);
                setProfExpenses(updatedExpenses);

                if (onFilteredData) {
                    console.log("ProfileExpenses: Updating filtered data");
                    onFilteredData(updatedExpenses);
                }

                return updatedExpenses;
            }
            console.log("ProfileExpenses: No expenses found or empty array");
            return [];
        } catch (error) {
            console.error("ProfileExpenses: Error refreshing expenses:", error);
            return [];
        }
    }

    useEffect(() => {
        async function fetchExpenses() {
            console.log("ProfileExpenses: Initial fetch of expenses");
            const expenses = await getProfExpenses();
            if (expenses && expenses.length > 0) {
                console.log("ProfileExpenses: Setting initial expenses:", expenses);
                setProfExpenses(expenses);
                if (onFilteredData) {
                    onFilteredData(expenses);
                }
            }
        }
        fetchExpenses();
    }, [username, profileName]);


    useEffect(() => {
        refreshExpenses();
    }, [username, profileName]);


    return (
        <div>
            {!showFilterDatesBtn &&
                <div className="flex flex-wrap gap-3 justify-center items-center mb-6 px-4">
                    <button
                        className="min-w-[120px] px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm md:text-base font-medium shadow-sm"
                        onClick={(e) => { setShowFilterDates(!showFilterDates); resetFilter(); }}
                    >
                        סינון לפי תאריך
                    </button>
                    <button
                        className="min-w-[120px] px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm md:text-base font-medium shadow-sm"
                        onClick={(e) => { setShowFilterCats(!showFilterCats); }}
                    >
                        סינון לפי קטגוריה
                    </button>
                    <button
                        className="min-w-[120px] px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm md:text-base font-medium shadow-sm"
                        onClick={resetFilter}
                    >
                        בטל סינון
                    </button>
                </div>
            }
            {
                showFilterCats &&
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 my-6 max-w-2xl mx-auto p-4">
                    <div className="w-full sm:w-2/3">
                        <GetCats
                            username={username}
                            profileName={profileName}
                            onCategorySelect={handleCategorySelect}
                            select={true}
                            initialCategory={selectedCategory}
                        />
                    </div>
                    <motion.button
                        className="w-full sm:w-1/3 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:bg-gray-200 disabled:text-gray-400 text-sm md:text-base font-medium shadow-sm"
                        onClick={async () => {
                            try {
                                if (selectedCategory) {
                                    const filteredData = await getOneCategory(selectedCategory);
                                    console.log("Setting filtered data:", filteredData);
                                    setProfExpenses(filteredData);
                                    if (onFilteredData) {
                                        onFilteredData(filteredData);
                                    }
                                } else {
                                    const allExpenses = await getProfExpenses();
                                    setProfExpenses(allExpenses || []);
                                    if (onFilteredData) {
                                        onFilteredData(allExpenses || []);
                                    }
                                }
                            } catch (error) {
                                console.error("Error in filter:", error);
                                setProfExpenses([]);
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
            }
            {showFilterDates &&
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
                                    onChange={(e) => { setStartDate(e.target.value); }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">תאריך סיום:</label>
                                <input
                                    key={`end${endDate}`}
                                    type="date"
                                    defaultValue={endDate}
                                    onChange={(e) => { setEndDate(e.target.value); }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex flex-col gap-2 mt-6">
                                <button
                                    type="button"
                                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                                    onClick={async (e) => {
                                        const filteredData = await getProfExpensesByDate();
                                        setProfExpenses(filteredData);
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
            }
            {!showOnlyFilters && (
                < ExpensesTable
                    username={username}
                    profileName={profileName}
                    expenseData={profExpenses}
                    refreshExpenses={refreshExpenses}
                    showEditBtn={true}
                    showRelation={false}
                    showAddTransactBtn={true}
                    onFilteredData={onFilteredData}
                    onTransactionUpdate={onTransactionUpdate}
                />
            )}
        </div >
    );
}