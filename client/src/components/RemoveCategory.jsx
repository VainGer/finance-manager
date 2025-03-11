import { useState } from 'react';

export default function RemoveCategory({ username, profileName, category, refreshExpenses, showConfirm }) {
    const [profileCode, setProfileCode] = useState('');
    const [error, setError] = useState('');

    async function removeCat(e) {
        e.preventDefault();
        if (profileCode !== profileName) {
            setError('קוד הפרופיל אינו תואם');
            return;
        }
        try {
            let response = await fetch('http://localhost:5500/api/profile/rem_cat_items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, category })
            });
            if (response.ok) {
                console.log(`Category ${category} removed successfully`);
                refreshExpenses();
                showConfirm(false);
            } else {
                console.log(`Failed to remove category ${category}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
            <form onSubmit={removeCat} className='bg-white p-6 rounded-2xl shadow-2xl border border-blue-600 w-full max-w-md'>
                <h2 className='text-2xl font-bold text-blue-600 mb-4 text-center'>מחיקת קטגוריה</h2>
                <p className='text-center mb-4'>הפעולה תמחק את הקטגוריה ואת הפריטים שבה. לאישור הפעולה, הכנס את קוד הפרופיל ולחץ אישור.</p>
                <input 
                    className='w-full p-3 mb-4 border border-gray-300 rounded-md text-center text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-200' 
                    type="text" 
                    placeholder='הזן קוד פרופיל' 
                    value={profileCode}
                    onChange={(e) => setProfileCode(e.target.value)} 
                />
                {error && <p className='text-red-500 text-center mb-4'>{error}</p>}
                <div className='flex justify-between'>
                    <input 
                        type="submit" 
                        value="אישור" 
                        className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition'
                    />
                    <input 
                        type="button" 
                        value="ביטול" 
                        onClick={() => showConfirm(false)}
                        className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition'
                    />
                </div>
            </form>
        </div>
    );
}