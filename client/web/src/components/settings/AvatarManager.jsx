import React from 'react';

export default function AvatarManager({ profile, avatarForm, onSelect, onUpload, onRemove }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">תמונת פרופיל</h3>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {profile?.avatar ? (
              <img src={profile.avatar} alt="תמונת פרופיל" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl">👤</span>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {profile?.avatar ? 'תמונת פרופיל נוכחית' : 'אין תמונת פרופיל'}
            </p>
          </div>
        </div>

        {avatarForm.preview && (
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
              <img src={avatarForm.preview} alt="תצוגה מקדימה" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm text-green-600">תצוגה מקדימה</p>
              <p className="text-xs text-gray-500">{avatarForm.file?.name}</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 flex-wrap">
          <label className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer">
            {avatarForm.preview ? 'בחר תמונה אחרת' : 'בחר תמונה'}
            <input type="file" accept="image/*" onChange={onSelect} className="hidden" />
          </label>

          {avatarForm.preview && (
            <button onClick={onUpload} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
              העלה תמונה
            </button>
          )}

          {profile?.avatar && (
            <button onClick={onRemove} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
              הסר תמונה
            </button>
          )}
        </div>

        <p className="text-xs text-gray-500">גודל מקסימלי: 5MB. פורמטים נתמכים: JPG, PNG, GIF</p>
      </div>
    </div>
  );
}
