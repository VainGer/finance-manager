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
                    .filter(expense => expense.category && expense.amount > 0); // Filter out empty categories and zero amounts
                console.log('Expenses Data:', processedData); // Log the expenses data
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
        <div dir='rtl' className='text-center'>
            <Header username={username} profileName={profileName} parent={parent}></Header>
            <div className='grid grid-cols-4 w-full mx-4 relative mt-12'>
                <div className='h-full'>
                    <h2>פאנל עריכה</h2>
                    <span>בחר קטגוריה</span>
                    <ExpenseEditor username={username} profileName={profileName} refreshExpenses={refreshExpenses} />
                </div>
                <div className='col-span-3 grid mx-auto h-max'>
                    <div className='grid grid-cols-4 gap-4 h-10 *:h-max'>
                        <button
                            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
                            onClick={() => {
                                setShowProfExpenses(!showProfExpenses);
                                setShowAccExpenses(false);
                                setShowExpensesByBudget(false);
                                setShowGraphs(false);
                            }}
                        >
                            הצג הוצאות בפרופיל שלך
                        </button>
                        <button
                            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
                            onClick={() => {
                                setShowProfExpenses(false);
                                setShowAccExpenses(false);
                                setShowExpensesByBudget(!showExpensesByBudget);
                                setShowGraphs(false);
                            }}
                        >
                            הצג הוצאות ביחס לתקציב
                        </button>
                        {parent && (
                            <button
                                className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
                                onClick={() => {
                                    setShowAccExpenses(!showAccExpenses);
                                    setShowProfExpenses(false);
                                    setShowExpensesByBudget(false);
                                    setShowGraphs(false);
                                }}
                            >
                                הצג הוצאות בכל הפרופילים
                            </button>
                        )}
                        <button
                            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
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
                    <div className='inset-0 mt-8'>
                        {showAccExpenses && <div key={`acc-${expensesKey}`}><AccountExpenses username={username} profileName={profileName}></AccountExpenses></div>}
                        {showProfExpenses && <div key={`prof-${expensesKey}`}><ProfileExpenses username={username} profileName={profileName}></ProfileExpenses></div>}
                        {showExpensesByBudget && <div key={`budget-${expensesKey}`}><ExpensesByBudget username={username} profileName={profileName}></ExpensesByBudget></div>}
                        {showGraphs && (
                            <div>
                                <PieChart data={expensesData} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}