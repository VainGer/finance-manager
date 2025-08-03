import { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { post } from '../../../../utils/api';
import CategorySelect from './CategorySelect';

export default function CreateBudget({ goBack }) {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [budgetAmount, setBudgetAmount] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const { profile } = useAuth();

    const createBudget = async (e) => {
        e.preventDefault();

        // Form validation
        if (!selectedCategory) {
            setError('אנא בחר קטגוריה');
            return;
        }

        if (!startDate) {
            setError('אנא בחר תאריך התחלה');
            return;
        }

        if (!endDate) {
            setError('אנא בחר תאריך סיום');
            return;
        }

        if (!budgetAmount || parseFloat(budgetAmount) <= 0) {
            setError('אנא הזן סכום תקציב חוקי');
            return;
        }

        // Check if end date is after start date
        if (new Date(endDate) <= new Date(startDate)) {
            setError('תאריך הסיום חייב להיות אחרי תאריך ההתחלה');
            return;
        }

        setLoading(true);
        try {
            const budget = {
                startDate,
                endDate,
                budgetAmount: parseFloat(budgetAmount),
                spent: 0
            };

            const response = await post('expenses/create-budget', { 
                refId: profile.expenses, 
                catName: selectedCategory, 
                budget 
            });
            
            if (response.ok) {
                setError(null);
                setSuccess('התקציב נוצר בהצלחה');
                // Auto-close after successful creation (optional)
                setTimeout(() => setShowCreateBudget(false), 1500);
            } else {
                setError('אירעה שגיאה בעת יצירת התקציב, נסה שוב מאוחר יותר');
                console.error('Error creating budget:', response.error);
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
            <h2 className="text-lg font-semibold text-gray-800 mb-4">יצירת תקציב חדש</h2>
            
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
            
            <form onSubmit={createBudget} className="space-y-4">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">קטגוריה</label>
                    <CategorySelect refId={profile.expenses} setSelectedCategory={setSelectedCategory} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">תאריך התחלה</label>
                        <input 
                            type="date" 
                            name="startDate" 
                            id="startDate" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-2 text-right border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">תאריך סיום</label>
                        <input 
                            type="date" 
                            name="endDate" 
                            id="endDate"
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-2 text-right border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>
                
                <div>
                    <label htmlFor="budgetAmount" className="block text-sm font-medium text-gray-700 mb-1">סכום התקציב</label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">₪</span>
                        </div>
                        <input 
                            type="number" 
                            name="budgetAmount" 
                            id="budgetAmount"
                            value={budgetAmount}
                            min="0" 
                            step="0.01"
                            placeholder="0.00"
                            onChange={(e) => setBudgetAmount(e.target.value)}
                            className="w-full pl-8 px-4 py-2 text-right border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
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
                        {loading ? 'יוצר תקציב...' : 'צור תקציב'}
                    </button>
                </div>
            </form>
        </div>
    );
}