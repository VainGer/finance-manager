import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { formatDate } from '../../../utils/budgetUtils';
import { post, get } from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';

const Categories = memo(function Categories({ categoryBudgets, onChange }) {
    return (
        <div className="grid gap-3">
            {categoryBudgets.map((category, index) => (
                <div
                    key={category.name ?? index}
                    className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm"
                >
                    <label
                        htmlFor={`category-${category.name ?? index}`}
                        className="font-medium text-gray-800"
                    >
                        {category.name}
                    </label>
                    <input
                        type="number"
                        inputMode="decimal"
                        id={`category-${category.name ?? index}`}
                        value={category.budget}
                        onChange={(e) => onChange(index, e.target.value)}
                        className="w-32 p-2 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            ))}
        </div>
    );
});

const DateSelect = memo(function DateSelect({
    error,
    profile,
    childrenBudgets,
    selectedChildBudget,
    onChildSelect,
    startDate,
    endDate,
    amount,
    setStartDate,
    setEndDate,
    setAmount,
    onSubmit
}) {
    return (
        <form className="grid gap-2 p-4 bg-gray-50 rounded-lg shadow" onSubmit={onSubmit}>
            {error && <p className="text-red-500">{error}</p>}

            {!profile.parentProfile ? (
                <>
                    <label htmlFor="date-select">להמשך בחר תקציב שאותו תרצה לערוך:</label>
                    <select
                        id="date-select"
                        value={selectedChildBudget ?? ""}
                        onChange={onChildSelect}
                        className="p-2 border rounded"
                    >
                        <option value="">בחר תאריך</option>
                        {childrenBudgets.map((budget, index) => (
                            <option key={index} value={index}>
                                תאריך התחלה: {formatDate(budget.startDate)} - תאריך סיום: {formatDate(budget.endDate)} - סכום: {budget.amount}
                            </option>
                        ))}
                    </select>
                </>
            ) : (
                <>
                    <label htmlFor="start-date">תאריך התחלה:</label>
                    <input
                        type="date"
                        id="start-date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="p-2 border rounded"
                    />

                    <label htmlFor="end-date">תאריך סוף:</label>
                    <input
                        type="date"
                        id="end-date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="p-2 border rounded"
                    />

                    <input
                        type="number"
                        inputMode="decimal"
                        name="amount"
                        id="amount"
                        placeholder="הזן את סכום התקציב"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="p-2 border rounded"
                    />
                </>
            )}

            <button
                type="submit"
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
                המשך
            </button>
        </form>
    );
});


export default function CreateProfileBudget({ goBack }) {
    const { account, profile } = useAuth();

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [amount, setAmount] = useState('');
    const [categoryBudgets, setCategoryBudgets] = useState([]);
    const [childrenBudgets, setChildrenBudgets] = useState([]);
    const [selectedChildBudget, setSelectedChildBudget] = useState(null);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [validDates, setValidDates] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            if (profile?.expenses) {
                const response = await get(`expenses/category/get-names/${profile.expenses}`);
                if (response.ok) {
                    setCategoryBudgets(
                        response.categoriesNames.map((cat) => ({ name: cat, budget: '' }))
                    );
                } else {
                    setError('Failed to load categories');
                }
            }
        };
        fetchCategories();
    }, [profile]);

    const fetchBudgetsForChildren = useCallback(async () => {
        try {
            const response = await get(
                `profile/get-child-budgets?username=${account.username}&profileName=${profile.profileName}`
            );
            if (response.ok) {
                setChildrenBudgets(response.budgets);
            }
        } catch (err) {
            console.error('Error fetching budgets:', err);
        }
    }, [account.username, profile.profileName]);

    useEffect(() => {
        if (!profile.parentProfile) fetchBudgetsForChildren();
    }, [profile, fetchBudgetsForChildren]);

    const remainingAmount = useMemo(() => {
        const totalSpent = categoryBudgets.reduce(
            (total, category) => total + (parseFloat(category.budget) || 0),
            0
        );
        return (parseFloat(amount) || 0) - totalSpent;
    }, [categoryBudgets, amount]);

    const handleCategoryBudgetChange = useCallback((index, value) => {
        setCategoryBudgets((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], budget: value };
            return updated;
        });
    }, []);

    const handleChildBudgetSelect = useCallback((e) => {
        const index = Number(e.target.value);
        if (!isNaN(index)) {
            setSelectedChildBudget(index);
            const budget = childrenBudgets[index];
            setStartDate(budget.startDate);
            setEndDate(budget.endDate);
            setAmount(String(budget.amount));
        } else {
            setSelectedChildBudget(null);
        }
    }, [childrenBudgets]);

    const setDatesAndSum = useCallback(async (e) => {
        e.preventDefault();
        if (!startDate || !endDate || parseFloat(amount) <= 0) {
            setError('אנא מלא את כל השדות');
            return;
        }

        const response = await post('profile/check-budget-dates', {
            username: account.username,
            profileName: profile.profileName,
            startDate,
            endDate
        });

        if (response.ok) {
            if (response.isValid) {
                setValidDates(true);
                setError(null);
            } else {
                setError('תקופת תקציב בתאריכים שהוזנו כבר קיימת');
                setStartDate('');
                setEndDate('');
            }
        } else {
            setError('אירעה שגיאה בבדיקת התאריכים');
        }
    }, [account.username, profile.profileName, startDate, endDate, amount]);

    const create = useCallback(async (e) => {
        e.preventDefault();

        const finalCategoryBudgets = categoryBudgets
            .filter((cat) => parseFloat(cat.budget) > 0)
            .map((cat) => ({
                categoryName: cat.name,
                amount: parseFloat(cat.budget) || 0
            }));

        const response = await post('profile/add-budget', {
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
            setSuccess('התקציב נוצר בהצלחה!');
            setError(null);
        } else {
            setError('נכשל ביצירת התקציב.');
        }
    }, [account.username, profile.profileName, profile.expenses, startDate, endDate, amount, categoryBudgets]);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md max-w-lg h-3/4 overflow-auto mx-auto space-y-4">
            {success && <p className="text-green-500 font-semibold">{success}</p>}

            {!validDates && (
                <DateSelect
                    error={error}
                    profile={profile}
                    childrenBudgets={childrenBudgets}
                    selectedChildBudget={selectedChildBudget}
                    onChildSelect={handleChildBudgetSelect}
                    startDate={startDate}
                    endDate={endDate}
                    amount={amount}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    setAmount={setAmount}
                    onSubmit={setDatesAndSum}
                />
            )}

            {validDates && (
                <form onSubmit={create} className="space-y-4">
                    <p className="font-semibold">
                        הגדרת תקציב לתאריכים: {startDate} - {endDate}
                    </p>
                    {remainingAmount >= 0 ? (
                        <p className="text-gray-700">סכום פנוי: {remainingAmount}</p>
                    ) : (
                        <p className="text-red-500">הסכום חורג ב - {Math.abs(remainingAmount)}</p>
                    )}

                    <Categories
                        categoryBudgets={categoryBudgets}
                        onChange={handleCategoryBudgetChange}
                    />

                    <button
                        disabled={remainingAmount !== 0}
                        type="submit"
                        className={`mt-2 ${remainingAmount !== 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                            } text-white px-4 py-2 rounded`}
                    >
                        צור תקציב
                    </button>
                </form>
            )}

            <button
                onClick={goBack}
                className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            >
                חזור
            </button>
        </div>
    );
}
