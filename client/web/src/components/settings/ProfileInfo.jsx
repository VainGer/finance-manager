import React from 'react';
import Button from '../common/Button';

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
          <label className="block text-sm font-medium text-gray-700 mb-3">צבע פרופיל</label>
          {editMode ? (
            <div className="space-y-4">
              <div className="grid grid-cols-6 gap-3 p-4 bg-gray-50 rounded-lg border">
                {[
                  { color: '#FF0000', name: 'אדום' },     // Classic Red
                  { color: '#00AA00', name: 'ירוק' },     // Classic Green  
                  { color: '#0066FF', name: 'כחול' },     // Classic Blue
                  { color: '#FFD700', name: 'צהוב' },     // Gold
                  { color: '#FF6B35', name: 'כתום' },     // Modern Orange
                  { color: '#800080', name: 'סגול' },     // Classic Purple
                  { color: '#FF1493', name: 'ורוד' },     // Deep Pink
                  { color: '#20B2AA', name: 'טורקיז' },   // Light Sea Green
                  { color: '#4B0082', name: 'אינדיגו' },  // Indigo
                  { color: '#708090', name: 'אפור' },     // Slate Gray
                  { color: '#8B4513', name: 'חום' },      // Saddle Brown
                  { color: '#2E8B57', name: 'ירוק ים' }   // Sea Green
                ].map(({ color, name }) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setProfileForm(prev => ({ ...prev, color }))}
                    className={`group relative w-10 h-10 rounded-xl border-2 transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                      profileForm.color === color 
                        ? 'border-gray-800 shadow-lg scale-105 ring-2 ring-gray-400 ring-opacity-50' 
                        : 'border-gray-300 hover:border-gray-500'
                    }`}
                    style={{ backgroundColor: color }}
                    title={`${name} (${color})`}
                  >
                    {profileForm.color === color && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-200"></div>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full border border-gray-300 shadow-sm"
                    style={{ backgroundColor: profileForm.color }}
                  ></div>
                  <span className="text-gray-700 font-medium">צבע נבחר:</span>
                  <span className="text-gray-600 font-mono text-xs bg-gray-100 px-2 py-1 rounded">{profileForm.color}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
              <div
                className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                style={{ backgroundColor: profile?.color || '#6B7280' }}
              ></div>
              <div className="flex flex-col">
                <span className="text-gray-800 font-medium">{profile?.color || 'לא נבחר'}</span>
                <span className="text-gray-500 text-xs">צבע הפרופיל והתפריט</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        {editMode ? (
          <>
            <Button
              onClick={onSave}
              style="success"
              size="auto"
            >
              שמור שינויים
            </Button>
            <Button
              onClick={onCancel}
              style="secondary"
              size="auto"
            >
              בטל
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={onSave}
              style="primary"
              size="auto"
            >
              ערוך פרופיל
            </Button>
            <Button
              onClick={onSwitchProfile}
              style="secondary"
              size="auto"
            >
              החלף פרופיל
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
