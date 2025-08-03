import { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { post } from '../../../../utils/api';

export default function AddCategory({ goBack }) {

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
            const response = await post('expenses/create-category', {
                refId: profile.expenses,
                name: categoryName.trim()
            });

            if (response.ok) {
                setError(null);
                setSuccess('הקטגוריה נוספה בהצלחה');
                setCategoryName('');
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
        <div className="p-4 border rounded-lg shadow-sm bg-white">
            <form onSubmit={addCategory} className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">הוספת קטגוריה</h2>

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

                <div>
                    <input
                        type="text"
                        placeholder="שם הקטגוריה"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="w-full px-4 py-2 text-right border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 font-semibold text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'מוסיף...' : 'הוסף קטגוריה'}
                    </button>

                    <button
                        type="button"
                        onClick={goBack}
                        className="w-full py-2 px-4 font-semibold text-gray-700 bg-gray-200 rounded-md shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        ביטול
                    </button>
                </div>
            </form>
        </div>
    );
}