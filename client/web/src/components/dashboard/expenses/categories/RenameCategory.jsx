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
        <div className="p-4 border rounded-lg shadow-sm bg-white">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">עריכת שם קטגוריה</h2>
            
            {error && (
                <p className="text-sm text-center text-red-600 bg-red-100 border border-red-400 rounded-md py-2 px-4 mb-4">
                    {error}
                </p>
            )}
            
            {success && (
                <p className="text-sm text-center text-green-600 bg-green-100 border border-green-400 rounded-md py-2 px-4 mb-4">
                    {success}
                </p>
            )}
            
            <form onSubmit={editCategory} className="space-y-4">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">בחר קטגוריה</label>
                    <CategorySelect 
                        refId={profile.expenses} 
                        setSelectedCategory={setSelectedCategory} 
                    />
                </div>
                
                <div>
                    <label htmlFor="newCategoryName" className="block text-sm font-medium text-gray-700 mb-1">
                        שם חדש לקטגוריה
                    </label>
                    <input 
                        type="text" 
                        id="newCategoryName"
                        placeholder="הזן שם חדש לקטגוריה" 
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="w-full px-4 py-2 text-right border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                
                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="button"
                        onClick={goBack}
                        className="w-full py-2 px-4 font-semibold text-gray-700 bg-gray-200 rounded-md shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        ביטול
                    </button>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 font-semibold text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'מעדכן...' : 'עדכן קטגוריה'}
                    </button>
                </div>
            </form>
        </div>
    );
}