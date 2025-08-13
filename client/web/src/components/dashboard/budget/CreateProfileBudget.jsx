import { useState, useEffect, useCallback } from 'react';
import { post, get } from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';
import ErrorMessage from '../../common/ErrorMessage';
export default function CreateProfileBudget({ goBack }) {
    const { account, profile } = useAuth();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [amount, setAmount] = useState(0);
    const [categoryBudgets, setCategoryBudgets] = useState([]);
    const [remainingAmount, setRemainingAmount] = useState(0);
    const [childrenBudgets, setChildrenBudgets] = useState([]);
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

    const fetchBudgetsForChildren = async () => {
        try {
            const response = await get(`profile/get-child-budgets?username=${account.username}&profileName=${profile.profileName}`);
            if (response.ok) {
                setChildrenBudgets(response.budgets);
            }
        } catch (error) {
            console.error('Error fetching budgets:', error);
        }
    };

    useEffect(() => {
        if (!profile.parentProfile)
            fetchBudgetsForChildren();
    }, [account, profile]);

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
        if (response.ok) {
            setSuccess('Budget created successfully!');
        } else {
            setError('Failed to create budget.');
        }
    }

    const dateSelect = (
        <form className="space-y-4 p-4 bg-gray-100 rounded-lg shadow-md">
            {error && <ErrorMessage message={error} />}
            {profile.parentProfile && <><div className="flex flex-col">
                <label htmlFor="start-date" className="mb-2 font-semibold text-gray-700">תאריך התחלה:</label>
                <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
                <div className="flex flex-col">
                    <label htmlFor="end-date" className="mb-2 font-semibold text-gray-700">תאריך סוף:</label>
                    <input
                        type="date"
                        id="end-date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="amount" className="mb-2 font-semibold text-gray-700">סכום תקציב:</label>
                    <input type="number" name="amount" id="amount" placeholder='הזן את סכום התקציב'
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div></>}
            {!profile.parentProfile && <div className="flex flex-col">
                <label htmlFor="child-profiles" className="mb-2 font-semibold text-gray-700">בחר את התקציב שאותו תרצה לחלק:</label>
                <select onChange={(e) => {
                    const index = e.target.value;
                    setAmount(childrenBudgets[index].amount);
                    setStartDate(childrenBudgets[index].startDate);
                    setEndDate(childrenBudgets[index].endDate);
                }}>
                    <option value="">בחר תקציב</option>
                    {childrenBudgets.map((budget, index) => {
                        return (
                            <option key={index} value={index}>
                                תאריך התחלה: {budget.startDate} - תאריך סיום: {budget.endDate} - סכום: {budget.amount}
                            </option>
                        );
                    })}
                </select>
            </div>}
            <button onClick={setDatesAndSum} className="w-full mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                המשך
            </button>
        </form>
    );

    const categories = (
        <div className="space-y-4">
            {categoryBudgets.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                    <label htmlFor={`category-${category.name}`} className="font-medium text-gray-800">{category.name}</label>
                    <input
                        type="number"
                        id={`category-${category.name}`}
                        value={category.budget}
                        placeholder="0"
                        onChange={(e) => handleCategoryBudgetChange(index, e.target.value)}
                        className="w-32 p-2 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            ))}
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">יצירת תקציב חדש</h2>
            {success && <p className="text-green-600 bg-green-100 p-3 mb-4 rounded-md text-center">{success}</p>}

            {!validDates ? dateSelect : (
                <form onSubmit={create} className="space-y-6">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-lg font-semibold text-center text-gray-700">
                            הגדרת תקציב לתאריכים: <span className="text-blue-600">{startDate}</span> - <span className="text-blue-600">{endDate}</span>
                        </p>
                        <div className={`text-center font-medium p-2 rounded-md mt-4 ${remainingAmount >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {remainingAmount >= 0 ? `סכום פנוי: ${remainingAmount.toLocaleString()}`
                                : `הסכום חורג ב - ${Math.abs(remainingAmount).toLocaleString()}`}
                        </div>
                    </div>

                    <div className="space-y-4">{categories}</div>

                    <button
                        disabled={remainingAmount !== 0}
                        type="submit"
                        className={`w-full mt-4 py-3 px-4 rounded-md text-white font-semibold transition-all ${remainingAmount !== 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                    >
                        צור תקציב
                    </button>
                </form>
            )}

            <button onClick={goBack} className="w-full mt-4 bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors">
                חזור
            </button>
        </div>
    )
}