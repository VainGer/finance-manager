import { useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import CategorySelect from "../categories/CategorySelect";
import BusinessSelect from "../businesses/BusinessSelect";
import { post } from "../../../../utils/api";
import Button from "../../../common/Button";

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
        <div className="w-full h-full flex items-center justify-center p-4">
            <div className="p-6 bg-white rounded-xl shadow-lg w-full max-w-md mx-auto border border-gray-100">
                <div className="text-center mb-6">
                    <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">הוספת הוצאה חדשה</h3>
                    <p className="text-sm text-gray-600 mt-1">הוסף הוצאה חדשה למערכת</p>
                </div>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
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
                            <label className="block text-sm font-semibold text-gray-700 mb-2">סכום</label>
                            <input 
                                type="number" 
                                value={amount || ''}
                                placeholder="הכנס סכום" 
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">תאריך</label>
                            <input 
                                type="date" 
                                value={date || ''}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">תיאור</label>
                            <input 
                                type="text" 
                                value={description}
                                placeholder="תיאור ההוצאה (אופציונלי)" 
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                            />
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                style="success"
                                size="medium"
                                className="flex-1"
                            >
                                {isSubmitting ? 'מוסיף...' : 'הוסף הוצאה'}
                            </Button>
                            <Button 
                                type="button" 
                                onClick={goBack}
                                style="secondary"
                                size="medium"
                            >
                                חזור
                            </Button>
                        </div>
                    </div>
                )}
                
                {!selectedBusiness && (
                    <div className="border-t border-gray-200 pt-4 mt-6">
                        <Button 
                            type="button" 
                            onClick={goBack}
                            style="secondary"
                            size="medium"
                            className="w-full"
                        >
                            חזור
                        </Button>
                    </div>
                )}
            </form>
        </div>
    </div>
    );
}