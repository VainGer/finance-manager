import { useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { put } from "../../../../utils/api";
import CategorySelect from "./CategorySelect";

export default function RenameCategory({ goBack }) {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const { profile } = useAuth();

    const editCategory = async (e) => {
        e.preventDefault();
        
        if (!selectedCategory) {
            setError('אנא בחר קטגוריה לשינוי');
            return;
        }
        
        if (!newCategoryName || newCategoryName.trim() === '') {
            setError('אנא הזן שם חדש לקטגוריה');
            return;
        }
        
        if (selectedCategory === newCategoryName) {
            setError('השם החדש זהה לשם הנוכחי');
            return;
        }
        
        setLoading(true);
        try {
            const response = await put('expenses/category/rename', { 
                refId: profile.expenses, 
                oldName: selectedCategory,
                newName: newCategoryName.trim() 
            });
            
            if (response.ok) {
                setError(null);
                setSuccess('הקטגוריה עודכנה בהצלחה');
                setNewCategoryName('');
                setSelectedCategory('');
                
                // Auto-hide success message after 3 seconds
                setTimeout(() => {
                    setSuccess(null);
                    goBack();
                }, 1500);
            } else if (response.status === 400) {
                setError('שם הקטגוריה כבר קיים');
            } else {
                setError('אירעה שגיאה בעת עדכון הקטגוריה, נסה שוב מאוחר יותר');
                console.error('Error editing category:', response.error);
            }
        } catch (err) {
            setError('תקשורת עם השרת נכשלה');
            console.error('Network error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white/95 backdrop-blur-sm">
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-green-700 text-sm font-medium">{success}</p>
                </div>
            )}
            
            <form onSubmit={editCategory} className="space-y-6" dir="rtl">
                {/* Category Selection */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-800 text-right">בחר קטגוריה לעריכה</label>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                        <CategorySelect 
                            refId={profile.expenses} 
                            setSelectedCategory={setSelectedCategory} 
                        />
                    </div>
                </div>
                
                {/* Current Category Display */}
                {selectedCategory && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-right">
                        <p className="text-blue-700 text-sm">
                            <strong>קטגוריה נוכחית:</strong> {selectedCategory}
                        </p>
                    </div>
                )}
                
                {/* New Name Input */}
                <div className="space-y-3">
                    <label htmlFor="newCategoryName" className="block text-sm font-semibold text-slate-800 text-right">
                        שם חדש לקטגוריה
                    </label>
                    <input 
                        type="text" 
                        id="newCategoryName"
                        placeholder="הכנס שם חדש לקטגוריה..." 
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-right"
                        required
                    />
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
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2 justify-center">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                מעדכן...
                            </div>
                        ) : (
                            'שמור שינויים'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}