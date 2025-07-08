import { useState } from 'react';
import GetCategories from '../categories/GetCategories';
import ItemsToSelcet from './BusinessToSelect';
import { migrateBusiness } from '../../API/business';

export default function MoveBusiness({ username, profileName, category, showConfirm }) {
    const [nextCat, setNextCat] = useState('');
    const [itemName, setItemName] = useState('');
    const [currentCat] = useState(category);
    const [error, setError] = useState('');

    async function moveBusiness(e) {
        e.preventDefault();
        if (!itemName || !nextCat) {
            setError('יש לבחור פריט וקטגוריה חדשה');
            return;
        }
        if (nextCat === currentCat) {
            setError('אי אפשר להעביר את הפריט לאותה קטגוריה');
            return;
        }

        const result = await migrateBusiness(username, profileName, currentCat, nextCat, itemName);
        if (result.status === 200) {
            showConfirm(false);
        } else if (result.status === 400) {
            setError("שגיאה בהעברת בעל עסק לקטגוריה חדשה");
        } else if (result.status === 500) {
            setError("שגיאה בשרת, נסה שוב מאוחר יותר");
        }
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
            <form onSubmit={moveBusiness} className='bg-white p-6 rounded-2xl shadow-2xl border border-blue-600 w-full max-w-md'>
                <h2 className='text-2xl font-bold text-blue-600 mb-4 text-center'>העבר פריט</h2>
                <label className='block text-gray-700 text-sm font-bold mb-2'>בחר פריט</label>
                <ItemsToSelcet username={username} profileName={profileName} category={category} onSelectedOpt={setItemName} />
                <label className='block text-gray-700 text-sm font-bold mb-2'>בחר קטגוריה אליה תעביר את הפריט</label>
                <GetCategories username={username} profileName={profileName} onCategorySelect={setNextCat} select={true} forAccount={false} />
                {error && <p className='text-red-500 text-center mb-4'>{error}</p>}
                <div className='flex justify-between mt-4'>
                    <input
                        type="submit"
                        value="שמור"
                        className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition'
                    />
                    <input
                        type="button"
                        value="סגור"
                        onClick={() => showConfirm(false)}
                        className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition'
                    />
                </div>
            </form>
        </div>
    );
}