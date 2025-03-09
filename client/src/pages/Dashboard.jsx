import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AccountExpenses from '../components/AccountExpenses';
import ProfileExpenses from '../components/ProfileExpenses';
import Header from '../components/Header';
import ExpenseEditor from '../components/ExpenseEditor';
import ExpensesByBudget from '../components/ExpensesByBudget';

export default function Dashboard() {
    const location = useLocation();
    const username = location.state?.username;
    const profileName = location.state?.profileName;
    const parent = location.state?.parent;
    const [showAccExpenses, setShowAccExpenses] = useState(false);
    const [showProfExpenses, setShowProfExpenses] = useState(false);
    const [expensesKey, setExpensesKey] = useState(0);
    const [showExpensesByBudget, setShowExpensesByBudget] = useState(false);

    async function refreshExpenses() {
        setExpensesKey((prevKey) => prevKey + 1);
    }

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
                    <div className='grid grid-cols-3 gap-4 h-10 *:h-max'>
                        <button
                            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
                            onClick={(e) => {
                                setShowProfExpenses(!showProfExpenses);
                                setShowAccExpenses(false);
                                setShowExpensesByBudget(false);
                            }}
                        >
                            הצג הוצאות בפרופיל שלך
                        </button>
                        <button
                            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
                            onClick={(e) => {
                                setShowProfExpenses(false);
                                setShowAccExpenses(false);
                                setShowExpensesByBudget(!showExpensesByBudget);
                            }}
                        >
                            הצג הוצאות ביחס לתקציב
                        </button>
                        {parent && (
                            <button
                                className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
                                onClick={(e) => {
                                    setShowAccExpenses(!showAccExpenses);
                                    setShowProfExpenses(false);
                                    setShowExpensesByBudget(false);
                                }}
                            >
                                הצג הוצאות בכל הפרופילים
                            </button>
                        )}
                    </div>
                    <div className='inset-0 mt-8'>
                        {showAccExpenses && <div key={`acc-${expensesKey}`}><AccountExpenses username={username}
                            profileName={profileName}></AccountExpenses></div>}

                        {showProfExpenses && <div key={`prof-${expensesKey}`}><ProfileExpenses username={username}
                            profileName={profileName}></ProfileExpenses></div>}

                        {showExpensesByBudget && <div key={`budget-${expensesKey}`}><ExpensesByBudget username={username}
                            profileName={profileName}></ExpensesByBudget></div>}
                    </div>
                </div>
            </div>
        </div>
    );
}