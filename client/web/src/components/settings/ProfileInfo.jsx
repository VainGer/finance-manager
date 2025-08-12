import React from 'react';

export default function ProfileInfo({ profile, account, editMode, profileForm, setProfileForm, onSave, onCancel, onSwitchProfile }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">פרטי פרופיל</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">שם פרופיל</label>
          {editMode ? (
            <input
              type="text"
              value={profileForm.profileName}
              onChange={(e) => setProfileForm(prev => ({ ...prev, profileName: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded border">
              {profile?.profileName || 'לא זמין'}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">סוג פרופיל</label>
          <div className="p-3 bg-gray-50 rounded border">
            {profile?.parentProfile ? 'פרופיל הורה' : 'פרופיל ילד'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">צבע פרופיל</label>
          {editMode ? (
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={profileForm.color}
                onChange={(e) => setProfileForm(prev => ({ ...prev, color: e.target.value }))}
                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <span className="text-gray-600">{profileForm.color}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: profile?.color || '#gray' }}
              ></div>
              <span className="text-gray-600">{profile?.color || 'לא נבחר'}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        {editMode ? (
          <>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              שמור שינויים
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              בטל
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              ערוך פרופיל
            </button>
            <button
              onClick={onSwitchProfile}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              החלף פרופיל
            </button>
          </>
        )}
      </div>
    </div>
  );
}
