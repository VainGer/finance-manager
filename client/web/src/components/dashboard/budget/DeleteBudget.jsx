import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useProfileData } from '../../../context/ProfileDataContext';
import { del } from '../../../utils/api';

export default function DeleteBudget({ goBack }) {
    const { account, profile } = useAuth();
    const { profileBudgets, fetchBudgets } = useProfileData();

    const [selectedBudgetId, setSelectedBudgetId] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const selectedBudget = profileBudgets.find(budget => budget._id === selectedBudgetId);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedBudgetId) {
            setError('אנא בחר תקציב למחיקה');
            return;
        }
        setShowConfirm(true);
        setError('');
    };

    const deleteBudget = async () => {
        setLoading(true);
        try {
            const response = await del(
                `budgets/delete-budget/${encodeURIComponent(account.username)}/${encodeURIComponent(profile.profileName)}/${encodeURIComponent(selectedBudgetId)}`
            );

            if (response.ok) {
                setError('');
                setSuccess('התקציב נמחק בהצלחה');
                await fetchBudgets(); // רענון הנתונים
                setTimeout(() => {
                    goBack();
                }, 1500);
            } else {
                setShowConfirm(false);
                setError('אירעה שגיאה בעת מחיקת התקציב, נסה שוב מאוחר יותר');
                console.error('Error deleting budget:', response.error);
            }
        } catch (err) {
            setShowConfirm(false);
            setError('תקשורת עם השרת נכשלה');
            console.error('Network error:', err);
        } finally {
            setLoading(false);
        }
    };

    const cancelDelete = () => {
        setShowConfirm(false);
    };

    return (
        <div className="p-6 bg-white/95 backdrop-blur-sm" dir="rtl">
            {/* Error Alert */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 mb-6">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
            )}

            {/* Success Alert */}
            {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 mb-6">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-700 text-sm font-medium">{success}</p>
                </div>
            )}

            {!showConfirm ? (
                <form onSubmit={handleSubmit}>
                    {/* Title */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">מחיקת תקציב</h2>
                        <p className="text-slate-600">בחר תקציב למחיקה מהרשימה</p>
                    </div>

                    {/* Budget Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                            בחר תקציב למחיקה:
                        </label>

                        {profileBudgets.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                                <p>אין תקציבים זמינים למחיקה</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {profileBudgets.map((budget) => {
                                    const startDate = new Date(budget.startDate).toLocaleDateString('he-IL');
                                    const endDate = new Date(budget.endDate).toLocaleDateString('he-IL');

                                    return (
                                        <label
                                            key={budget._id}
                                            className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedBudgetId === budget._id
                                                    ? 'border-red-300 bg-red-50'
                                                    : 'border-slate-200 bg-white hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="budget"
                                                    value={budget._id}
                                                    checked={selectedBudgetId === budget._id}
                                                    onChange={(e) => setSelectedBudgetId(e.target.value)}
                                                    className="w-4 h-4 text-red-600 border-slate-300 focus:ring-red-500"
                                                />
                                                <div className="mr-3 flex-1">
                                                    <div className="font-medium text-slate-900">
                                                        {startDate} - {endDate}
                                                    </div>
                                                    <div className="text-sm text-slate-500">
                                                        תקציב: ₪{budget.amount?.toLocaleString()} |
                                                        הוצא: ₪{budget.spent?.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    {profileBudgets.length > 0 && (
                        <button
                            type="submit"
                            disabled={!selectedBudgetId || loading}
                            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${selectedBudgetId && !loading
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                }`}
                        >
                            {loading ? 'מוחק...' : 'מחק תקציב'}
                        </button>
                    )}
                </form>
            ) : (
                /* Confirmation Dialog */
                <div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">אישור מחיקה</h2>
                        <p className="text-slate-600">האם אתה בטוח שברצונך למחוק את התקציב הנבחר?</p>
                    </div>

                    {selectedBudget && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <h3 className="font-medium text-red-800 mb-2">פרטי התקציב למחיקה:</h3>
                            <div className="text-sm text-red-700 space-y-1">
                                <p><strong>תקופה:</strong> {new Date(selectedBudget.startDate).toLocaleDateString('he-IL')} - {new Date(selectedBudget.endDate).toLocaleDateString('he-IL')}</p>
                                <p><strong>סכום תקציב:</strong> ₪{selectedBudget.amount?.toLocaleString()}</p>
                                <p><strong>הוצא:</strong> ₪{selectedBudget.spent?.toLocaleString()}</p>
                            </div>
                        </div>
                    )}

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-yellow-500 mt-0.5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <div className="text-yellow-800 text-sm">
                                <p className="font-medium mb-1">שים לב:</p>
                                <p>מחיקת התקציב תמחק רק את מסגרת התקציב. כל הנתונים וההוצאות שלך יישארו שמורים.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={cancelDelete}
                            className="flex-1 px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
                        >
                            ביטול
                        </button>
                        <button
                            type="button"
                            onClick={deleteBudget}
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? 'מוחק...' : 'כן, מחק'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}