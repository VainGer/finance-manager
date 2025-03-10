import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AccountExpenses from '../components/AccountExpenses';
import ProfileExpenses from '../components/ProfileExpenses';
import Header from '../components/Header';
import ExpenseEditor from '../components/ExpenseEditor';
import ExpensesByBudget from '../components/ExpensesByBudget';
import PieChart from '../components/PieChart';

export default function Dashboard() {
    const location = useLocation();
    const username = location.state?.username;
    const profileName = location.state?.profileName;
    const parent = location.state?.parent;
    const [showAccExpenses, setShowAccExpenses] = useState(false);
    const [showProfExpenses, setShowProfExpenses] = useState(false);
    const [showExpensesByBudget, setShowExpensesByBudget] = useState(false);
    const [showGraphs, setShowGraphs] = useState(false);
    const [expensesKey, setExpensesKey] = useState(0);
    const [expensesData, setExpensesData] = useState([]);

    async function refreshExpenses() {
        setExpensesKey((prevKey) => prevKey + 1);
        try {
            const response = await fetch('http://localhost:5500/api/profile/profile_expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName })
            });
            const data = await response.json();
            if (response.ok) {
                const processedData = data.expenses
                    .map(expense => ({
                        category: expense.categoryName,
                        amount: expense.items.reduce((sum, item) => sum + item.transactions.reduce((sum, transaction) => sum + parseFloat(transaction.price), 0), 0)
                    }))
                    .filter(expense => expense.category && expense.amount > 0);
                // console.log('Expenses Data:', processedData);
                setExpensesData(processedData);
            } else {
                console.error('Failed to fetch expenses:', data);
            }
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    }

    useEffect(() => {
        if (username && profileName) {
            refreshExpenses();
        }
    }, [username, profileName]);

    return (
        <div dir='rtl' className='text-center bg-gray-100 min-h-screen'>
            <Header username={username} profileName={profileName} parent={parent} />

            <div className='grid grid-cols-4 gap-6 w-full mx-4 relative mt-4 p-4'>

                <div className='h-full bg-white shadow-md rounded-xl p-6 border border-gray-300'>
                    <h2 className='text-xl font-semibold text-blue-600 mb-4'>פאנל עריכה</h2>
                    <span className='text-gray-600 text-sm'>בחר קטגוריה</span>
                    <ExpenseEditor username={username} profileName={profileName} refreshExpenses={refreshExpenses} />
                </div>


                <div className='col-span-3 bg-white shadow-md rounded-xl p-6 border border-gray-300'>


                    <div className='grid grid-cols-4 gap-4 mb-6'>
                        <button
                            className={`px-6 py-3 text-white font-medium rounded-lg shadow-md transition ${showProfExpenses ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                            onClick={() => {
                                setShowProfExpenses(!showProfExpenses);
                                setShowAccExpenses(false);
                                setShowExpensesByBudget(false);
                                setShowGraphs(false);
                            }}
                        >
                            הוצאות בפרופיל שלך
                        </button>
                        <button
                            className={`px-6 py-3 text-white font-medium rounded-lg shadow-md transition ${showExpensesByBudget ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                            onClick={() => {
                                setShowProfExpenses(false);
                                setShowAccExpenses(false);
                                setShowExpensesByBudget(!showExpensesByBudget);
                                setShowGraphs(false);
                            }}
                        >
                            הוצאות ביחס לתקציב
                        </button>
                        {parent && (
                            <button
                                className={`px-6 py-3 text-white font-medium rounded-lg shadow-md transition ${showAccExpenses ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                                    }`}
                                onClick={() => {
                                    setShowAccExpenses(!showAccExpenses);
                                    setShowProfExpenses(false);
                                    setShowExpensesByBudget(false);
                                    setShowGraphs(false);
                                }}
                            >
                                הוצאות בכל הפרופילים
                            </button>
                        )}
                        <button
                            className={`px-6 py-3 text-white font-medium rounded-lg shadow-md transition ${showGraphs ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                            onClick={() => {
                                setShowGraphs(!showGraphs);
                                setShowProfExpenses(false);
                                setShowAccExpenses(false);
                                setShowExpensesByBudget(false);
                            }}
                        >
                            הצג גרפים
                        </button>
                    </div>


                    <div className='mt-4'>
                        {showAccExpenses && <div key={`acc-${expensesKey}`} className="bg-gray-50 p-4 rounded-lg shadow-md"><AccountExpenses username={username} profileName={profileName} /></div>}
                        {showProfExpenses && <div key={`prof-${expensesKey}`} className="bg-gray-50 p-4 rounded-lg shadow-md"><ProfileExpenses username={username} profileName={profileName} /></div>}
                        {showExpensesByBudget && <div key={`budget-${expensesKey}`} className="bg-gray-50 p-4 rounded-lg shadow-md"><ExpensesByBudget username={username} profileName={profileName} /></div>}
                        {showGraphs && (
                            <div className="bg-gray-50 p-4 rounded-lg shadow-md flex justify-center">
                                <PieChart data={expensesData} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
