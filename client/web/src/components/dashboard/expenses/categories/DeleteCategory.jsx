import { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { del } from '../../../../utils/api';
import CategorySelect from './CategorySelect';

export default function DeleteCategory({ goBack }) {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { profile } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedCategory.trim() === '') {
            setError('אנא בחר קטגוריה למחיקה');
            return;
        }
        // Show confirmation dialog instead of immediately deleting
        setShowConfirm(true);
        setError(null);
    };

    const deleteCategory = async () => {
        setLoading(true);
        try {
            const response = await del(`expenses/category/delete/${profile.expenses}/${selectedCategory}`);
            if (response.ok) {
                setError(null);
                setSuccess('הקטגוריה נמחקה בהצלחה');
                setTimeout(() => {
                    goBack();
                }, 1500);
            } else {
                setShowConfirm(false);
                setError('אירעה שגיאה בעת מחיקת הקטגוריה, נסה שוב מאוחר יותר');
                console.error('Error deleting category:', response.error);
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
        <div className="p-6 bg-white/95 backdrop-blur-sm">
            {showConfirm ? (
                <div className="space-y-6">
                    {/* Confirmation Header */}
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">אישור מחיקת קטגוריה</h2>
                    </div>

                    {/* Warning Message */}
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                        <div className="text-center space-y-3">
                            <p className="text-red-800 font-semibold">
                                האם אתה בטוח שברצונך למחוק את הקטגוריה "{selectedCategory}"?
                            </p>
                            <div className="bg-red-100 rounded-lg p-4">
                                <p className="text-red-700 text-sm font-medium">
                                    ⚠️ פעולה זו אינה ניתנת לביטול
                                </p>
                                <p className="text-red-600 text-sm mt-1">
                                    כל התקציבים וההוצאות המשויכים לקטגוריה זו יימחקו לצמיתות
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={cancelDelete}
                            disabled={loading}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-colors"
                        >
                            ביטול
                        </button>
                        <button
                            type="button"
                            onClick={deleteCategory}
                            disabled={loading}
                            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2 justify-center">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    מוחק...
                                </div>
                            ) : (
                                'כן, מחק קטגוריה'
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Error Alert */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-700 text-sm font-medium">{error}</p>
                        </div>
                    )}
                    
                    {/* Success Alert */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-green-700 text-sm font-medium">{success}</p>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
                        {/* Warning Section */}
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
                            <svg className="w-5 h-5 text-orange-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <div>
                                <p className="text-orange-800 text-sm font-medium mb-1">זהירות - פעולה בלתי הפיכה</p>
                                <p className="text-orange-700 text-sm">מחיקת קטגוריה תמחק את כל הנתונים הקשורים אליה</p>
                            </div>
                        </div>
                        
                        {/* Category Selection */}
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-slate-800 text-right">בחר קטגוריה למחיקה</label>
                            <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                                <CategorySelect refId={profile.expenses} setSelectedCategory={setSelectedCategory} />
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={goBack}
                                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-colors"
                            >
                                ביטול
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                            >
                                המשך למחיקה
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}