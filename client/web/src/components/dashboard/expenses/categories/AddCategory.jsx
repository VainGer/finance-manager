import { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { post } from '../../../../utils/api';

export default function AddCategory({ goBack, onCategoryAdded }) {

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(false);
    const { profile, account } = useAuth();

    const addCategory = async (e) => {
        e.preventDefault();
        if (!categoryName || categoryName.trim() === '') {
            setError('אנא הזן שם קטגוריה');
            return;
        }

        setLoading(true);
        try {
            const response = await post('expenses/category/create', {
                refId: profile.expenses,
                name: categoryName.trim()
            });

            if (response.ok) {
                setError(null);
                setSuccess('הקטגוריה נוספה בהצלחה');
                setCategoryName('');
                if (onCategoryAdded) { onCategoryAdded(); }
                goBack();
                // Auto-hide success message after 3 seconds
                setTimeout(() => setSuccess(false), 3000);
            } else if (response.status === 400) {
                setError('שם הקטגוריה כבר קיים');
            } else {
                setError('אירעה שגיאה בעת הוספת הקטגוריה, נסה שוב מאוחר יותר');
                console.error('Error adding category:', response.error);
            }
        } catch (err) {
            setError('תקשורת עם השרת נכשלה');
            console.error('Network error:', err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-4 sm:p-6 bg-white/95 backdrop-blur-sm">
            {/* Error Alert */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 flex items-center gap-3 mb-4 sm:mb-6">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
            )}
            
            {/* Success Alert */}
            {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 mb-6">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-green-700 text-sm font-medium">{success}</p>
                </div>
            )}

            <form onSubmit={addCategory} className="space-y-6" dir="rtl">
                {/* Category Name Input */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-800 text-right">שם הקטגוריה</label>
                    <input
                        type="text"
                        placeholder="הכנס שם קטגוריה..."
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-right"
                        required
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                        type="button"
                        onClick={goBack}
                        className="w-full sm:flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                        ביטול
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 sm:px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2 justify-center">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                מוסיף...
                            </div>
                        ) : (
                            'הוסף קטגוריה'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}