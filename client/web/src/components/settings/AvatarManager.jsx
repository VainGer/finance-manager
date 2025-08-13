import React from 'react';
import Button from '../common/Button';

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
          <div className="relative">
            <Button 
              onClick={() => document.getElementById('avatar-file-input').click()}
              style="primary" 
              size="auto"
            >
              {avatarForm.preview ? 'בחר תמונה אחרת' : 'בחר תמונה'}
            </Button>
            <input 
              id="avatar-file-input"
              type="file" 
              accept="image/*" 
              onChange={onSelect} 
              className="hidden" 
            />
          </div>

          {avatarForm.preview && (
            <Button onClick={onUpload} style="success" size="auto">
              העלה תמונה
            </Button>
          )}

          {profile?.avatar && (
            <Button onClick={onRemove} style="danger" size="auto">
              הסר תמונה
            </Button>
          )}
        </div>

        <p className="text-xs text-gray-500">גודל מקסימלי: 5MB. פורמטים נתמכים: JPG, PNG, GIF</p>
      </div>
    </div>
  );
}
