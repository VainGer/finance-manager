import React from 'react';
import Button from '../common/Button';

export default function DeleteProfile({ profileName, isOpen, pin, setPin, onOpen, onConfirm, onCancel }) {
  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-red-200 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold">מחיקת פרופיל</h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {!isOpen ? (
          <div className="space-y-6">
            {/* Warning Section */}
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-red-800 mb-2">אזהרה חמורה</h4>
                  <div className="text-red-700 space-y-2">
                    <p>מחיקת הפרופיל תמחק לצמיתות את כל הנתונים הבאים:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>כל ההוצאות והעסקאות</li>
                      <li>קטגוריות מותאמות אישית</li>
                      <li>היסטוריית תקציבים</li>
                      <li>הגדרות פרופיל אישיות</li>
                      <li>תמונת פרופיל</li>
                    </ul>
                    <p className="font-bold text-red-800 mt-3">
                      ⚠️ פעולה זו אינה ניתנת לביטול!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center pt-4">
              <Button 
                onClick={onOpen} 
                style="danger" 
                size="auto"
                className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  המשך למחיקת פרופיל
                </div>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Critical Warning */}
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-red-800 mb-2">אישור מחיקה סופי</h4>
                <p className="text-red-700 text-lg font-semibold mb-1">
                  אתה עומד למחוק את הפרופיל "{profileName}"
                </p>
                <p className="text-red-600 text-sm">
                  כל הנתונים יימחקו לצמיתות ולא ניתן יהיה לשחזר אותם!
                </p>
              </div>
            </div>

            {/* PIN Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                הזן את קוד הפרופיל לאישור המחיקה
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full p-4 pr-12 text-center text-2xl tracking-widest border-2 border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white shadow-sm font-mono"
                  placeholder="●●●●"
                  maxLength="4"
                  pattern="\d{4}"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-red-600 bg-red-50 rounded-lg p-3 border border-red-200">
                הזן את קוד הפרופיל בן 4 הספרות לאישור המחיקה
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-red-200">
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button 
                  onClick={onCancel} 
                  style="secondary" 
                  size="auto"
                  className="px-6 py-3 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 rounded-xl font-medium transition-all duration-200"
                >
                  ביטול המחיקה
                </Button>
                <Button 
                  onClick={onConfirm} 
                  style="danger" 
                  size="auto"
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    אשר מחיקה סופית
                  </div>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
