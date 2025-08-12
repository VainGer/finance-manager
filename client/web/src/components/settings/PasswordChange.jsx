import React from 'react';

export default function PasswordChange({ editMode, passwordForm, setPasswordForm, onSave, onCancel }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">שינוי סיסמת חשבון</h3>

      {editMode ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">סיסמה נוכחית</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="הזן סיסמה נוכחית"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">סיסמה חדשה</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="הזן סיסמה חדשה (מינימום 6 תווים)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">אישור סיסמה חדשה</label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="הזן שוב את הסיסמה החדשה"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={onSave} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">שמור סיסמה</button>
            <button onClick={onCancel} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">בטל</button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">שנה את סיסמת החשבון שלך</p>
          <button onClick={onSave} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">שנה סיסמה</button>
        </div>
      )}
    </div>
  );
}
