import { useEffect, useState } from "react";
import useAdminLogs from "../../hooks/admin/useAdminLogs";

const ACTION_TYPES = [
    { value: "", label: "הכל" },
    { value: "create", label: "יצירה" },
    { value: "update", label: "עדכון" },
    { value: "delete", label: "מחיקה" },
    { value: "login", label: "התחברות" },
    { value: "export", label: "ייצוא / צפייה" },
];

export default function AdminLogs() {
    const { groupedProfiles, fetchLogsWithFilters, loading, error, logs } = useAdminLogs();

    const [selectedUser, setSelectedUser] = useState("");
    const [selectedProfile, setSelectedProfile] = useState("");
    const [selectedActionType, setSelectedActionType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [limit, setLimit] = useState(50);

    useEffect(() => {
        fetchLogsWithFilters({ limit: 50 });
    }, [fetchLogsWithFilters]);

    const handleFilter = async () => {
        const payload = {};
        if (limit > 0) payload.limit = limit;
        if (startDate && endDate) {
            payload.start = startDate;
            payload.end = endDate;
        }
        if (selectedUser) payload.executeAccount = selectedUser;
        if (selectedProfile) payload.executeProfile = selectedProfile;
        if (selectedActionType) payload.type = selectedActionType;

        await fetchLogsWithFilters(payload);
    };

    const handleResetFilters = async () => {
        setSelectedUser("");
        setSelectedProfile("");
        setSelectedActionType("");
        setStartDate("");
        setEndDate("");
        setLimit(50);
        await fetchLogsWithFilters({ limit: 50 });
    };

    return (
        <div className="p-6 bg-gradient-to-b from-slate-50 to-gray-100 min-h-screen" dir="rtl">
            {/* Page Header */}
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-1">📝 לוגים</h1>
                <p className="text-slate-600 text-sm">
                    כאן תוכל לעיין בפעולות שבוצעו במערכת ולסנן לפי תאריכים, סוג פעולה, משתמשים ופרופילים.
                </p>
            </header>

            {/* Filters Panel */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {/* Date range */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">מתאריך</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">עד תאריך</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    {/* Limit */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">מספר רשומות</label>
                        <input
                            type="number"
                            min={1}
                            value={limit}
                            onChange={(e) => setLimit(Math.max(1, Number(e.target.value)))}
                            className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    {/* Account */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">חשבון</label>
                        <select
                            value={selectedUser}
                            onChange={(e) => {
                                setSelectedUser(e.target.value);
                                setSelectedProfile("");
                            }}
                            className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                            <option value="">הכל</option>
                            {groupedProfiles.map((g) => (
                                <option key={g.account} value={g.account}>
                                    {g.account}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Profile */}
                    {selectedUser && (
                        <div>
                            <label className="block text-sm font-medium mb-1 text-slate-700">פרופיל</label>
                            <select
                                value={selectedProfile}
                                onChange={(e) => setSelectedProfile(e.target.value)}
                                className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            >
                                <option value="">הכל</option>
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

                    {/* Action Type */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">סוג פעולה</label>
                        <select
                            value={selectedActionType}
                            onChange={(e) => setSelectedActionType(e.target.value)}
                            className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                            {ACTION_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap justify-start gap-3 pt-2 border-t border-gray-100">
                    <button
                        onClick={handleFilter}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                    >
                        סינון
                    </button>
                    <button
                        onClick={handleResetFilters}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm transition-colors"
                    >
                        ניקוי
                    </button>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden mt-6">
                {loading && <div className="p-6 text-center text-gray-600">טוען לוגים...</div>}
                {error && !loading && <div className="p-6 text-center text-red-600">{error}</div>}
                {!loading && !error && logs.length === 0 && (
                    <div className="p-6 text-center text-gray-500">אין תוצאות להצגה</div>
                )}
                {!loading && !error && logs.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-right">
                            <thead className="bg-gray-100 text-slate-700 text-xs uppercase border-b">
                                <tr>
                                    <th className="p-3 whitespace-nowrap">תאריך</th>
                                    <th className="p-3">סוג</th>
                                    <th className="p-3">חשבון</th>
                                    <th className="p-3">פרופיל</th>
                                    <th className="p-3">פעולה</th>
                                    <th className="p-3 min-w-[200px]">יעד הפעולה/תיאור</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log, idx) => (
                                    <tr
                                        key={idx}
                                        className={`border-b ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-indigo-50 transition-colors`}
                                    >
                                        <td className="p-3 whitespace-nowrap">{new Date(log.date).toLocaleString()}</td>
                                        <td className="p-3">{log.type}</td>
                                        <td className="p-3">{log.executeAccount}</td>
                                        <td className="p-3">{log.executeProfile || "-"}</td>
                                        <td className="p-3">{log.action}</td>
                                        <td dir="ltr" className="p-3 break-words max-w-xs">
                                            {typeof log.target === "object"
                                                ? <pre className="whitespace-pre-wrap text-xs bg-slate-100 rounded p-2">{JSON.stringify(log.target, null, 2)}</pre>
                                                : log.target || "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
