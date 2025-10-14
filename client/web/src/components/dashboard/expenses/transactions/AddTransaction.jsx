import { useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import CategorySelect from "../categories/CategorySelect";
import BusinessSelect from "../businesses/BusinessSelect";
import Button from "../../../common/Button";
import useEditTransactions from "../../../../hooks/useEditTransactions";
import { useProfileData } from "../../../../context/ProfileDataContext";

export default function AddTransaction({ goBack, onTransactionAdded }) {
    const { profile } = useAuth();

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');

    const { loading, error, success, addTransaction, resetState } = useEditTransactions({ profile });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await addTransaction({
            selectedCategory,
            selectedBusiness,
            amount,
            date,
            description
        }, {
            setSelectedCategory,
            setSelectedBusiness,
            setAmount,
            setDate,
            setDescription
        });

        if (result.ok) {
            onTransactionAdded?.();
            setTimeout(() => {
                goBack();
                resetState();
            }, 1500);
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-white/95 backdrop-blur-sm">
            {/* Error Alert */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 flex items-center gap-3 mb-4 sm:mb-6">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
            )}

            {/* Success Alert */}
            {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4 flex items-center gap-3 mb-4 sm:mb-6">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-green-700 text-sm font-medium">{success}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" dir="rtl">
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
                        <label className="block text-sm font-semibold text-slate-800 text-right">בחר בעל עסק</label>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                            <BusinessSelect
                                refId={profile.expenses}
                                category={selectedCategory}
                                setSelectedBusiness={setSelectedBusiness}
                            />
                        </div>
                    </div>
                )}

                {/* Transaction Details */}
                {selectedBusiness && (
                    <div className="space-y-6">
                        {/* Amount Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-800 text-right">סכום</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={amount || ''}
                                    placeholder="0.00"
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-right text-lg font-medium"
                                    required
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">₪</div>
                            </div>
                        </div>

                        {/* Date Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-800 text-right">תאריך</label>
                            <input
                                type="date"
                                value={date || ''}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-right"
                                required
                            />
                        </div>

                        {/* Description Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-800 text-right">תיאור (אופציונלי)</label>
                            <textarea
                                value={description}
                                placeholder="הוסף תיאור לעסקה..."
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none text-right"
                                rows="3"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Button
                                type="button"
                                onClick={goBack}
                                style="outline"
                                size="medium"
                                className="w-full sm:flex-1"
                            >
                                ביטול
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                style="primary"
                                size="medium"
                                className="w-full sm:flex-1"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        שומר...
                                    </div>
                                ) : (
                                    'הוסף עסקה'
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Back Button for Incomplete Selection */}
                {!selectedBusiness && (
                    <div className="pt-4">
                        <Button
                            type="button"
                            onClick={goBack}
                            style="outline"
                            size="medium"
                            className="w-full"
                        >
                            ביטול
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}
