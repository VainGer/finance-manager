import { useState } from 'react';
import GetCats from './GetCats';

export default function SetCategoryBudget({ username, profileName, category, showConfirm, refreshExpenses }) {
    const [amount, setAmount] = useState('');
    const [startDay, setStartDay] = useState(new Date().toISOString().slice(0, 10));
    const [endDay, setEndDay] = useState(new Date().toISOString().slice(0, 10));

    async function setBudget(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/profile/set_cat_budget', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, profileName, category, amount, startDay, endDay })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(data.message);
                showConfirm(false);
                refreshExpenses();
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md px-4">
            <form onSubmit={setBudget} className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-blue-700 text-center mb-4">הגדרת תקציב לקטגוריה</h2>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1"> </label>
                    <GetCats username={username} profileName={profileName} select={true} forAccount={false} />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1">סכום תקציב</label>
                    <input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-2 border rounded-md text-center"
                        placeholder="הכנס סכום"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">תאריך התחלה</label>
                        <input 
                            type="date" 
                            value={startDay} 
                            onChange={(e) => setStartDay(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">תאריך סיום</label>
                        <input 
                            type="date" 
                            value={endDay} 
                            onChange={(e) => setEndDay(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button 
                        type="button" 
                        onClick={() => showConfirm(false)} 
                        className="w-full bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500 transition"
                    >
                        ביטול
                    </button>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        שמור תקציב
                    </button>
                </div>
            </form>
        </div>
    );
}
