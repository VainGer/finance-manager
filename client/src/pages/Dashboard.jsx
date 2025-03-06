import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AccountExpenses from '../components/AccountExpenses';
import ProfileExpenses from '../components/ProfileExpenses';
import Header from '../components/Header';
import GetCats from '../components/GetCats';
import ExpenseEditor from '../components/ExpenseEditor';

export default function Dashboard() {
    const location = useLocation();
    const username = location.state?.username;
    const profileName = location.state?.profileName;
    const parent = location.state?.parent;
    const [showAccExpenses, setShowAccExpenses] = useState(false);
    const [showProfExpenses, setShowProfExpenses] = useState(false);

    useEffect(() => {
        console.log('Dashboard loaded with:', { username, profileName, parent });
    }, [username, profileName, parent]);

    return (
        <div dir='rtl' className='text-center'>
            <Header username={username} profileName={profileName} parent={parent}></Header>
            <div className='grid grid-cols-4 w-full mt-4'>
                <div>
                    <h2>פאנל עריכה</h2>
                    <span>בחר קטגוריה</span>
                    <div>
                        <ExpenseEditor username={username} profileName={profileName} />
                    </div>
                </div>
                <div className='col-span-3 grid mx-auto'>
                    <div className='flex gap-4'>
                        <button
                            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
                            onClick={(e) => {
                                setShowProfExpenses(!showProfExpenses);
                                setShowAccExpenses(false);
                                console.log('showProfExpenses:', !showProfExpenses);
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
                                    console.log('showAccExpenses:', !showAccExpenses);
                                }}
                            >
                                הצג הוצאות בכל הפרופילים
                            </button>
                        )}
                    </div>
                    <div className='flex flex-col space-y-4'>
                        {showAccExpenses && <div><AccountExpenses username={username} profileName={profileName}></AccountExpenses></div>}
                        {showProfExpenses && <div><ProfileExpenses username={username} profileName={profileName}></ProfileExpenses></div>}
                    </div>
                </div>
            </div>
        </div>
    );
}