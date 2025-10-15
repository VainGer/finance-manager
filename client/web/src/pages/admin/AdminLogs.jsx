import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-6 rtl relative overflow-hidden" dir="rtl">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-slate-100/35 to-blue-100/25 rounded-full blur-xl"></div>
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-tr from-gray-100/30 to-slate-100/20 rounded-full blur-xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-8">
                {/* Back Button */}
                <div>
                    <button 
                        onClick={() => navigate('/admin/dashboard')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg hover:bg-white/90 transition-all duration-300 text-slate-700 hover:text-slate-900"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                        </svg>
                        חזרה לדשבורד
                    </button>
                </div>

                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-500 to-blue-500 rounded-2xl mb-6 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-800 mb-4">לוגים ופעילות</h1>
                    <p className="text-xl text-slate-600">צפייה ומעקב אחרי פעולות שבוצעו במערכת</p>
                </div>

                {/* Filters Panel */}
                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z"/>
                        </svg>
                        סינון לוגים
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                        {/* Date range */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700">מתאריך</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700">עד תאריך</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-300"
                            />
                        </div>

                        {/* Limit */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700">מספר רשומות</label>
                            <input
                                type="number"
                                min={1}
                                value={limit}
                                onChange={(e) => setLimit(Math.max(1, Number(e.target.value)))}
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-300"
                            />
                        </div>

                        {/* Account */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700">חשבון</label>
                            <select
                                value={selectedUser}
                                onChange={(e) => {
                                    setSelectedUser(e.target.value);
                                    setSelectedProfile("");
                                }}
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-300"
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
                            <div className="animate-fadeIn">
                                <label className="block text-sm font-semibold mb-2 text-slate-700">פרופיל</label>
                                <select
                                    value={selectedProfile}
                                    onChange={(e) => setSelectedProfile(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-300"
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
                            <label className="block text-sm font-semibold mb-2 text-slate-700">סוג פעולה</label>
                            <select
                                value={selectedActionType}
                                onChange={(e) => setSelectedActionType(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-300"
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
                    <div className="flex flex-wrap justify-start gap-3 pt-6 border-t border-slate-200 mt-6">
                        <button
                            onClick={handleFilter}
                            className="bg-gradient-to-r from-slate-500 to-blue-500 hover:from-slate-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            <svg className="w-4 h-4 inline-block mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
                            </svg>
                            סינון
                        </button>
                        <button
                            onClick={handleResetFilters}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            <svg className="w-4 h-4 inline-block mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                            </svg>
                            ניקוי
                        </button>
                    </div>
                </div>

                {/* Logs Table */}
                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg overflow-hidden">
                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
                                <div className="w-6 h-6 border-2 border-slate-500/30 border-t-slate-500 rounded-full animate-spin"></div>
                                <span className="text-slate-600">טוען לוגים...</span>
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
                    
                    {/* Empty State */}
                    {!loading && !error && logs.length === 0 && (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 shadow-lg">
                                <svg className="w-6 h-6 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                                </svg>
                                <span className="text-slate-600">אין לוגים להצגה</span>
                            </div>
                        </div>
                    )}
                    
                    {/* Table */}
                    {!loading && !error && logs.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gradient-to-r from-slate-100 to-blue-100 text-slate-700 border-b border-slate-200">
                                    <tr>
                                        <th className="p-4 text-right font-semibold whitespace-nowrap">תאריך ושעה</th>
                                        <th className="p-4 text-right font-semibold">סוג</th>
                                        <th className="p-4 text-right font-semibold">חשבון</th>
                                        <th className="p-4 text-right font-semibold">פרופיל</th>
                                        <th className="p-4 text-right font-semibold">פעולה</th>
                                        <th className="p-4 text-right font-semibold min-w-[250px]">יעד הפעולה</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log, idx) => (
                                        <tr
                                            key={idx}
                                            className={`border-b border-slate-100 hover:bg-slate-50/50 transition-all duration-200 ${
                                                idx % 2 === 0 ? "bg-white/50" : "bg-slate-50/30"
                                            }`}
                                        >
                                            <td className="p-4 whitespace-nowrap text-slate-700 font-mono text-xs">
                                                {new Date(log.date).toLocaleString('he-IL')}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    log.type === 'create' ? 'bg-green-100 text-green-800' :
                                                    log.type === 'update' ? 'bg-blue-100 text-blue-800' :
                                                    log.type === 'delete' ? 'bg-red-100 text-red-800' :
                                                    log.type === 'login' ? 'bg-purple-100 text-purple-800' :
                                                    log.type === 'export' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {ACTION_TYPES.find(t => t.value === log.type)?.label || log.type}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-700 font-medium">{log.executeAccount}</td>
                                            <td className="p-4 text-slate-600">{log.executeProfile || "-"}</td>
                                            <td className="p-4 text-slate-700">{log.action}</td>
                                            <td className="p-4 break-words max-w-xs">
                                                {typeof log.target === "object" ? (
                                                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2">
                                                        <pre className="whitespace-pre-wrap text-xs text-slate-600 font-mono overflow-x-auto">
                                                            {JSON.stringify(log.target, null, 2)}
                                                        </pre>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-600">{log.target || "-"}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
