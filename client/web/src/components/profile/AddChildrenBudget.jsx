import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { post, get } from '../../utils/api';
import ErrorMessage from '../common/ErrorMessage';

export default function AddChildrenBudget() {
    const { account, profile } = useAuth();
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [amount, setAmount] = useState(0);
    const [selectedChild, setSelectedChild] = useState('');
    const [childrenProfiles, setChildrenProfiles] = useState([]);

    const fetchChildrenProfiles = async () => {
        try {
            const response = await get('profile/get-profiles?username=' + account.username);
            if (response.ok) {
                setChildrenProfiles(response.profiles.filter(p => !p.parentProfile));
            } else {
                console.error('Error fetching children profiles:', response.error);
            }
        } catch (err) {
            console.error('Network error:', err);
        }
    }

    useEffect(() => {
        fetchChildrenProfiles();
    }, [profile]);

    const addChildrenBudget = async (e) => {
        e.preventDefault();
        try {
            const response = await post('profile/add-child-budget', {
                username: account.username,
                profileName: selectedChild,
                budget: {
                    startDate,
                    endDate,
                    amount: parseFloat(amount)
                }
            });
            if (response.ok) {
                console.log('Children budget added successfully', response);
            } else {
                setError('אירעה שגיאה בעת הוספת התקציב, נסה שוב מאוחר יותר');
                console.error('Error adding children budget:', response.error);
            }
        } catch (error) {
            setError('אירעה שגיאה בעת הוספת התקציב, נסה שוב מאוחר יותר');
            console.error('Error adding children budget:', error);
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">הוספת תקציב לילד</h2>
                            <p className="text-white/80 text-sm">הגדר תקציב חדש עבור פרופיל ילד</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span className="text-red-700 font-medium">{error}</span>
                            </div>
                        </div>
                    )}
                    
                    <form onSubmit={addChildrenBudget} className="space-y-6">
                        {/* Child Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">בחירת ילד</label>
                            <div className="relative">
                                <select 
                                    name="childProfile" 
                                    value={selectedChild} 
                                    onChange={e => setSelectedChild(e.target.value)}
                                    className="w-full p-4 pr-12 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm appearance-none"
                                    required
                                >
                                    <option value="" disabled>בחר פרופיל ילד</option>
                                    {childrenProfiles.map((child, index) => (
                                        <option key={index} value={child.profileName}>{child.profileName}</option>
                                    ))}
                                </select>
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            {childrenProfiles.length === 0 && (
                                <p className="text-sm text-amber-600 bg-amber-50 rounded-lg p-3 border border-amber-200">
                                    לא נמצאו פרופילי ילדים במערכת
                                </p>
                            )}
                        </div>

                        {/* Date Range */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Start Date */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">תאריך התחלה</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={e => setStartDate(e.target.value)}
                                        className="w-full p-4 pl-12 pr-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm text-lg cursor-pointer"
                                        style={{
                                            colorScheme: 'light',
                                            fontSize: '16px'
                                        }}
                                        required
                                    />
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* End Date */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">תאריך סיום</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={e => setEndDate(e.target.value)}
                                        min={startDate}
                                        className="w-full p-4 pl-12 pr-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm text-lg cursor-pointer"
                                        style={{
                                            colorScheme: 'light',
                                            fontSize: '16px'
                                        }}
                                        required
                                    />
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">סכום התקציב</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    className="w-full p-4 pl-12 pr-16 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm text-lg font-semibold"
                                    required
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <span className="text-slate-500 font-medium text-sm">₪</span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-600 bg-slate-50 rounded-lg p-3 border border-slate-200">
                                הסכום יוגדר כתקציב זמין עבור הילד בתקופה שנבחרה
                            </p>
                        </div>

                        {/* Budget Summary Card */}
                        {selectedChild && startDate && endDate && amount > 0 && (
                            <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                                <h3 className="text-lg font-semibold text-emerald-800 mb-3">סיכום התקציב</h3>
                                <div className="space-y-2 text-sm text-emerald-700">
                                    <div className="flex justify-between">
                                        <span>ילד:</span>
                                        <span className="font-semibold">{selectedChild}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>תקופה:</span>
                                        <span className="font-semibold">{startDate} עד {endDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>סכום:</span>
                                        <span className="font-semibold text-lg">₪{parseFloat(amount).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-slate-200">
                            <button
                                type="submit"
                                className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white border-0 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!selectedChild || !startDate || !endDate || amount <= 0}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    הוסף תקציב לילד
                                </div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}