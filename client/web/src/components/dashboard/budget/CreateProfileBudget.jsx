import { useState, useEffect, useCallback } from 'react';
import { post, get } from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';

export default function CreateProfileBudget() {
    const { account, profile } = useAuth();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [amount, setAmount] = useState(0);
    const [categoryBudgets, setCategoryBudgets] = useState([]);
    const [remainingAmount, setRemainingAmount] = useState(0);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [validDates, setValidDates] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            if (profile && profile.expenses) {
                const response = await get(`expenses/category/get-names/${profile.expenses}`);
                if (response.ok) {
                    setCategoryBudgets(response.categoriesNames.map(cat => ({ name: cat, budget: '' })));
                } else {
                    setError('Failed to load categories');
                }
            }
        };
        fetchCategories();
    }, [profile]);

    useEffect(() => {
        const totalSpent = categoryBudgets.reduce((total, category) => total + (parseFloat(category.budget) || 0), 0);
        const totalAmount = parseFloat(amount) || 0;
        setRemainingAmount(totalAmount - totalSpent);
    }, [amount, categoryBudgets]);

    const setDatesAndSum = async (e) => {
        e.preventDefault();
        if (!startDate || !endDate || !amount) {
            setError('אנא מלא את כל השדות');
            return;
        }
        const response = await post('profile/check-budget-dates',
            { username: account.username, profileName: profile.profileName, startDate, endDate });
        if (response.ok) {
            setValidDates(response.isValid);
            setError(null);
        } else {
            setError('תקופת תקציב בתאריכים שהוזנו כבר קיימת');
            setStartDate('');
            setEndDate('');
        }
    }

    const handleCategoryBudgetChange = (index, value) => {
        const newCategoryBudgets = [...categoryBudgets];
        newCategoryBudgets[index].budget = value;
        setCategoryBudgets(newCategoryBudgets);
    };

    const create = async (e) => {
        e.preventDefault();
        const finalCategoryBudgets = [];
        categoryBudgets.forEach(cat => {
            cat.budget != 0 ? finalCategoryBudgets.push({
                categoryName: cat.name,
                amount: parseFloat(cat.budget) || 0
            }) : null;
        });

        const response = await post('profile/add-budget',
            {
                budgetData: {
                    username: account.username,
                    profileName: profile.profileName,
                    refId: profile.expenses,
                    profileBudget: {
                        startDate,
                        endDate,
                        amount: parseFloat(amount) || 0,
                        spent: 0
                    },
                    categoriesBudgets: finalCategoryBudgets
                }
            });
        console.log(response)
        if (response.ok) {
            setSuccess('Budget created successfully!');
        } else {
            setError('Failed to create budget.');
        }
    }

    const dateSelect = (
        <form>
            {error && <p className="text-red-500">{error}</p>}
            <label htmlFor="start-date">תאריך התחלה:</label>
            <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />
            <label htmlFor="end-date">תאריך סוף:</label>
            <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />
            <input type="number" name="amount" id="amount" placeholder='הזן את סכום התקציב'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={setDatesAndSum} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                בדוק תאריכים
            </button>
        </form>)

    const categories = (<>
        {categoryBudgets.map((category, index) => (
            <div key={category.name} className="mb-2">
                <label htmlFor={`category-${category.name}`}>{category.name}</label>
                <input
                    type="number"
                    id={`category-${category.name}`}
                    value={category.budget}
                    placeholder="0"
                    onChange={(e) => handleCategoryBudgetChange(index, e.target.value)}
                />
            </div>
        ))}
    </>)

    return (
        <div>
            {success && <p className="text-green-500">{success}</p>}
            {!validDates && dateSelect}
            {validDates && (
                <form onSubmit={create}>
                    <p>הגדרת תקציב לתאריכים: {startDate} - {endDate}</p>
                    {remainingAmount >= 0 ? (<p>סכום פנוי: {remainingAmount}</p>)
                        : (<p>הסכום חורג ב - {Math.abs(remainingAmount)}</p>)}
                    {categories}
                    <button disabled={remainingAmount < 0} type="submit"
                        className={`mt-2 ${remainingAmount < 0 ? 'bg-gray-500' : 'bg-green-500'} text-white px-4 py-2 rounded`}>
                        צור תקציב
                    </button>
                </form>
            )}
        </div>
    )
}