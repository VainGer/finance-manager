import { useEffect, useState } from "react";
import useAdminLogs from "../../hooks/admin/useAdminLogs";

export default function AdminLogs() {
    const {
        groupedProfiles,
        fetchLogsByDate,
        fetchRecentLogs,
        loading,
        error,
        logs
    } = useAdminLogs();

    const [selectedUser, setSelectedUser] = useState("");
    const [selectedProfile, setSelectedProfile] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [limit, setLimit] = useState(50);
    const [displayedLogs, setDisplayedLogs] = useState([]);

    useEffect(() => {
        const init = async () => {
            const initialLogs = await fetchRecentLogs(50);
            setDisplayedLogs(initialLogs);
        };
        init();
    }, [fetchRecentLogs]);

    const handleFilter = async () => {
        const safeLimit = limit > 0 ? limit : 50;
        let fetchedLogs = [];

        if (startDate && endDate) {
            fetchedLogs = await fetchLogsByDate(startDate, endDate);
        } else {
            fetchedLogs = await fetchRecentLogs(safeLimit);
        }

        if (selectedUser || selectedProfile) {
            fetchedLogs = fetchedLogs.filter((log) => {
                const matchUser = selectedUser ? log.executeAccount === selectedUser : true;
                const matchProfile = selectedProfile ? log.executeProfile === selectedProfile : true;
                return matchUser && matchProfile;
            });
        }

        setDisplayedLogs(fetchedLogs);
    };

    const handleResetFilters = async () => {
        setSelectedUser("");
        setSelectedProfile("");
        setStartDate("");
        setEndDate("");
        setLimit(50);
        const logs = await fetchRecentLogs(50);
        setDisplayedLogs(logs);
    };

    return (
        <div className="p-6 space-y-6 bg-gradient-to-b from-slate-50 to-gray-100 min-h-screen" dir="rtl">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">לוגים</h1>
            <p className="text-slate-600 text-sm mb-4">
                כאן תוכל לעיין בפעולות שבוצעו במערכת, לסנן לפי תאריכים, משתמשים ופרופילים.
            </p>

            {/* Filter panel */}
            <div className="bg-white shadow rounded-lg p-4 border border-gray-200">
                <div className="flex flex-wrap gap-4 items-end">
                    {/* Date range */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">מתאריך</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border rounded-md p-2 text-sm w-44"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">עד תאריך</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border rounded-md p-2 text-sm w-44"
                        />
                    </div>

                    {/* Limit */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">מספר רשומות</label>
                        <input
                            type="number"
                            min={1}
                            value={limit}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                setLimit(val < 1 ? 1 : val);
                            }}
                            className="border rounded-md p-2 text-sm w-24"
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
                            className="border rounded-md p-2 text-sm min-w-[150px]"
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
                                className="border rounded-md p-2 text-sm min-w-[150px]"
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

                    <div className="flex gap-2">
                        <button
                            onClick={handleFilter}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
                        >
                            סינון
                        </button>
                        <button
                            onClick={handleResetFilters}
                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-300"
                        >
                            ניקוי
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
                {loading && <div className="p-6 text-center text-gray-600">טוען לוגים...</div>}
                {error && !loading && <div className="p-6 text-center text-red-600">{error}</div>}
                {!loading && !error && displayedLogs.length === 0 && (
                    <div className="p-6 text-center text-gray-500">אין תוצאות להצגה</div>
                )}
                {!loading && !error && displayedLogs.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-right">
                            <thead className="bg-gray-100 text-slate-700 text-xs uppercase border-b">
                                <tr>
                                    <th className="p-3">תאריך</th>
                                    <th className="p-3">סוג</th>
                                    <th className="p-3">חשבון</th>
                                    <th className="p-3">פרופיל</th>
                                    <th className="p-3">פעולה</th>
                                    <th className="p-3">תיאור</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedLogs.map((log, idx) => (
                                    <tr key={idx} className="border-b hover:bg-indigo-50 transition-colors">
                                        <td className="p-3 whitespace-nowrap">{new Date(log.date).toLocaleString()}</td>
                                        <td className="p-3">{log.type}</td>
                                        <td className="p-3">{log.executeAccount}</td>
                                        <td className="p-3">{log.executeProfile || "-"}</td>
                                        <td className="p-3">{log.action}</td>
                                        <td className="p-3 break-words max-w-xs">{log.target || "-"}</td>
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
