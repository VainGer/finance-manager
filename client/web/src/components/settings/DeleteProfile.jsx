import React from 'react';

export default function DeleteProfile({ profileName, isOpen, pin, setPin, onOpen, onConfirm, onCancel }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
      <h3 className="text-lg font-semibold mb-4 text-red-600">מחיקת פרופיל</h3>

      {!isOpen ? (
        <div>
          <p className="text-gray-600 mb-4">
            מחיקת הפרופיל תמחק את כל הנתונים הקשורים אליו כולל הוצאות וקטגוריות.
            <br />
            <strong className="text-red-600">פעולה זו אינה ניתנת לביטול!</strong>
          </p>
          <button onClick={onOpen} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
            מחק פרופיל
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <p className="text-red-800 mb-2">
              <strong>אזהרה:</strong> אתה עומד למחוק את הפרופיל "{profileName}"
            </p>
            <p className="text-red-700 text-sm">כל הנתונים יימחקו לצמיתות ולא ניתן יהיה לשחזר אותם.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">הזן את קוד הפרופיל לאישור המחיקה</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="הזן קוד פרופיל (4 ספרות)"
              maxLength="4"
              pattern="\d{4}"
            />
          </div>

          <div className="flex gap-3">
            <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
              אשר מחיקה
            </button>
            <button onClick={onCancel} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
              בטל
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
