import React from 'react';
import Button from '../common/Button';

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
          <Button onClick={onOpen} style="danger" size="auto">
            מחק פרופיל
          </Button>
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
            <Button onClick={onConfirm} style="danger" size="auto">
              אשר מחיקה
            </Button>
            <Button onClick={onCancel} style="secondary" size="auto">
              בטל
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
