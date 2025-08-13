import { useState, useEffect, useCallback } from 'react';
import { post, get } from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../common/Button';

export default function CreateProfileBudget({ goBack }) {
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
            <Button onClick={setDatesAndSum} style="primary" size="auto" className="mt-2">
                המשך
            </Button>
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
        <div className="w-full h-full flex items-center justify-center p-4">
            <div className="p-6 bg-white rounded-xl shadow-lg w-full max-w-md mx-auto border border-gray-100">
                <div className="text-center mb-6">
                    <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">יצירת תקציב פרופיל</h2>
                    <p className="text-sm text-gray-600 mt-1">הגדר תקציב כללי ופילוג לקטגוריות</p>
                </div>

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
                        {success}
                    </div>
                )}

                {!validDates ? (
                    <form className="space-y-4">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}
                        
                        <div>
                            <label htmlFor="start-date" className="block text-sm font-semibold text-gray-700 mb-2">תאריך התחלה</label>
                            <input
                                type="date"
                                id="start-date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-3 text-right border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="end-date" className="block text-sm font-semibold text-gray-700 mb-2">תאריך סיום</label>
                            <input
                                type="date"
                                id="end-date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-3 text-right border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">סכום התקציב הכולל</label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <span className="text-gray-500 text-sm">₪</span>
                                </div>
                                <input 
                                    type="number" 
                                    name="amount" 
                                    id="amount" 
                                    placeholder='הזן את סכום התקציב הכולל'
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full pl-10 px-4 py-3 text-right border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-3 pt-4">
                            <Button onClick={goBack} style="secondary" size="medium" className="flex-1">
                                חזור
                            </Button>
                            <Button onClick={setDatesAndSum} style="primary" size="medium" className="flex-1">
                                המשך
                            </Button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={create} className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <p className="text-sm font-medium text-blue-800">תקופת התקציב: {startDate} - {endDate}</p>
                            {remainingAmount >= 0 ? (
                                <p className="text-sm text-blue-700 mt-1">💰 סכום פנוי: ₪{remainingAmount.toLocaleString()}</p>
                            ) : (
                                <p className="text-sm text-red-700 mt-1">⚠️ הסכום חורג ב-₪{Math.abs(remainingAmount).toLocaleString()}</p>
                            )}
                        </div>
                        
                        <div className="space-y-3">
                            <h4 className="text-lg font-semibold text-gray-800 mb-3">פילוג לקטגוריות</h4>
                            {categoryBudgets.map((category, index) => (
                                <div key={category.name} className="space-y-2">
                                    <label htmlFor={`category-${category.name}`} className="block text-sm font-semibold text-gray-700">
                                        {category.name}
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                            <span className="text-gray-500 text-sm">₪</span>
                                        </div>
                                        <input
                                            type="number"
                                            id={`category-${category.name}`}
                                            value={category.budget}
                                            placeholder="0"
                                            onChange={(e) => handleCategoryBudgetChange(index, e.target.value)}
                                            className="w-full pl-10 px-4 py-3 text-right border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="flex gap-3 pt-4">
                            <Button 
                                onClick={goBack} 
                                style="secondary" 
                                size="medium" 
                                className="flex-1"
                            >
                                חזור
                            </Button>
                            <Button 
                                type="submit"
                                disabled={remainingAmount !== 0}
                                style={remainingAmount !== 0 ? "secondary" : "primary"}
                                size="medium"
                                className="flex-1"
                            >
                                צור תקציב
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}