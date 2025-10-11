import { useState } from "react";
import useAdminExpenses from "../../hooks/admin/useAdminExpenses";
import Filter from "../../components/dashboard/expenses/expenses_display/Filters";
import ExpensesTable from "../../components/dashboard/expenses/expenses_display/ExpensesTable";

export default function AdminExpenses() {
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
        <div
            className="p-6 space-y-6 bg-gradient-to-b from-slate-50 to-gray-100 min-h-screen"
            dir="rtl"
        >
            <h1 className="text-3xl font-bold text-slate-800 mb-4">ניהול הוצאות</h1>
            <p className="text-slate-600 text-sm mb-4">
                כאן תוכל לעיין בהוצאות לפי פרופילים, לסנן, למיין ולבצע פעולות.
            </p>

            {/* 🧑‍💻 Account & Profile Selection */}
            <div className="bg-white shadow rounded-lg p-4 border border-gray-200 flex flex-wrap gap-4">
                {/* Account */}
                <div>
                    <label className="block text-sm mb-1 text-slate-700">חשבון</label>
                    <select
                        value={selectedAccount}
                        onChange={(e) => {
                            setSelectedAccount(e.target.value);
                            setSelectedProfile(null);
                        }}
                        className="border rounded-md p-2 text-sm min-w-[180px]"
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
                    <div>
                        <label className="block text-sm mb-1 text-slate-700">פרופיל</label>
                        <select
                            value={selectedProfile?.profileName || ""}
                            onChange={(e) => {
                                const profile = profilesForSelectedAccount.find(
                                    (p) => p.profileName === e.target.value
                                );
                                setSelectedProfile(profile || null);
                            }}
                            className="border rounded-md p-2 text-sm min-w-[180px]"
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

            {/* Filters + Table */}
            {selectedProfile && (
                <>
                    {loading && <p className="text-center text-gray-600">טוען הוצאות...</p>}
                    {error && !loading && (
                        <p className="text-center text-red-600">{error}</p>
                    )}

                    {!loading && !error && (
                        <div className="space-y-4">
                            {/* 🔍 Filters */}
                            <Filter
                                filters={filters}
                                setFilters={setFilters}
                                categories={categories}
                                businesses={businesses}
                            />

                            {/* 📅 Date Range */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-4 flex flex-wrap gap-4">
                                <div>
                                    <label className="block text-sm mb-1 text-gray-700">
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
                                        className="border rounded-md p-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1 text-gray-700">
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
                                        className="border rounded-md p-2 text-sm"
                                    />
                                </div>
                            </div>

                            {/* 🧾 Summary */}
                            <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-wrap justify-between items-center">
                                <div>
                                    <p className="text-slate-700 font-medium">
                                        <span className="font-semibold">סה"כ עסקאות:</span>{" "}
                                        {summary.transactionCount}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-700 font-medium">
                                        <span className="font-semibold">סה"כ הוצאות:</span>{" "}
                                        {summary.totalAmount.toLocaleString()} ₪
                                    </p>
                                </div>
                            </div>

                            {/* 📊 Expenses Table */}
                            <ExpensesTable
                                filteredExpenses={expenses}
                                expensesId={selectedProfile.refId}
                                onTransactionDeleted={() => { }}
                                onTransactionUpdated={() => { }}
                                inAdminMode={true}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
