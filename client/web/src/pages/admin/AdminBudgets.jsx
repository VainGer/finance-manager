import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAdminBudgets from "../../hooks/admin/useAdminBudgets";
import BudgetPeriodSelector from "../../components/dashboard/budget/BudgetPeriodSelector";
import OverallBudgetSummary from "../../components/dashboard/budget/OverallBudgetSummary";
import CategoryBudgetDetails from "../../components/dashboard/budget/CategoryBudgetDetails";

export default function AdminBudgets() {
    const navigate = useNavigate();
    const {
        groupedProfiles,
        loading,
        error,
        fetchGroupedProfiles,
        fetchBudgets,
        deleteBudget,
        availablePeriods,
        selectedPeriod,
        setSelectedPeriod,
        currentProfileBudget,
        currentCategoryBudgets,
    } = useAdminBudgets();

    const [selectedUser, setSelectedUser] = useState("");
    const [selectedProfile, setSelectedProfile] = useState("");

    useEffect(() => {
        fetchGroupedProfiles();
    }, [fetchGroupedProfiles]);

    const handleLoadBudgets = async () => {
        if (!selectedUser || !selectedProfile) return;
        await fetchBudgets(selectedUser, selectedProfile);
    };

    const handleDeletePeriod = async () => {
        if (!selectedUser || !selectedProfile || !selectedPeriod) return;
        const confirmDelete = window.confirm(
            `האם אתה בטוח שברצונך למחוק את התקציב של התקופה ${selectedPeriod.startDate} - ${selectedPeriod.endDate}?`
        );
        if (!confirmDelete) return;
        const success = await deleteBudget(selectedUser, selectedProfile, selectedPeriod);
        if (success) await fetchBudgets(selectedUser, selectedProfile);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-6 rtl relative overflow-hidden" dir="rtl">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-green-100/35 to-emerald-100/25 rounded-full blur-xl"></div>
                <div className="absolute top-1/4 -left-32 w-72 h-72 bg-gradient-to-br from-purple-100/30 to-blue-100/25 rounded-full blur-xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Back Button */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                        </svg>
                        חזרה לדשבורד
                    </button>
                </div>

                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-6 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-800 mb-4">ניהול תקציבים</h1>
                    <p className="text-xl text-slate-600">צפייה ומחיקת תקציבי משתמשים ופרופילים לפי תקופות</p>
                </div>

                {/* Account & Profile Selection */}
                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex flex-wrap gap-6 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-semibold mb-2 text-slate-700">חשבון</label>
                            <select
                                value={selectedUser}
                                onChange={(e) => {
                                    setSelectedUser(e.target.value);
                                    setSelectedProfile("");
                                }}
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                            >
                                <option value="">בחר חשבון</option>
                                {groupedProfiles.map((g) => (
                                    <option key={g.account} value={g.account}>
                                        {g.account}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedUser && (
                            <div className="flex-1 min-w-[200px] animate-fadeIn">
                                <label className="block text-sm font-semibold mb-2 text-slate-700">פרופיל</label>
                                <select
                                    value={selectedProfile}
                                    onChange={(e) => setSelectedProfile(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                                >
                                    <option value="">בחר פרופיל</option>
                                    {groupedProfiles
                                        .find((g) => g.account === selectedUser)
                                        ?.profiles.map((p) => (
                                            <option key={p.profileName} value={p.profileName}>
                                                {p.profileName}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        )}

                        <button
                            onClick={handleLoadBudgets}
                            disabled={!selectedUser || !selectedProfile}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                !selectedUser || !selectedProfile
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                </svg>
                                טען תקציבים
                            </div>
                        </button>
                    </div>
                </div>

                {/* Loading & Error States */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
                            <div className="w-6 h-6 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
                            <span className="text-slate-600">טוען נתונים...</span>
                        </div>
                    </div>
                )}
                
                {error && (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-6 py-4 shadow-lg">
                            <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            <span className="text-red-700">{error}</span>
                        </div>
                    </div>
                )}

                {/* Budgets Display */}
                {!loading && !error && availablePeriods.length > 0 && (
                    <div className="space-y-8">
                        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg p-6">
                            <div className="flex flex-wrap justify-between items-center gap-4">
                                <BudgetPeriodSelector
                                    periods={availablePeriods}
                                    selectedPeriod={selectedPeriod}
                                    onSelectPeriod={setSelectedPeriod}
                                />
                                {selectedPeriod && (
                                    <button
                                        onClick={handleDeletePeriod}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                        </svg>
                                        מחק תקופה זו
                                    </button>
                                )}
                            </div>
                        </div>

                        {currentProfileBudget ? (
                            <>
                                <OverallBudgetSummary budget={currentProfileBudget} />
                                <CategoryBudgetDetails
                                    categories={currentCategoryBudgets}
                                    selectedPeriod={selectedPeriod}
                                />
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 shadow-lg">
                                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                                    </svg>
                                    <span className="text-gray-500">אין תקציבים לתקופה שנבחרה</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {!loading && !error && availablePeriods.length === 0 && selectedUser && selectedProfile && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg
                                className="w-10 h-10 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-700 mb-2">אין תקציבים להצגה</h3>
                        <p className="text-slate-500">לא נמצאו תקציבים עבור הפרופיל שנבחר</p>
                    </div>
                )}
            </div>
        </div>
    );
}