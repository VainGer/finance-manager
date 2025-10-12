import { useState, useMemo } from "react";
import useAdminProfiles from "../../hooks/admin/useAdminProfiles";

export default function AdminProfiles() {
    const { groupedProfiles, loading, error, updateProfile, deleteProfile } = useAdminProfiles();

    const [editing, setEditing] = useState(null); // { username, profileName }
    const [searchQuery, setSearchQuery] = useState("");

    // Form state for editing
    const [editForm, setEditForm] = useState({
        newProfileName: "",
        newPin: "",
        color: "",
        avatar: ""
    });

    const filteredGroups = useMemo(() => {
        if (!searchQuery.trim()) return groupedProfiles;
        const lower = searchQuery.toLowerCase();
        return groupedProfiles.filter(g => g.account.toLowerCase().includes(lower));
    }, [groupedProfiles, searchQuery]);

    const handleDelete = async (username, profileName) => {
        if (!confirm(`האם למחוק את הפרופיל "${profileName}"?`)) return;
        await deleteProfile(username, profileName);
    };

    const openEditModal = (group, profile) => {
        setEditing({ username: group.account, profileName: profile.profileName });
        setEditForm({
            newProfileName: profile.profileName,
            newPin: "",
            color: "",
            avatar: ""
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editing) return;

        const updates = {};
        if (editForm.newProfileName && editForm.newProfileName !== editing.profileName) {
            updates.newProfileName = editForm.newProfileName;
        }
        if (editForm.newPin) updates.newPin = editForm.newPin;
        if (editForm.color) updates.color = editForm.color;
        if (editForm.avatar) updates.avatar = editForm.avatar;

        const res = await updateProfile(editing.username, editing.profileName, updates);
        if (res.success) {
            setEditing(null);
        }
    };

    return (
        <div className="p-6 bg-gradient-to-b from-slate-50 to-gray-100 min-h-screen" dir="rtl">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">ניהול פרופילים</h1>

            {/* Search bar */}
            <div className="mb-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="חיפוש לפי שם משתמש..."
                    className="border rounded-md p-2 text-sm w-72 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
            </div>

            {loading && <div className="p-4 text-center text-gray-600">טוען נתונים...</div>}
            {error && <div className="p-4 text-center text-red-600">{error}</div>}

            {!loading && !error && filteredGroups.length === 0 && (
                <div className="p-4 text-center text-gray-500">לא נמצאו תוצאות</div>
            )}

            {!loading && !error && filteredGroups.length > 0 && (
                <div className="space-y-6">
                    {filteredGroups.map((group) => (
                        <div key={group.account} className="bg-white rounded-lg shadow border p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-semibold text-slate-800">
                                    חשבון: {group.account}
                                </h2>
                            </div>

                            <table className="w-full text-sm text-right">
                                <thead className="bg-gray-100 text-xs uppercase text-slate-700 border-b">
                                    <tr>
                                        <th className="p-2">שם פרופיל</th>
                                        <th className="p-2">מזהה הוצאות</th>
                                        <th className="p-2 w-32 text-center">פעולות</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {group.profiles.map((profile) => (
                                        <tr key={profile.profileName} className="border-b hover:bg-slate-50">
                                            <td className="p-2">{profile.profileName}</td>
                                            <td className="p-2 break-all">{profile.expenses}</td>
                                            <td className="p-2 flex justify-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(group, profile)}
                                                    className="text-indigo-600 hover:underline text-sm"
                                                >
                                                    עריכה
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(group.account, profile.profileName)
                                                    }
                                                    className="text-red-600 hover:underline text-sm"
                                                >
                                                    מחיקה
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {editing && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                        <h2 className="text-xl font-semibold mb-4 text-slate-800">
                            עריכת פרופיל - {editing.profileName}
                        </h2>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700">
                                    שם פרופיל חדש
                                </label>
                                <input
                                    type="text"
                                    value={editForm.newProfileName}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, newProfileName: e.target.value })
                                    }
                                    className="border rounded-md p-2 w-full text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700">
                                    PIN חדש (4 ספרות)
                                </label>
                                <input
                                    type="password"
                                    value={editForm.newPin}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, newPin: e.target.value })
                                    }
                                    maxLength={4}
                                    pattern="\d{4}"
                                    className="border rounded-md p-2 w-full text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700">
                                    צבע
                                </label>
                                <div className="grid grid-cols-6 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    {[
                                        { color: '#FF0000', name: 'אדום' },
                                        { color: '#00AA00', name: 'ירוק' },
                                        { color: '#0066FF', name: 'כחול' },
                                        { color: '#FFD700', name: 'צהוב' },
                                        { color: '#FF6B35', name: 'כתום' },
                                        { color: '#800080', name: 'סגול' },
                                        { color: '#FF1493', name: 'ורוד' },
                                        { color: '#20B2AA', name: 'טורקיז' },
                                        { color: '#4B0082', name: 'אינדיגו' },
                                        { color: '#708090', name: 'אפור' },
                                        { color: '#8B4513', name: 'חום' },
                                        { color: '#2E8B57', name: 'ירוק ים' },
                                        { color: '#FFFFFF', name: 'לבן' },
                                        { color: '#A52A2A', name: 'אדום חום' },
                                        { color: '#00CED1', name: 'טורקיז כהה' },
                                        { color: '#DAA520', name: 'זהב כהה' },
                                        { color: '#C0C0C0', name: 'כסף' },
                                        { color: '#ADFF2F', name: 'ירוק בהיר' },
                                    ].map(({ color, name }) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setEditForm(prev => ({ ...prev, color }))}
                                            className={`w-10 h-10 rounded-xl border-4 transition-all duration-200 hover:scale-110 hover:shadow-lg ${editForm.color === color
                                                    ? 'border-slate-800 shadow-lg transform scale-105'
                                                    : 'border-slate-300 hover:border-slate-500'
                                                }`}
                                            style={{ backgroundColor: color }}
                                            title={name}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700">
                                    Avatar URL
                                </label>
                                <input
                                    type="text"
                                    value={editForm.avatar}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, avatar: e.target.value })
                                    }
                                    className="border rounded-md p-2 w-full text-sm"
                                    placeholder="https://example.com/avatar.png"
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditing(null)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300"
                                >
                                    ביטול
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                                >
                                    שמירה
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
