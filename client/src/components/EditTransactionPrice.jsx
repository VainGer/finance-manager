import { useState, useEffect } from 'react';

export default function EditTransactionPrice({ username, profileName }) {
    const [category, setCategory] = useState('');
    const [transaction, setTransaction] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [categories, setCategories] = useState([]);
    const [transactions, setTransactions] = useState([]);

    // Fetch categories when the component mounts
    useEffect(() => {
        async function fetchCategories() {
            try {
                let response = await fetch('http://localhost:5500/api/profile/prof_categories', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, profileName })
                });
                let data = await response.json();
                if (response.ok) {
                    setCategories(data.categories);
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchCategories();
    }, [username, profileName]);

    useEffect(() => {
        async function fetchTransactions() {
            if (category) {
                try {
                    let response = await fetch('http://localhost:5500/api/profile/getItems', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ username, profileName, categoryName: category })
                    });
                    let data = await response.json();
                    if (response.ok) {
                        setTransactions(data.items);
                    } else {
                        console.log(data.message);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        fetchTransactions();
    }, [category, username, profileName]);

    async function editTransactionPrice(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/profile/edit_price', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, category, transaction, newPrice })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(`Transaction ${transaction} price updated to ${newPrice} successfully`);
                setTransaction(''); 
                setNewPrice(''); 
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className="border-1" onSubmit={editTransactionPrice}>
            <label>בחר קטגוריה:</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">בחר קטגוריה</option>
                {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                ))}
            </select>
            <label>בחר עסקה:</label>
            <select value={transaction} onChange={(e) => setTransaction(e.target.value)}>
                <option value="">בחר עסקה</option>
                {transactions.map((trans, index) => (
                    <option key={index} value={trans}>{trans}</option>
                ))}
            </select>
            <label>מחיר חדש:</label>
            <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
            <input type="submit" value="עדכן מחיר" />
        </form>
    );
}