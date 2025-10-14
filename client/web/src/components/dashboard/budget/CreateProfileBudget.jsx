import { memo } from 'react';
import { formatDate } from '../../../utils/budgetUtils';
import useBudgets from '../../../hooks/useBudgets';

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

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSubmit(); }} dir="rtl">
                {!profile.parentProfile ? (
                    <div className="space-y-3">
                        <label htmlFor="date-select" className="block text-sm font-semibold text-slate-800 text-right">
                            להמשך בחר תקציב שאותו תרצה לערוך:
                        </label>
                        <select
                            id="date-select"
                            value={selectedChildBudget ?? ""}
                            onChange={(e) => onChildSelect(Number(e.target.value))}
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
    const {
        account,
        profile,
        startDate, setStartDate,
        endDate, setEndDate,
        amount, setAmount,
        categoryBudgets, handleCategoryBudgetChange,
        childrenBudgets,
        selectedChildBudget, handleChildBudgetSelect,
        error, setError,
        success, setSuccess,
        validDates, setValidDates,
        remainingAmount,
        setDatesAndSum,
        create,
        resetState,
        childrenProfiles,
        addChildBudget,
        profileBudgets,
        deleteBudget
    } = useBudgets({ setLoading: () => { } });

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

                    <form onSubmit={(e) => { e.preventDefault(); create(); }} className="space-y-6">
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
