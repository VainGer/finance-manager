import React from 'react';

export default function PinChange({ editMode, pinForm, setPinForm, onSave, onCancel }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">שינוי קוד פרופיל</h3>

      {editMode ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">קוד נוכחי</label>
            <input
              type="password"
              value={pinForm.currentPin}
              onChange={(e) => setPinForm(prev => ({ ...prev, currentPin: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="הזן קוד נוכחי (4 ספרות)"
              maxLength="4"
              pattern="\d{4}"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">קוד חדש</label>
            <input
              type="password"
              value={pinForm.newPin}
              onChange={(e) => setPinForm(prev => ({ ...prev, newPin: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="הזן קוד חדש (4 ספרות)"
              maxLength="4"
              pattern="\d{4}"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">אישור קוד חדש</label>
            <input
              type="password"
              value={pinForm.confirmPin}
              onChange={(e) => setPinForm(prev => ({ ...prev, confirmPin: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="הזן שוב קוד חדש (4 ספרות)"
              maxLength="4"
              pattern="\d{4}"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={onSave}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              שמור קוד חדש
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              בטל
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">שנה את הקוד הסודי של הפרופיל</p>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            שנה קוד פרופיל
          </button>
        </div>
      )}
    </div>
  );
}
