import React from 'react';
import Button from '../common/Button';

export default function AvatarManager({ profile, avatarForm, onSelect, onUpload, onRemove }) {
  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold">תמונת פרופיל</h3>
            <p className="text-white/80 text-sm">נהל את תמונת הפרופיל האישית שלך</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Current Avatar Display */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 border-4 border-white shadow-lg flex items-center justify-center">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="תמונת פרופיל" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <h4 className="text-lg font-bold text-slate-800 mb-1">תמונת הפרופיל הנוכחית</h4>
              <p className="text-slate-600 text-sm">
                {profile?.avatar ? 'תמונה פעילה ומוצגת בפרופיל' : 'אין תמונת פרופיל מוגדרת'}
              </p>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {avatarForm.preview && (
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-300 shadow-lg">
                  <img src={avatarForm.preview} alt="תצוגה מקדימה" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <h4 className="text-lg font-bold text-blue-800 mb-1">תצוגה מקדימה</h4>
                <p className="text-blue-700 text-sm font-medium">{avatarForm.file?.name}</p>
                <p className="text-blue-600 text-xs mt-1">התמונה מוכנה להעלאה</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Button 
                onClick={() => document.getElementById('avatar-file-input').click()}
                style="primary" 
                size="auto"
                className="w-full px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white border-0 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{avatarForm.preview ? 'בחר תמונה אחרת' : 'בחר תמונה חדשה'}</span>
                </div>
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
              <Button 
                onClick={onUpload} 
                style="success" 
                size="auto"
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>העלה תמונה</span>
                </div>
              </Button>
            )}

            {profile?.avatar && (
              <Button 
                onClick={onRemove} 
                style="danger" 
                size="auto"
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>הסר תמונה</span>
                </div>
              </Button>
            )}
          </div>

          {/* Guidelines */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-slate-600">
                <p className="font-medium mb-1">הנחיות לתמונת פרופיל:</p>
                <ul className="space-y-1 text-xs">
                  <li>• גודל מקסימלי: 5MB</li>
                  <li>• פורמטים נתמכים: JPG, PNG, GIF</li>
                  <li>• מומלץ: תמונה ריבועית באיכות גבוהה</li>
                  <li>• התמונה תיחתך אוטומטית לעיגול</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
