import { useState } from "react"
import { useAuth } from "../../../../context/AuthContext";
import { del } from "../../../../utils/api";
import BusinessSelect from "./BusinessSelect";
import CategorySelect from "../categories/CategorySelect";


export default function DeleteBusiness({ goBack }) {
    const { profile } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const deleteBusiness = async (e) => {
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

        const response = await del(`expenses/business/delete/${profile.expenses}/${encodeURIComponent(selectedCategory)}/${encodeURIComponent(selectedBusiness)}`);
        if (response.ok) {
            setSuccess('העסק נמחק בהצלחה');
            setTimeout(() => {
                goBack();
            }, 1500);
        } else {
            setError('אירעה שגיאה בעת מחיקת העסק, נסה שוב מאוחר יותר');
            console.error('Error deleting business:', response.error);
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

            <form onSubmit={deleteBusiness} className="space-y-6">
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
                        <label className="block text-sm font-semibold text-slate-800 text-right">בחר בעל עסק למחיקה</label>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                            <BusinessSelect
                                refId={profile.expenses}
                                category={selectedCategory}
                                setSelectedBusiness={setSelectedBusiness}
                            />
                        </div>
                    </div>
                )}

                {/* Confirmation and Action */}
                {selectedBusiness && (
                    <div className="space-y-6">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L12.732 3.5c-.77-.833-2.694-.833-3.464 0L1.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <h4 className="font-semibold text-red-800">אזהרה!</h4>
                            </div>
                            <p className="text-red-700 text-sm">
                                אתה בטוח שברצונך למחוק את בעל העסק <strong>"{selectedBusiness}"</strong>?<br />
                                פעולה זו בלתי הפיכה ותמחק את כל הנתונים הקשורים.
                            </p>
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
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                            >
                                מחק בעל עסק
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