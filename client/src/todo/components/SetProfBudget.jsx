import { useState, useEffect } from 'react';

export default function SetProfBudget({ username, profileName, showConfirm, refreshExpenses }) {
    const [amount, setAmount] = useState(0);
    const [startDay, setStartDay] = useState(new Date().toISOString().slice(0, 10));
    const [endDay, setEndDay] = useState(new Date().toISOString().slice(0, 10));
    const [error, setError] = useState('');
    const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
    const [existingBudget, setExistingBudget] = useState(null);

    const checkExistingBudget = async () => {
        try {
            const response = await fetch('http://localhost:5500/api/profile/get_prof_budget', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName })
            });
            const data = await response.json();
            if (response.ok && data.budget && data.budget.length > 0) {
                setExistingBudget(data.budget[0]);
            } else {
                setExistingBudget(null);
            }
        } catch (error) {
            console.error('Error checking existing budget:', error);
        }
    };

    useEffect(() => {
        checkExistingBudget();
    }, []);

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

        if (existingBudget && !showOverwriteConfirm) {
            setShowOverwriteConfirm(true);
            return;
        }

        try {
            let response = await fetch('http://localhost:5500/api/profile/set_prof_budget', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    profileName,
                    amount: parseFloat(amount),
                    startDate: startDay,
                    endDate: endDay
                })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(data.message);
                showConfirm(false);
                window.dispatchEvent(new CustomEvent('budgetUpdated'));
                if (refreshExpenses) {
                    refreshExpenses();
                }
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

    if (showOverwriteConfirm) {
        return (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
                <div className='bg-white p-6 rounded-2xl shadow-2xl border border-blue-600 w-full max-w-md'>
                    <h2 className='text-2xl font-bold text-blue-600 mb-4 text-center'>קיים כבר תקציב</h2>
                    <p className='text-center mb-4'>
                        קיים כבר תקציב של {existingBudget.amount} ₪ לפרופיל זה
                        <br />
                        מתאריך {new Date(existingBudget.startDate).toLocaleDateString('he-IL')}
                        <br />
                        עד תאריך {new Date(existingBudget.endDate).toLocaleDateString('he-IL')}
                    </p>
                    <p className='text-center mb-6'>האם ברצונך להחליף את התקציב הקיים?</p>
                    <div className='flex justify-center gap-4'>
                        <button
                            onClick={() => {
                                setShowOverwriteConfirm(false);
                                setBudget(new Event('submit'));
                            }}
                            className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
                        >
                            כן, החלף
                        </button>
                        <button
                            onClick={() => {
                                setShowOverwriteConfirm(false);
                                showConfirm(false);
                            }}
                            className='px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition'
                        >
                            ביטול
                        </button>
                    </div>
                </div>
            </div>
        );
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
                        value="הוסף תקציב" 
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