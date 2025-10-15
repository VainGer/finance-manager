import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAdminExpenses from "../../hooks/admin/useAdminExpenses";
import ExpensesTable from "../../components/dashboard/expenses/expenses_display/ExpensesTable";

export default function AdminExpenses() {
    const navigate = useNavigate();
    const {
        groupedProfiles,
        selectedAccount,
        setSelectedAccount,
        selectedProfile,
        setSelectedProfile,
        expenses,
        loading,
        error,
        filters,
        setFilters,
        categories,
        businesses,
        dateRange,
        setDateRange,
        summary,
    } = useAdminExpenses();

    const accounts = groupedProfiles.map((g) => g.account);
    const profilesForSelectedAccount =
        groupedProfiles.find((g) => g.account === selectedAccount)?.profiles || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-6 rtl relative overflow-hidden" dir="rtl">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-purple-100/35 to-pink-100/25 rounded-full blur-xl"></div>
                <div className="absolute top-1/4 -left-32 w-72 h-72 bg-gradient-to-br from-purple-100/30 to-blue-100/25 rounded-full blur-xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-8">
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
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7 4V2C7 1.45 7.45 1 8 1S9 1.45 9 2V4H15V2C15 1.45 15.45 1 16 1S17 1.45 17 2V4H20C21.11 4 22 4.89 22 6V20C22 21.11 21.11 22 20 22H4C2.89 22 2 21.11 2 20V6C2 4.89 2.89 4 4 4H7M4 8V20H20V8H4M12 9L17 14H14V18H10V14H7L12 9Z"/>
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-800 mb-4">ניהול הוצאות</h1>
                    <p className="text-xl text-slate-600">צפייה וניתוח הוצאות לפי פרופילים וקטגוריות</p>
                </div>

                {/* Account & Profile Selection */}
                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg p-6">
                    <div className="flex flex-wrap gap-6 items-end">
                        {/* Account */}
                        <div className="w-64">
                            <label className="block text-sm font-semibold mb-2 text-slate-700">חשבון</label>
                            <select
                                value={selectedAccount}
                                onChange={(e) => {
                                    setSelectedAccount(e.target.value);
                                    setSelectedProfile(null);
                                }}
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                            >
                                <option value="">בחר חשבון</option>
                                {accounts.map((a) => (
                                    <option key={a} value={a}>
                                        {a}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Profile */}
                        {selectedAccount && (
                            <div className="w-64 animate-fadeIn">
                                <label className="block text-sm font-semibold mb-2 text-slate-700">פרופיל</label>
                                <select
                                    value={selectedProfile?.profileName || ""}
                                    onChange={(e) => {
                                        const profile = profilesForSelectedAccount.find(
                                            (p) => p.profileName === e.target.value
                                        );
                                        setSelectedProfile(profile || null);
                                    }}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                                >
                                    <option value="">בחר פרופיל</option>
                                    {profilesForSelectedAccount.map((p) => (
                                        <option key={p.profileName} value={p.profileName}>
                                            {p.profileName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Filters + Table */}
                {selectedProfile && (
                    <>
                        {/* Loading State */}
                        {loading && (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
                                    <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                                    <span className="text-slate-600">טוען הוצאות...</span>
                                </div>
                            </div>
                        )}
                        
                        {/* Error State */}
                        {error && !loading && (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-6 py-4 shadow-lg">
                                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                    <span className="text-red-700">{error}</span>
                                </div>
                            </div>
                        )}

                        {!loading && !error && (
                            <div className="space-y-6">
                                {/* Filters */}
                                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg p-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z"/>
                                            </svg>
                                            סינון והגדרות
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Category Filter */}
                                            <div>
                                                <label className="block text-sm font-semibold mb-2 text-slate-700">קטגוריה</label>
                                                <select
                                                    value={filters.category}
                                                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                                                >
                                                    <option value="all">כל הקטגוריות</option>
                                                    {categories.filter(c => c !== "all").map((category) => (
                                                        <option key={category} value={category}>{category}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Business Filter */}
                                            <div>
                                                <label className="block text-sm font-semibold mb-2 text-slate-700">עסק</label>
                                                <select
                                                    value={filters.business}
                                                    onChange={(e) => setFilters(prev => ({ ...prev, business: e.target.value }))}
                                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                                                >
                                                    <option value="all">כל העסקים</option>
                                                    {businesses.filter(b => b !== "all").map((business) => (
                                                        <option key={business} value={business}>{business}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Sort By */}
                                            <div>
                                                <label className="block text-sm font-semibold mb-2 text-slate-700">מיון לפי</label>
                                                <select
                                                    value={filters.sortBy}
                                                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                                                >
                                                    <option value="date">תאריך</option>
                                                    <option value="amount">סכום</option>
                                                    <option value="description">תיאור</option>
                                                </select>
                                            </div>

                                            {/* Sort Order */}
                                            <div>
                                                <label className="block text-sm font-semibold mb-2 text-slate-700">כיוון המיון</label>
                                                <select
                                                    value={filters.sortOrder}
                                                    onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value }))}
                                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                                                >
                                                    <option value="desc">מהגבוה לנמוך</option>
                                                    <option value="asc">מהנמוך לגבוה</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Date Range */}
                                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg p-6">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                                        </svg>
                                        טווח תאריכים
                                    </h3>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex-1 min-w-[200px]">
                                            <label className="block text-sm font-semibold mb-2 text-slate-700">
                                                מתאריך
                                            </label>
                                            <input
                                                type="date"
                                                value={dateRange.startDate || ""}
                                                onChange={(e) =>
                                                    setDateRange((r) => ({
                                                        ...r,
                                                        startDate: e.target.value,
                                                    }))
                                                }
                                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-[200px]">
                                            <label className="block text-sm font-semibold mb-2 text-slate-700">
                                                עד תאריך
                                            </label>
                                            <input
                                                type="date"
                                                value={dateRange.endDate || ""}
                                                onChange={(e) =>
                                                    setDateRange((r) => ({
                                                        ...r,
                                                        endDate: e.target.value,
                                                    }))
                                                }
                                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-white/80 text-sm">סה"כ עסקאות</p>
                                                <p className="text-2xl font-bold">{summary.transactionCount}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-white/80 text-sm">סה"כ הוצאות</p>
                                                <p className="text-2xl font-bold">{summary.totalAmount.toLocaleString()} ₪</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Expenses Table */}
                                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg overflow-hidden">
                                    <ExpensesTable
                                        filteredExpenses={expenses}
                                        expensesId={selectedProfile.refId}
                                        onTransactionDeleted={() => { }}
                                        onTransactionUpdated={() => { }}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
