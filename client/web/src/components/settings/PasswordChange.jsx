import React from 'react';
import Button from '../common/Button';

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
            <Button onClick={onSave} style="success" size="auto">שמור סיסמה</Button>
            <Button onClick={onCancel} style="secondary" size="auto">בטל</Button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">שנה את סיסמת החשבון שלך</p>
          <Button onClick={onSave} style="primary" size="auto">שנה סיסמה</Button>
        </div>
      )}
    </div>
  );
}
