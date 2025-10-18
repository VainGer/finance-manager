import { memo } from 'react';
import { formatDate } from '../../../utils/budgetUtils';
import useBudgets from '../../../hooks/useBudgets';
import Overlay from '../../common/Overlay';

// פונקציית עזר לפרמוט תאריכים
const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('he-IL', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
};

const Categories = memo(function Categories({ categoryBudgets, onChange, onToggle, remainingAmount }) {
    return (
        <div className="space-y-4" dir="rtl">
            {/* תקציב נותר */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-blue-800">תקציב נותר:</span>
                    <span className={`font-bold ${remainingAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {remainingAmount.toLocaleString('he-IL')} ₪
                    </span>
                </div>
                {remainingAmount < 0 && (
                    <p className="text-red-600 text-xs mt-1">⚠️ חרגת מהתקציב המתוכנן</p>
                )}
            </div>

            {categoryBudgets.map((category, index) => {
                const categoryAmount = parseFloat(category.budget) || 0;
                const hasValue = categoryAmount > 0;
                const isIncluded = category.include ?? true;
                
                return (
                    <div
                        key={category.name ?? index}
                        className={`border p-4 rounded-xl transition-all duration-200 ${
                            isIncluded ? 'bg-slate-50 border-slate-200' : 'bg-gray-50 border-gray-200 opacity-75'
                        }`}
                    >
                        {/* כותרת הקטגוריה עם טוגל */}
                        <div className="flex items-center justify-between mb-3">
                            <label
                                htmlFor={`category-${category.name ?? index}`}
                                className={`font-semibold ${isIncluded ? 'text-slate-800' : 'text-gray-500'}`}
                            >
                                {category.name}
                            </label>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-600">כלול בתקציב</span>
                                <input
                                    type="checkbox"
                                    checked={isIncluded}
                                    onChange={(e) => onToggle(index, e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                />
                            </div>
                        </div>

                        {/* שדה הסכום */}
                        <div className="relative">
                            <input
                                type="number"
                                inputMode="decimal"
                                id={`category-${category.name ?? index}`}
                                value={category.budget}
                                placeholder="0.00"
                                onChange={(e) => onChange(index, e.target.value)}
                                disabled={!isIncluded}
                                className={`w-full px-4 py-3 bg-white border rounded-xl text-right font-medium text-lg focus:outline-none focus:ring-2 transition-all ${
                                    isIncluded 
                                        ? 'border-slate-300 focus:ring-blue-500 focus:border-blue-500' 
                                        : 'border-gray-300 opacity-50 cursor-not-allowed bg-gray-50'
                                }`}
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">₪</div>
                        </div>

                        {/* הודעות מצב */}
                        {isIncluded && (
                            <div className="mt-2">
                                {hasValue ? (
                                    <p className="text-green-600 text-xs flex items-center gap-1">
                                        ✅ הוקצה {categoryAmount.toLocaleString('he-IL')} ₪
                                    </p>
                                ) : (
                                    <p className="text-amber-600 text-xs flex items-center gap-1">
                                        ⏳ ממתין להקצאת תקציב
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
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
        categoryBudgets, handleCategoryBudgetChange, handleCategoryIncludeToggle,
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
        deleteBudget,
        // AI Smart Budget features
        setPrefillNextBudget,
        adviceToPrefill,
        setAdviceToPrefill
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

            {/* AI Smart Budget Suggestion Overlay - Same as mobile app */}
            {adviceToPrefill && (
                <Overlay visible={adviceToPrefill} onClose={() => setAdviceToPrefill(false)}>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-3">
                            תקציב חכם מומלץ
                        </h3>
                        <p className="text-slate-600 text-center mb-6 leading-6 dir-rtl" dir="rtl">
                            ניתוח ההוצאות החכם שלך מציע תקציב חדש מבוסס על ההוצאות האחרונות.<br />
                            האם תרצה שנמלא עבורך את הנתונים?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setPrefillNextBudget(true);
                                    setAdviceToPrefill(false);
                                }}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-colors"
                            >
                                כן, אני מעוניין
                            </button>
                            <button
                                onClick={() => setAdviceToPrefill(false)}
                                className="flex-1 bg-gray-300 hover:bg-gray-400 text-slate-700 py-3 rounded-xl font-semibold transition-colors"
                            >
                                לא, אעדיף ידנית
                            </button>
                        </div>
                    </div>
                </Overlay>
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
                    <div className="bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200 rounded-xl p-5" dir="rtl">
                        <h3 className="font-bold text-slate-800 mb-3 text-lg">
                            🗓️ הגדרת תקציב לתקופה: {formatDateDisplay(startDate)} - {formatDateDisplay(endDate)}
                        </h3>
                        <div className="bg-white rounded-lg p-3 border border-slate-200 mb-3">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-600 font-medium">תקציב כולל:</span>
                                <span className="text-2xl font-bold text-slate-800">{parseFloat(amount || 0).toLocaleString('he-IL')} ₪</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-600 font-medium">הוקצה עד כה:</span>
                                <span className="text-lg font-semibold text-blue-600">
                                    {(parseFloat(amount || 0) - remainingAmount).toLocaleString('he-IL')} ₪
                                </span>
                            </div>
                        </div>
                        
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm text-amber-800 flex items-center gap-2">
                                💡 <strong>טיפ:</strong> קטגוריות ללא תקציב יהפכו לקטגוריות "הוצאות בלתי צפויות"
                            </p>
                        </div>
                    </div>

                    <form onSubmit={async (e) => { 
                        e.preventDefault(); 
                        const success = await create();
                        if (success) {
                            // סגירת הטופס אחרי יצירה מוצלחת
                            setTimeout(() => {
                                goBack();
                            }, 2500);
                        }
                    }} className="space-y-6">
                        <div className="space-y-3">
                            <h4 className="font-semibold text-slate-800">תקציב קטגוריות:</h4>
                            <Categories
                                categoryBudgets={categoryBudgets}
                                onChange={handleCategoryBudgetChange}
                                onToggle={handleCategoryIncludeToggle}
                                remainingAmount={remainingAmount}
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
                                type="submit"
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
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
