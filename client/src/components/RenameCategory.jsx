import { useState, useEffect } from "react";

export default function RenameCategory({ username, profileName, category, refreshExpenses }) {

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
        <form className="border-1" onSubmit={(e) => renameCategory(e)}>
            <label>שם חדש לקטגוריה:</label>
            <input type="text" onChange={(e) => setNewName(e.target.value)}></input>
            <input type="submit" value="שנה שם"></input>
        </form>
    )
}