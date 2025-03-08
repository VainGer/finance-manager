import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AccountExpenses from '../components/AccountExpenses';
import ProfileExpenses from '../components/ProfileExpenses';
import Header from '../components/Header';
import ExpenseEditor from '../components/ExpenseEditor';

export default function Dashboard() {
    const location = useLocation();
    const username = location.state?.username;
    const profileName = location.state?.profileName;
    const parent = location.state?.parent;
    const [showAccExpenses, setShowAccExpenses] = useState(false);
    const [showProfExpenses, setShowProfExpenses] = useState(false);
    const [expensesKey, setExpensesKey] = useState(0);
    async function refreshExpenses() {
        setExpensesKey((prevKey) => prevKey + 1);
    }

    return (
        <div dir='rtl' className='text-center h-full'>
            <Header username={username} profileName={profileName} parent={parent}></Header>
            <div className='grid grid-cols-4 w-full h-full '>
                <div className='h-full'>
                    <h2>פאנל עריכה</h2>
                    <span>בחר קטגוריה</span>
                    <ExpenseEditor username={username} profileName={profileName} refreshExpenses={refreshExpenses} />
                </div>
                <div className='col-span-3 grid mx-auto'>
                    <div className='flex gap-4 h-max'>
                        <button
                            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
                            onClick={(e) => {
                                setShowProfExpenses(!showProfExpenses);
                                setShowAccExpenses(false);
                            }}
                        >
                            הצג הוצאות בפרופיל שלך
                        </button>
                        {parent && (
                            <button
                                className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
                                onClick={(e) => {
                                    setShowAccExpenses(!showAccExpenses);
                                    setShowProfExpenses(false);
                                }}
                            >
                                הצג הוצאות בכל הפרופילים
                            </button>
                        )}
                    </div>
                    <div className='mt-23'>
                        {showAccExpenses && <div key={`acc-${expensesKey}`}><AccountExpenses username={username} profileName={profileName}></AccountExpenses></div>}
                        {showProfExpenses && <div key={`prof-${expensesKey}`}><ProfileExpenses username={username} profileName={profileName}></ProfileExpenses></div>}
                    </div>
                </div>
            </div>
        </div>
    );
}