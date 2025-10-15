import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useAdminProfiles from "../../hooks/admin/useAdminProfiles";

export default function AdminProfiles() {
    const navigate = useNavigate();
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-6 rtl relative overflow-hidden" dir="rtl">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-blue-100/35 to-cyan-100/25 rounded-full blur-xl"></div>
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
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-6 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-800 mb-4">ניהול פרופילים</h1>
                    <p className="text-xl text-slate-600">צפייה, עדכון ומחיקת פרופילי משתמשים</p>
                </div>

                {/* Search Section */}
                <div className="mb-8">
                    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1 max-w-md">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="חיפוש לפי שם משתמש..."
                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 pr-12 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="text-sm text-slate-600 bg-slate-100 px-4 py-2 rounded-xl">
                                {filteredGroups.length} חשבונות
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading and Error States */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
                            <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
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

                {!loading && !error && filteredGroups.length === 0 && (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 shadow-lg">
                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                            </svg>
                            <span className="text-gray-500">לא נמצאו תוצאות</span>
                        </div>
                    </div>
                )}

                {!loading && !error && filteredGroups.length > 0 && (
                    <div className="space-y-8">
                        {filteredGroups.map((group, groupIndex) => (
                            <div 
                                key={group.account} 
                                className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg overflow-hidden animate-fadeIn"
                                style={{ animationDelay: `${groupIndex * 100}ms` }}
                            >
                                {/* Account Header */}
                                <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                                </svg>
                                            </div>
                                            חשבון: {group.account}
                                        </h2>
                                        <div className="flex items-center gap-2 text-white/80 text-sm">
                                            <span>{group.profiles.length} פרופילים</span>
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Profiles Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-50 border-b border-slate-200">
                                            <tr>
                                                <th className="text-right p-4 font-semibold text-slate-700">שם פרופיל</th>
                                                <th className="text-right p-4 font-semibold text-slate-700">מזהה הוצאות</th>
                                                <th className="text-center p-4 font-semibold text-slate-700 w-40">פעולות</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {group.profiles.map((profile, profileIndex) => (
                                                <tr 
                                                    key={profile.profileName} 
                                                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors duration-200"
                                                >
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
                                                                <span className="text-white text-sm font-semibold">
                                                                    {profile.profileName.charAt(0)}
                                                                </span>
                                                            </div>
                                                            <span className="font-medium text-slate-800">{profile.profileName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <code className="bg-slate-100 px-2 py-1 rounded text-xs text-slate-600 break-all">
                                                            {profile.expenses}
                                                        </code>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex justify-center gap-2">
                                                            <button
                                                                onClick={() => openEditModal(group, profile)}
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                                                            >
                                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                                                </svg>
                                                                עריכה
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(group.account, profile.profileName)
                                                                }
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                                                            >
                                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                                                </svg>
                                                                מחיקה
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            {/* Edit Modal */}
            {editing && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl p-6 w-full max-w-lg relative animate-scaleIn my-8 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                </svg>
                            </div>
                            עריכת פרופיל - {editing.profileName}
                        </h2>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-slate-700">
                                    שם פרופיל חדש
                                </label>
                                <input
                                    type="text"
                                    value={editForm.newProfileName}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, newProfileName: e.target.value })
                                    }
                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-slate-700">
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
                                    placeholder="••••"
                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-slate-700">
                                    צבע
                                </label>
                                <div className="grid grid-cols-6 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
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
                                            className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 hover:scale-110 hover:shadow-lg ${editForm.color === color
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
                                <label className="block text-sm font-semibold mb-2 text-slate-700">
                                    Avatar URL
                                </label>
                                <input
                                    type="text"
                                    value={editForm.avatar}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, avatar: e.target.value })
                                    }
                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                    placeholder="https://example.com/avatar.png"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => setEditing(null)}
                                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-medium transition-colors duration-200"
                                >
                                    ביטול
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
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
