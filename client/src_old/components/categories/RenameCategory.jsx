import { useState } from "react";
import { renameCategory } from "../../API/category";
export default function RenameCategory({ username, profileName, category, showConfirm }) {
    const [newName, setNewName] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        if (newName === category) {
            setError('השם החדש אינו יכול להיות זהה לשם הקטגוריה הנוכחי');
            return;
        }
        const result = await renameCategory(username, profileName, category, newName);
        
        if (result.status === 200) {
            showConfirm(false);
        } else if (result.status === 404) {
            setError('שגיאה: קטגוריה לא נמצאה');
        } else if (result.status === 500) {
            setError('שגיאה בשרת: לא ניתן לשנות את שם הקטגוריה');
        } else {
            setError(result.message || 'שגיאה לא ידועה');
        }
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
            <form onSubmit={handleSubmit} className='bg-white p-6 rounded-2xl shadow-2xl border border-blue-600 w-full max-w-md'>
                <h2 className='text-2xl font-bold text-blue-600 mb-4 text-center'>שנה שם קטגוריה</h2>
                <p className='text-center mb-4 text-gray-700'>שם נוכחי: <span className='font-semibold'>{category}</span></p>
                <label className='block text-gray-700 text-sm font-bold mb-2'>שם חדש לקטגוריה:</label>
                <input 
                    className='w-full p-3 mb-4 border border-gray-300 rounded-md text-center text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-200' 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)} 
                />
                {error && <p className='text-red-500 text-center mb-4'>{error}</p>}
                <div className='flex justify-between'>
                    <input 
                        type="submit" 
                        value="שנה שם" 
                        className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition'
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