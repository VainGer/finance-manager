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
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [conflictingBudget, setConflictingBudget] = useState(null);
    const [pendingBudget, setPendingBudget] = useState(null);
    const { profile } = useAuth();
    //TODO create child profile budget distribution based on profile budget
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
        setError(null);
        
        try {
            const budget = {
                startDate,
                endDate,
                budgetAmount: parseFloat(budgetAmount),
                spent: 0
            };

            const response = await post('expenses/category/create-budget', { 
                refId: profile.expenses, 
                catName: selectedCategory, 
                budget 
            });
            
            if (response.ok) {
                setSuccess('התקציב נוצר בהצלחה');
                // Clear form
                setSelectedCategory('');
                setStartDate('');
                setEndDate('');
                setBudgetAmount('');
                // Auto-close after successful creation
                setTimeout(() => goBack(), 1500);
            } else if (response.status === 409 && response.requiresConfirmation) {
                // Budget conflict detected
                setConflictingBudget(response.conflictingBudget);
                setPendingBudget(budget);
                setShowConfirmation(true);
            } else {
                setError(response.message || 'אירעה שגיאה בעת יצירת התקציב');
            }
        } catch (err) {
            console.error('Network error:', err);
            setError('תקשורת עם השרת נכשלה');
        } finally {
            setLoading(false);
        }
    };

    const handleReplaceConfirm = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await post('expenses/category/replace-budget', {
                refId: profile.expenses,
                catName: selectedCategory,
                budget: pendingBudget,
                oldBudgetId: conflictingBudget._id
            });

            if (response.ok) {
                setSuccess('התקציב הוחלף בהצלחה');
                setShowConfirmation(false);
                setConflictingBudget(null);
                setPendingBudget(null);
                // Clear form
                setSelectedCategory('');
                setStartDate('');
                setEndDate('');
                setBudgetAmount('');
                // Auto-close after successful replacement
                setTimeout(() => goBack(), 1500);
            } else {
                setError(response.message || 'אירעה שגיאה בעת החלפת התקציב');
            }
        } catch (err) {
            console.error('Network error:', err);
            setError('תקשורת עם השרת נכשלה');
        } finally {
            setLoading(false);
        }
    };

    const handleReplaceCancel = () => {
        setShowConfirmation(false);
        setConflictingBudget(null);
        setPendingBudget(null);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('he-IL');
    };

    const formatCurrency = (amount) => {
        return `₪${Number(amount).toLocaleString()}`;
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

            {/* Confirmation Dialog */}
            {showConfirmation && conflictingBudget && (
                <div className="bg-yellow-50 border border-yellow-400 rounded-md p-4 mb-4">
                    <div className="flex items-start">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                                ⚠️ תקציב קיים נמצא
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <p>תקציב קיים כבר נמצא עבור התקופה הזו:</p>
                                <div className="mt-2 bg-white p-3 rounded border">
                                    <p><strong>תקופה:</strong> {formatDate(conflictingBudget.startDate)} - {formatDate(conflictingBudget.endDate)}</p>
                                    <p><strong>סכום:</strong> {formatCurrency(conflictingBudget.amount || conflictingBudget.budgetAmount)}</p>
                                </div>
                                <p className="mt-2">האם ברצונך להחליף את התקציב הקיים?</p>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleReplaceConfirm}
                                    disabled={loading}
                                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'מחליף...' : 'כן, החלף'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReplaceCancel}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400"
                                >
                                    ביטול
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {!showConfirmation && (
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
                                min="0" 
                                step="0.01"
                                placeholder="0.00"
                                value={budgetAmount}
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
            )}
        </div>
    );
}