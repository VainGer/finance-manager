import { useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import CategorySelect from "../categories/CategorySelect";
import BusinessSelect from "../businesses/BusinessSelect";
import { post } from "../../../../utils/api";

export default function AddTransaction({ goBack, onTransactionAdded }) {
    const { profile } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [amount, setAmount] = useState(null);
    const [date, setDate] = useState(null);
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addTransaction = async (e) => {
        e.preventDefault();
        if (!selectedCategory || !selectedBusiness || !amount || !date) {
            setError('אנא מלא את כל השדות');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        const transaction = {
            amount: Number(amount),
            date: new Date(date),
            description: description
        }

        try {
            const response = await post('expenses/transaction/create', {
                refId: profile.expenses,
                catName: selectedCategory,
                busName: selectedBusiness,
                transaction
            });

            if (response.ok || response.success) {
                setSuccess('העסקה נוספה בהצלחה!');
                
                // Clear form
                setSelectedCategory(null);
                setSelectedBusiness(null);
                setAmount('');
                setDate('');
                setDescription('');
                
                // Trigger refresh of the dashboard
                if (onTransactionAdded) {
                    onTransactionAdded();
                }
                
                // Auto close after success
                setTimeout(() => {
                    goBack();
                }, 1500);
            } else {
                setError(response.message || 'שגיאה בהוספת העסקה');
            }
        } catch (err) {
            console.error('Error adding transaction:', err);
            setError('שגיאה בחיבור למסד הנתונים');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">➕ הוספת הוצאה חדשה</h3>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {success}
                </div>
            )}

            <form onSubmit={addTransaction} className="space-y-4">
                <CategorySelect refId={profile.expenses} setSelectedCategory={setSelectedCategory} />
                
                {selectedCategory && (
                    <BusinessSelect 
                        refId={profile.expenses} 
                        category={selectedCategory} 
                        setSelectedBusiness={setSelectedBusiness} 
                    />
                )}
                
                {selectedBusiness && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">סכום</label>
                            <input 
                                type="number" 
                                value={amount || ''}
                                placeholder="הכנס סכום" 
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">תאריך</label>
                            <input 
                                type="date" 
                                value={date || ''}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
                            <input 
                                type="text" 
                                value={description}
                                placeholder="תיאור ההוצאה" 
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        
                        <div className="flex gap-2">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="flex-1 py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubmitting ? 'מוסיף...' : 'הוסף הוצאה'}
                            </button>
                            <button 
                                type="button" 
                                onClick={goBack}
                                className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                            >
                                חזור
                            </button>
                        </div>
                    </div>
                )}
                
                {!selectedBusiness && (
                    <button 
                        type="button" 
                        onClick={goBack}
                        className="w-full py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                        חזור
                    </button>
                )}
            </form>
        </div>
    );
}