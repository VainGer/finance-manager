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
        <div className="p-4 border rounded-lg shadow-sm bg-white">
            {showConfirm ? (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-center text-red-600">אישור מחיקת קטגוריה</h2>
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
                        <p className="text-center text-red-700">
                            האם אתה בטוח שברצונך למחוק את הקטגוריה "{selectedCategory}"?
                        </p>
                        <p className="text-center text-red-700 text-sm mt-2">
                            פעולה זו אינה ניתנת לביטול וכל התקציבים וההוצאות המשויכים לקטגוריה זו יימחקו.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={cancelDelete}
                            className="w-full py-2 px-4 font-semibold text-gray-700 bg-gray-200 rounded-md shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            disabled={loading}
                        >
                            ביטול
                        </button>
                        <button
                            type="button"
                            onClick={deleteCategory}
                            disabled={loading}
                            className="w-full py-2 px-4 font-semibold text-white bg-red-600 rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'מוחק...' : 'כן, מחק קטגוריה'}
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">מחיקת קטגוריה</h2>
                    
                    {error && (
                        <p className="text-sm text-center text-red-600 bg-red-100 border border-red-400 rounded-md py-2 px-4">
                            {error}
                        </p>
                    )}
                    
                    {success && (
                        <p className="text-sm text-center text-green-600 bg-green-100 border border-green-400 rounded-md py-2 px-4">
                            {success}
                        </p>
                    )}
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">בחר קטגוריה למחיקה</label>
                        <CategorySelect refId={profile.expenses} setSelectedCategory={setSelectedCategory} />
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={goBack}
                            className="w-full py-2 px-4 font-semibold text-gray-700 bg-gray-200 rounded-md shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            ביטול
                        </button>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 font-semibold text-white bg-red-600 rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            המשך למחיקה
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}