import React from 'react';

export default function AccountSection({ account, onLogout, onPasswordChange }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">פרטי חשבון</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שם משתמש</label>
            <div className="p-3 bg-gray-50 rounded border">{account?.username || 'לא זמין'}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
            <div className="p-3 bg-gray-50 rounded border">{account?.email || 'לא זמין'}</div>
          </div>
        </div>

        <div className="mt-6">
          <button onClick={onLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
            התנתק
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">שינוי סיסמת חשבון</h3>

        <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-yellow-400">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                שינוי סיסמת החשבון אינו זמין כרגע במערכת. לשינוי סיסמה, אנא פנה לתמיכה הטכנית.
              </p>
            </div>
          </div>
        </div>

        <button onClick={onPasswordChange} disabled className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed">
          שנה סיסמה (לא זמין)
        </button>
      </div>
    </div>
  );
}
