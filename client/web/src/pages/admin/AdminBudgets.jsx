import { useEffect, useState } from "react";
import useAdminBudgets from "../../hooks/admin/useAdminBudgets";
import BudgetPeriodSelector from "../../components/dashboard/budget/BudgetPeriodSelector";
import OverallBudgetSummary from "../../components/dashboard/budget/OverallBudgetSummary";
import CategoryBudgetDetails from "../../components/dashboard/budget/CategoryBudgetDetails";

export default function AdminBudgets() {
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
        <div className="p-6 bg-gradient-to-b from-slate-50 to-gray-100 min-h-screen" dir="rtl">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">📅 תקציבים</h1>
                <p className="text-slate-600 text-sm">
                    כאן תוכל לצפות ולמחוק תקציבי משתמשים ופרופילים לפי תקופות.
                </p>
            </header>

            {/*  Account & Profile Selection */}
            <div className="bg-white shadow rounded-lg p-4 mb-6 flex flex-wrap gap-4 items-end border border-gray-200">
                <div>
                    <label className="block text-sm font-medium mb-1">חשבון</label>
                    <select
                        value={selectedUser}
                        onChange={(e) => {
                            setSelectedUser(e.target.value);
                            setSelectedProfile("");
                        }}
                        className="border rounded-md p-2 text-sm min-w-[180px]"
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
                    <div>
                        <label className="block text-sm font-medium mb-1">פרופיל</label>
                        <select
                            value={selectedProfile}
                            onChange={(e) => setSelectedProfile(e.target.value)}
                            className="border rounded-md p-2 text-sm min-w-[180px]"
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
                    className={`px-4 py-2 rounded-md text-sm transition 
                        ${!selectedUser || !selectedProfile
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
                >
                    טען תקציבים
                </button>
            </div>

            {/*  Loading & Error */}
            {loading && <p className="text-center text-gray-500">טוען נתונים...</p>}
            {error && <p className="text-center text-red-600">{error}</p>}

            {/* Budgets Display */}
            {!loading && !error && availablePeriods.length > 0 && (
                <div className="space-y-6">
                    <div className="flex flex-wrap justify-between items-center gap-3">
                        <BudgetPeriodSelector
                            periods={availablePeriods}
                            selectedPeriod={selectedPeriod}
                            onSelectPeriod={setSelectedPeriod}
                        />
                        {selectedPeriod && (
                            <button
                                onClick={handleDeletePeriod}
                                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition"
                            >
                                🗑 מחק תקופה זו
                            </button>
                        )}
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
                        <p className="text-center text-gray-500">אין תקציבים לתקופה שנבחרה</p>
                    )}
                </div>
            )}

            {!loading && !error && availablePeriods.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-slate-400"
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
                    <p className="text-lg font-semibold text-slate-600">אין תקציבים להצגה</p>
                </div>
            )}
        </div>
    );
}