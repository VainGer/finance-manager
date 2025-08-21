import { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { post } from '../../../../utils/api';
import CategorySelect from '../categories/CategorySelect';
import Button from '../../../common/Button';

export default function CreateBusiness({ goBack, onBusinessAdded }) {

    const { profile } = useAuth();
    const [name, setName] = useState('');
    const [category, setCategory] = useState(null);
    const [error, setError] = useState(null);

    const createBusiness = async (e) => {
        e.preventDefault();

        const response = await post('expenses/business/add', {
            refId: profile.expenses,
            catName: category,
            name
        });
        if (response.ok) {
            if (onBusinessAdded) { onBusinessAdded(); }
            goBack();
        } else if (response.status === 409) {
            setError('שם בעל העסק כבר קיים');
        } else {
            setError('אירעה שגיאה בעת יצירת בעל העסק, נסה שוב מאוחר יותר');
            console.error('Error creating business:', response.error);
        }
    }

    return (
        <div className="p-6 bg-white/95 backdrop-blur-sm" dir="rtl">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 mb-6">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
            )}
            
            <form onSubmit={createBusiness} className="space-y-6">
                {/* Category Selection */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-800 text-right">בחר קטגוריה</label>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                        <CategorySelect refId={profile.expenses} setSelectedCategory={setCategory} />
                    </div>
                </div>
                
                {/* Business Name Input */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-800 text-right">שם בעל העסק</label>
                    <input 
                        type="text" 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="הכנס שם בעל עסק..." 
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
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                        הוסף בעל עסק
                    </button>
                </div>
            </form>
        </div>
    );
}