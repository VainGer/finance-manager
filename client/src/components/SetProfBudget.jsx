import { useState } from 'react';

export default function SetProfBudget({ username, profileName, showConfirm, refreshExpenses }) {
    const [amount, setAmount] = useState(0);
    const [startDay, setStartDay] = useState(new Date().toISOString().slice(0, 10));
    const [endDay, setEndDay] = useState(new Date().toISOString().slice(0, 10));
    const [error, setError] = useState('');

    async function setBudget(e) {
        e.preventDefault();
        if (amount <= 0) {
            setError('הסכום חייב להיות גדול מאפס');
            return;
        }
        if (new Date(startDay) >= new Date(endDay)) {
            setError('תאריך ההתחלה חייב להיות לפני תאריך הסיום');
            return;
        }
        try {
            let response = await fetch('http://localhost:5500/api/profile/set_prof_budget', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, amount, startDay, endDay })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(data.message);
                showConfirm(false);
                refreshExpenses();
                return true;
            } else {
                console.log(data.message);
                setError(data.message);
                return false;
            }
        } catch (error) {
            console.log(error);
            setError('שגיאה בשרת, נסה שוב מאוחר יותר');
        }
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
            <form onSubmit={setBudget} className='bg-white p-6 rounded-2xl shadow-2xl border border-blue-600 w-full max-w-md'>
                <h2 className='text-2xl font-bold text-blue-600 mb-4 text-center'>הוסף תקציב לפרופיל</h2>
                <label className='block text-gray-700 text-sm font-bold mb-2'>הכנס סכום</label>
                <input 
                    className='w-full p-3 mb-4 border border-gray-300 rounded-md text-center text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-200' 
                    type="number" 
                    onChange={(e) => setAmount(e.target.value)} 
                />
                <label className='block text-gray-700 text-sm font-bold mb-2'>בחר תאריך התחלה</label>
                <input 
                    className='w-full p-3 mb-4 border border-gray-300 rounded-md text-center text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-200' 
                    type="date" 
                    onChange={(e) => setStartDay(e.target.value)} 
                />
                <label className='block text-gray-700 text-sm font-bold mb-2'>בחר תאריך סיום</label>
                <input 
                    className='w-full p-3 mb-4 border border-gray-300 rounded-md text-center text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-200' 
                    type="date" 
                    onChange={(e) => setEndDay(e.target.value)} 
                />
                {error && <p className='text-red-500 text-center mb-4'>{error}</p>}
                <div className='flex justify-between'>
                    <input 
                        type="submit" 
                        value="הוסף תקציב לתאריך" 
                        className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition'
                    />
                    <input 
                        type="button" 
                        value="סגור תהליך" 
                        onClick={() => showConfirm(false)}
                        className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition'
                    />
                </div>
            </form>
        </div>
    );
}