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
    const profileName = location.state?.profileName
    const parent = location.state?.parent;
    const [showAccExpenses, setShowAccExpenses] = useState(false);
    const [showProfExpenses, setShowProfExpenses] = useState(false);


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
                    <div className='*:border-1 *:hover:bg-blue-200 *:hover:cursor-pointer *:w-max *:ms-5'>
                        {parent ?
                            (<button onClick={(e) => { setShowProfExpenses(!showProfExpenses); setShowAccExpenses(false) }}>הצג הוצאות בפרופיל שלך</button>) :
                            (<button className='col-span-2' onClick={(e) => { setShowProfExpenses(!showProfExpenses); setShowAccExpenses(false) }}>הצג הוצאות בפרופיל שלך</button>)}
                        {parent && (<button onClick={(e) => { setShowAccExpenses(!showAccExpenses); setShowProfExpenses(false) }}>הצג הוצאות בכל הפרופילים</button>)}
                    </div>
                    {showAccExpenses && <div><AccountExpenses username={username} profileName={profileName}></AccountExpenses></div>}
                    {showProfExpenses && <div><ProfileExpenses username={username} profileName={profileName}></ProfileExpenses></div>}
                </div>
            </div>
        </div>
    );
}