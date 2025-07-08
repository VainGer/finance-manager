import { useState, useEffect } from 'react';
import ItemsToSelect from './ItemsToSelcet';
import { removeBusinessFromCategory } from '../../API/business';

//to implement
export default function RemoveBusiness({ username, profileName, category, refreshExpenses, showConfirm }) {
    const [business, setBusinesses] = useState('');

    async function removeItem(e) {
        e.preventDefault();

        const result = await removeBusinessFromCategory(username, profileName, category, business);

        if (result.status === 200) {
            refreshExpenses();
            showConfirm(false);
        } else if (result.status === 400) {
            console.log("שגיאה בהסרת בעל עסק לקטגוריה חדשה");
        } else if (result.status === 500) {
            console.log("שגיאה בשרת, נסה שוב מאוחר יותר");
        }
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
            <form className='bg-white grid border-blue-600 border-10 rounded-2xl h-50'
                onSubmit={removeItem}>
                <label>בחר בעל עסק למחיקה</label>
                <ItemsToSelect username={username} profileName={profileName} category={category} onSelectedOpt={setItem} />
                <input type="submit" value="מחק בעל עסק" />
            </form>
        </div>
    );
}