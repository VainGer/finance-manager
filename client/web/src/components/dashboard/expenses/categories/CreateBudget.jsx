import { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { post } from '../../../../utils/api';
import CategorySelect from './CategorySelect';
import Button from '../../../common/Button';

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
        <div className="space-y-6">
            <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">🎯 יצירת תקציב חדש</h2>
                <p className="text-sm text-gray-600 mt-1">הגדר תקציב לקטגוריה נבחרת</p>
            </div>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                    {success}
                </div>
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
                            <div className="mt-4 flex gap-3">
                                <Button
                                    onClick={handleReplaceConfirm}
                                    disabled={loading}
                                    style="danger"
                                    size="medium"
                                    className="flex-1"
                                >
                                    {loading ? 'מחליף...' : 'כן, החלף'}
                                </Button>
                                <Button
                                    onClick={handleReplaceCancel}
                                    style="secondary"
                                    size="medium"
                                    className="flex-1"
                                >
                                    ביטול
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {!showConfirmation && (
                <form onSubmit={createBudget} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">קטגוריה</label>
                        <CategorySelect refId={profile.expenses} setSelectedCategory={setSelectedCategory} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-2">תאריך התחלה</label>
                            <input 
                                type="date" 
                                name="startDate" 
                                id="startDate" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-3 text-right border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-2">תאריך סיום</label>
                            <input 
                                type="date" 
                                name="endDate" 
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-3 text-right border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="budgetAmount" className="block text-sm font-semibold text-gray-700 mb-2">סכום התקציב</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <span className="text-gray-500 text-sm">₪</span>
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
                                className="w-full pl-10 px-4 py-3 text-right border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                            />
                        </div>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                        <Button
                            onClick={goBack}
                            style="secondary"
                            size="medium"
                            className="flex-1"
                        >
                            ביטול
                        </Button>
                        
                        <Button
                            type="submit"
                            disabled={loading}
                            style="warning"
                            size="medium"
                            className="flex-1"
                        >
                            {loading ? 'יוצר תקציב...' : 'צור תקציב'}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}