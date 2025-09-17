import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { formatDate } from '../../../utils/budgetUtils';
import { post, get } from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';

const Categories = memo(function Categories({ categoryBudgets, onChange }) {
    return (
        <div className="space-y-3">
            {categoryBudgets.map((category, index) => (
                <div
                    key={category.name ?? index}
                    className="flex items-center justify-between bg-slate-50 border border-slate-200 p-4 rounded-xl"
                >
                    <label
                        htmlFor={`category-${category.name ?? index}`}
                        className="font-semibold text-slate-800"
                    >
                        {category.name}
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            inputMode="decimal"
                            id={`category-${category.name ?? index}`}
                            value={category.budget}
                            placeholder="0.00"
                            onChange={(e) => onChange(index, e.target.value)}
                            className="w-32 px-3 py-2 bg-white border border-slate-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent font-medium"
                        />
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">₪</div>
                    </div>
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
        <div className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
            )}

            <form className="space-y-6" onSubmit={onSubmit} dir="rtl">
                {!profile.parentProfile ? (
                    <div className="space-y-3">
                        <label htmlFor="date-select" className="block text-sm font-semibold text-slate-800 text-right">
                            להמשך בחר תקציב שאותו תרצה לערוך:
                        </label>
                        <select
                            id="date-select"
                            value={selectedChildBudget ?? ""}
                            onChange={onChildSelect}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-right"
                        >
                            <option value="">בחר תאריך</option>
                            {childrenBudgets.map((budget, index) => (
                                <option key={index} value={index}>
                                    תאריך התחלה: {formatDate(budget.startDate)} - תאריך סיום: {formatDate(budget.endDate)} - סכום: {budget.amount}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="start-date" className="block text-sm font-semibold text-slate-800 text-right">
                                תאריך התחלה:
                            </label>
                            <input
                                type="date"
                                id="start-date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-right"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="end-date" className="block text-sm font-semibold text-slate-800 text-right">
                                תאריך סוף:
                            </label>
                            <input
                                type="date"
                                id="end-date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-right"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="amount" className="block text-sm font-semibold text-slate-800 text-right">
                                סכום התקציב:
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    name="amount"
                                    id="amount"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-right font-medium"
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">₪</div>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                    המשך
                </button>
            </form>
        </div>
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
                `budgets/get-child-budgets?username=${account.username}&profileName=${profile.profileName}`
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

        const response = await post('budgets/check-budget-dates', {
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

        const response = await post('budgets/add-budget', {
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
        <div className="p-6 bg-white/95 backdrop-blur-sm">
            {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 mb-6">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-green-700 text-sm font-medium">{success}</p>
                </div>
            )}

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
                <div className="space-y-6">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <h3 className="font-semibold text-slate-800 mb-2">
                            הגדרת תקציב לתאריכים: {startDate} - {endDate}
                        </h3>
                        {remainingAmount >= 0 ? (
                            <p className="text-slate-600 flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                סכום פנוי: ₪{remainingAmount}
                            </p>
                        ) : (
                            <p className="text-red-600 flex items-center gap-2">
                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                הסכום חורג ב - ₪{Math.abs(remainingAmount)}
                            </p>
                        )}
                    </div>

                    <form onSubmit={create} className="space-y-6">
                        <div className="space-y-3">
                            <h4 className="font-semibold text-slate-800">תקציב קטגוריות:</h4>
                            <Categories
                                categoryBudgets={categoryBudgets}
                                onChange={handleCategoryBudgetChange}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={goBack}
                                type="button"
                                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-colors"
                            >
                                ביטול
                            </button>
                            <button
                                disabled={remainingAmount !== 0}
                                type="submit"
                                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-colors ${remainingAmount !== 0
                                        ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                            >
                                צור תקציב
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {!validDates && (
                <div className="pt-4">
                    <button
                        onClick={goBack}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                        ביטול
                    </button>
                </div>
            )}
        </div>
    );
}
