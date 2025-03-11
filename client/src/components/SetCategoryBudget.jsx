import { useState, useEffect } from 'react';
import GetCats from './GetCats';

export default function SetCategoryBudget({ username, profileName, category, showConfirm, refreshExpenses }) {

    const [amount, setAmount] = useState(0);
    const [startDay, setStartDay] = useState(new Date().toISOString().slice(0, 10));
    const [endDay, setEndDay] = useState(new Date().toISOString().slice(0, 10));

    async function setBudget(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/profile/set_cat_budget', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, category, amount, startDay, endDay })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(data.message);
                showConfirm(false);
                refreshExpenses();
                return true;
            } else {
                console.log(data.message);
                return false;
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
        <form onSubmit={setBudget} className='bg-white grid border-blue-600 border-10 rounded-2xl h-70 *:h-max *:border-b-1'>
            <GetCats username={username} profileName={profileName} select={true} forAccount={false}/>
            <label>הכנס סכום</label>
            <input type="number" onChange={(e) => setAmount(e.target.value)} />
            <label>בחר תאריך התחלה</label>
            <input type="date" onChange={(e) => setStartDay(e.target.value)} />
            <label>בחר תאריך סיום</label>
            <input type="date" onChange={(e) => setEndDay(e.target.value)} />
            <div className='grid grid-cols-2 *:border-1'>
                <input type="submit" value="הוסף תקציב לתאריך" />
                <input type="button" value="סגור תהליך" onClick={(e) => showConfirm(false)} />
            </div>
        </form>
    </div>);
}