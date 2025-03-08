import { useState, useEffect } from "react";

export default function RenameCategory({ username, profileName, category, refreshExpenses, showConfirm }) {

    const [newName, setNewName] = useState('');

    async function renameCategory(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/profile/rename_cat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, category, newName })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(data.message);
                refreshExpenses();
                showConfirm(false);
            }
            else {
                console.log(data.message);
                //TODO
            }
        } catch (error) {
            console.log(error);
        }
    }



    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black opacity-50'>
            <form className='bg-white grid border-blue-600 border-10 rounded-2xl h-50'
                onSubmit={(e) => renameCategory(e)}>
                <label>שם חדש לקטגוריה:</label>
                <input type="text" onChange={(e) => setNewName(e.target.value)}></input>
                <div className='grid grid-cols-2 *:border-1 *:rounded-2xl mb-6'>
                    <input type="submit" value="שנה שם"></input>
                    <input type="button" value="ביטול" onClick={() => showConfirm(false)}></input>
                </div>
            </form>
        </div>
    )
}