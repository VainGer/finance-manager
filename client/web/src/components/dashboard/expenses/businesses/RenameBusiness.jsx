import { useState, useEffect } from "react"
import { useAuth } from '../../../../context/AuthContext';
import { put } from "../../../../utils/api";
import BusinessSelect from "./BusinessSelect";
import CategorySelect from "../categories/CategorySelect";
import { div } from "framer-motion/client";

export default function RenameBusiness({ goBack }) {
    const { profile } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [newBusinessName, setNewBusinessName] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const renameBusiness = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (!selectedCategory) {
            setError('אנא בחר קטגוריה');
            return;
        }
        if (!selectedBusiness) {
            setError('אנא בחר עסק');
            return;
        }
        if (!newBusinessName || newBusinessName.trim() === '') {
            setError('אנא הזן שם חדש לעסק');
            return;
        }

        const response = await put('expenses/business/rename', {
            refId: profile.expenses,
            catName: selectedCategory,
            oldName: selectedBusiness,
            newName: newBusinessName.trim()
        });
        if (response.ok) {
            setSuccess('העסק שונה בהצלחה');
            setTimeout(() => {
                goBack();
            }, 1500);
        } else if (response.status === 409) {
            setError('שם העסק כבר קיים בקטגוריה זו');
        } else {
            setError('אירעה שגיאה');
            console.error('Error renaming business:', response.error);
        }
    }

    return (
        <div className="p-6 bg-white/95 backdrop-blur-sm" dir="rtl">
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

            <form onSubmit={renameBusiness} className="space-y-6">
                {/* Category Selection */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-800 text-right">בחר קטגוריה</label>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                        <CategorySelect refId={profile.expenses} setSelectedCategory={setSelectedCategory} />
                    </div>
                </div>
                
                {/* Business Selection */}
                {selectedCategory && (
                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-slate-800 text-right">בחר בעל עסק לעריכה</label>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                            <BusinessSelect 
                                refId={profile.expenses} 
                                category={selectedCategory} 
                                setSelectedBusiness={setSelectedBusiness} 
                            />
                        </div>
                    </div>
                )}
                
                {/* New Name Input */}
                {selectedBusiness && (
                    <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-right">
                            <p className="text-blue-700 text-sm">
                                <strong>בעל עסק נוכחי:</strong> {selectedBusiness}
                            </p>
                        </div>
                        
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-slate-800 text-right">שם חדש לבעל העסק</label>
                            <input 
                                type="text" 
                                name="newBusinessName" 
                                placeholder="הכנס שם חדש..." 
                                onChange={e => setNewBusinessName(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-right"
                                required
                            />
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={goBack}
                                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-colors"
                            >
                                ביטול
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                            >
                                שמור שינויים
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Back Button for Incomplete Selection */}
                {!selectedBusiness && (
                    <div className="pt-4">
                        <button
                            type="button"
                            onClick={goBack}
                            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-colors"
                        >
                            ביטול
                        </button>
                    </div>
                )}
            </form>
        </div>
    )
}