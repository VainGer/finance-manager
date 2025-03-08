import { useEffect, useState } from 'react';


export default function RemoveCategory({ username, profileName, category, refreshExpenses, showConfirm }) {

    async function removeCat(e) {
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
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black opacity-50'>
            <div className='bg-white grid border-blue-600 border-10 rounded-2xl h-50'>
                <p className='break-words w-50'>הפעולה תמחק את הקטגוריה ואת הפריטים שבה, לאישור הפעולה לחץ אישור</p>
                <div className='grid grid-cols-2 *:border-1 *:rounded-2xl mb-6'>
                    <button onClick={(e) => removeCat(e)}>אישור</button>
                    <button onClick={(e) => showConfirm(false)}>ביטול</button>
                </div>
            </div>
        </div>
    );
}