import { useState } from 'react';
import { renameProfile } from '../../API/user.js';
import { useAuth } from '../../../src/context/AuthContext.jsx';

export default function RenameProfileName({ username, profileName, setProfileName, setShowBtns, setShowRenameProfile }) {
    const [newProfileName, setNewProfileName] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState(null);
    const { profile, setProfile } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        const response = await renameProfile(username, profileName, pin, newProfileName);
        if (response.status === 200) {
            setProfile({ profileName: newProfileName, parent: profile.parent });
            setProfileName(newProfileName);
            setShowRenameProfile(false);
            setShowBtns(true);
        }
        else if (response.status === 400) {
            setError("קוד סודי שגוי");
        }
        else {
            setError("שגיאה בחיבור, נסה שנית מאוחר יותר");
        }
        setPin('');
    }

    return (
        <form className="w-full max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200 text-center" onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold text-blue-600 mb-4">שנה שם פרופיל</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <label className="block text-gray-700 mb-2">שם פרופיל חדש</label>
            <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 text-center mb-4"
                placeholder="הקלד שם חדש"
                onChange={(e) => setNewProfileName(e.target.value)}
            />

            <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 text-center"
                placeholder="הזן קוד סודי"
                onChange={(e) => setPin(e.target.value)}
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
