import React from 'react';
import Button from '../common/Button';

export default function ProfileInfo({ profile, account, editMode, profileForm, setProfileForm, onSave, onCancel, onSwitchProfile }) {
  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold">פרטי פרופיל</h3>
            <p className="text-white/80 text-sm">נהל את פרטי הפרופיל האישי שלך</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">שם פרופיל</label>
            {editMode ? (
              <input
                type="text"
                value={profileForm.profileName}
                onChange={(e) => setProfileForm(prev => ({ ...prev, profileName: e.target.value }))}
                className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 bg-white shadow-sm"
                placeholder="הכנס שם פרופיל"
              />
            ) : (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-slate-800">
                    {profile?.profileName || 'לא זמין'}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">סוג פרופיל</label>
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={profile?.parentProfile ? "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" : "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"} />
                  </svg>
                </div>
                <span className="font-semibold text-slate-800">
                  {profile?.parentProfile ? 'פרופיל הורה' : 'פרופיל ילד'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">צבע פרופיל</label>
          {editMode ? (
            <div className="space-y-4">
              <div className="grid grid-cols-6 gap-3 p-5 bg-slate-50 rounded-xl border border-slate-200">
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
                  { color: '#2E8B57', name: 'ירוק ים' }
                ].map(({ color, name }) => (
                  <button
                    key={color}
                    onClick={() => setProfileForm(prev => ({ ...prev, profileColor: color }))}
                    className={`w-12 h-12 rounded-xl border-4 transition-all duration-200 hover:scale-110 hover:shadow-lg ${profileForm.profileColor === color
                        ? 'border-slate-800 shadow-lg transform scale-105'
                        : 'border-slate-300 hover:border-slate-500'
                      }`}
                    style={{ backgroundColor: color }}
                    title={name}
                  />
                ))}
              </div>
              <div className="text-center text-sm text-slate-600 bg-slate-50 rounded-lg p-3 border border-slate-200">
                צבע נבחר: <span className="font-semibold" style={{ color: profileForm.profileColor }}>
                  {[
                    { color: '#FF0000', name: 'אדום' }, { color: '#00AA00', name: 'ירוק' }, { color: '#0066FF', name: 'כחול' },
                    { color: '#FFD700', name: 'צהוב' }, { color: '#FF6B35', name: 'כתום' }, { color: '#800080', name: 'סגול' },
                    { color: '#FF1493', name: 'ורוד' }, { color: '#20B2AA', name: 'טורקיז' }, { color: '#4B0082', name: 'אינדיגו' },
                    { color: '#708090', name: 'אפור' }, { color: '#8B4513', name: 'חום' }, { color: '#2E8B57', name: 'ירוק ים' }
                  ].find(c => c.color === profileForm.profileColor)?.name || 'לא ידוע'}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg border-2 border-white shadow-lg"
                  style={{ backgroundColor: profile?.color || '#0066FF' }}
                ></div>
                <span className="font-semibold text-slate-800">צבע פרופיל מותאם אישית</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Switching Section */}
      {account?.profiles && account.profiles.length > 1 && (
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              החלפת פרופיל
            </h4>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {account.profiles.map((prof) => (
                  <button
                    key={prof.profileId}
                    onClick={() => onSwitchProfile(prof.profileId)}
                    disabled={prof.profileId === profile?.profileId}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${prof.profileId === profile?.profileId
                        ? 'border-slate-400 bg-slate-100 cursor-not-allowed opacity-75'
                        : 'border-slate-200 bg-white hover:border-slate-400 hover:shadow-md cursor-pointer'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-lg border border-white shadow-sm"
                        style={{ backgroundColor: prof.profileColor || '#0066FF' }}
                      ></div>
                      <div className="text-right">
                        <div className="font-semibold text-slate-800 text-sm">{prof.profileName}</div>
                        <div className="text-xs text-slate-600">
                          {prof.parentProfile ? 'הורה' : 'ילד'}
                        </div>
                      </div>
                      {prof.profileId === profile?.profileId && (
                        <div className="mr-auto">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          {editMode ? (
            <>
              <Button
                onClick={onCancel}
                style="secondary"
                size="auto"
                className="px-6 py-3 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 rounded-xl font-medium transition-all duration-200"
              >
                ביטול
              </Button>
              <Button
                onClick={onSave}
                style="primary"
                size="auto"
                className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white border-0 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                שמור שינויים
              </Button>
            </>
          ) : (
            <Button
              onClick={onSave}
              style="primary"
              size="auto"
              className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white border-0 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              ערוך פרטים
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
