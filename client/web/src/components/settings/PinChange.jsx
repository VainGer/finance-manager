import React from 'react';
import Button from '../common/Button';

export default function PinChange({ editMode, pinForm, setPinForm, onSave, onCancel }) {
  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold">שינוי קוד פרופיל</h3>
            <p className="text-white/80 text-sm">עדכן את הקוד הסודי של הפרופיל (4 ספרות)</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {editMode ? (
          <div className="space-y-6">
            {/* Current PIN */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">קוד נוכחי</label>
              <div className="relative">
                <input
                  type="password"
                  value={pinForm.currentPin}
                  onChange={(e) => setPinForm(prev => ({ ...prev, currentPin: e.target.value }))}
                  className="w-full p-4 pr-12 text-center text-2xl tracking-widest border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 bg-white shadow-sm font-mono"
                  placeholder="●●●●"
                  maxLength="4"
                  pattern="\d{4}"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* New PIN */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">קוד חדש</label>
              <div className="relative">
                <input
                  type="password"
                  value={pinForm.newPin}
                  onChange={(e) => setPinForm(prev => ({ ...prev, newPin: e.target.value }))}
                  className="w-full p-4 pr-12 text-center text-2xl tracking-widest border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 bg-white shadow-sm font-mono"
                  placeholder="●●●●"
                  maxLength="4"
                  pattern="\d{4}"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-slate-600 bg-slate-50 rounded-lg p-3 border border-slate-200">
                הקוד חייב להכיל בדיוק 4 ספרות
              </p>
            </div>

            {/* Confirm PIN */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">אישור קוד חדש</label>
              <div className="relative">
                <input
                  type="password"
                  value={pinForm.confirmPin}
                  onChange={(e) => setPinForm(prev => ({ ...prev, confirmPin: e.target.value }))}
                  className="w-full p-4 pr-12 text-center text-2xl tracking-widest border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 bg-white shadow-sm font-mono"
                  placeholder="●●●●"
                  maxLength="4"
                  pattern="\d{4}"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
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
                  style="success"
                  size="auto"
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  שמור קוד חדש
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              </div>
              <p className="text-slate-700 text-lg font-semibold mb-2">שינוי קוד פרופיל</p>
              <p className="text-slate-600">עדכן את הקוד הסודי של הפרופיל (4 ספרות)</p>
            </div>
            <Button
              onClick={onSave}
              style="primary"
              size="auto"
              className="px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white border-0 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              שנה קוד פרופיל
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
