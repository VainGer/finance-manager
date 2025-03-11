import { useState } from 'react';

export default function AddTransactInReport({ username, profileName, category, item, onTransactionUpdate, closeAddTransact }) {
    const [date, setDate] = useState('');
    const [amount, setAmount] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/transactions/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, profileName, category, item, date, amount })
            });

            if (response.ok) {
                onTransactionUpdate();
                closeAddTransact();
            } else {
                console.log('Error adding transaction');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-300 w-full max-w-md">
                <h2 className="text-xl font-semibold text-blue-600 text-center mb-4">הוספת עסקה</h2>
                <form className="grid gap-4" onSubmit={handleSubmit}>
                    
                    <div className="grid">
                        <label className="text-gray-700 font-medium">תאריך</label>
                        <input type="date" className="p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200"
                            value={date} onChange={(e) => setDate(e.target.value)} required />
                    </div>

                    <div className="grid">
                        <label className="text-gray-700 font-medium">סכום</label>
                        <input type="number" className="p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200"
                            value={amount} onChange={(e) => setAmount(e.target.value)} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                            onClick={closeAddTransact}>
                            ביטול
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                            שמור עסקה
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
