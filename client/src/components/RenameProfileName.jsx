import { useState } from 'react';

export default function RenameProfileName({ username, profileName, setProfileName, setShowBtns, setShowRenameProfile }) {
    const [newProfileName, setNewProfileName] = useState('');

    async function renameProfile(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/user/rename', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, newProfileName })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(`Profile name changed to ${newProfileName} successfully`);
                setProfileName(newProfileName);
                setShowBtns(true);
                setShowRenameProfile(false);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className="w-full max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200 text-center" onSubmit={renameProfile}>
            <h2 className="text-xl font-semibold text-blue-600 mb-4">שנה שם פרופיל</h2>
            
            {/* שדה קלט לשם החדש */}
            <label className="block text-gray-700 mb-2">שם פרופיל חדש</label>
            <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 text-center" 
                placeholder="הקלד שם חדש" 
                onChange={(e) => setNewProfileName(e.target.value)} 
            />

           
            <div className='grid grid-cols-2 gap-4 mt-6'>
                <button 
                    type="button" 
                    className="px-4 py-2 bg-red-400 text-white rounded-lg shadow-md hover:bg-gray-500 transition"
                    onClick={() => { setShowRenameProfile(false); setShowBtns(true); }}
                >
                    ביטול
                </button>
                <button 
                    type="submit" 
                    className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
                >
                    שנה שם פרופיל
                </button>
            </div>
        </form>
    );
}
