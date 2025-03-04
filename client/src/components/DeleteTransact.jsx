import { useState, useEffect } from 'react';

export default function DeleteTransact({ username, profileName }) {
    const [category, setCategory] = useState('');
    const [transaction, setTransaction] = useState('');
    const [categories, setCategories] = useState([]);
    const [transactions, setTransactions] = useState([]);

    // Fetch categories when the component mounts
    useEffect(() => {
        async function fetchCategories() {
            try {
                let response = await fetch('http://localhost:5500/api/profile/getCats', {
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

    // Fetch transactions when a category is selected
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

    async function deleteTransaction(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/profile/delete_spend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, category, transaction })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(`Transaction ${transaction} deleted successfully from category ${category}`);
                setTransactions(transactions.filter(trans => trans !== transaction));
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className='grid w-max text-center' onSubmit={deleteTransaction}>
            <label>בחר קטגוריה</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">בחר קטגוריה</option>
                {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                ))}
            </select>
            <label>בחר עסקה</label>
            <select value={transaction} onChange={(e) => setTransaction(e.target.value)}>
                <option value="">בחר עסקה</option>
                {transactions.map((trans, index) => (
                    <option key={index} value={trans}>{trans}</option>
                ))}
            </select>
            <input type="submit" value="מחק עסקה" />
        </form>
    );
}