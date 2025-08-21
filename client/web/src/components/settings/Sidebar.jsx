import React from 'react';

export default function Sidebar({ sections, activeSection, onSelect }) {
  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          <h3 className="font-bold text-lg">תפריט הגדרות</h3>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSelect(section.id)}
            className={`w-full text-right px-4 py-4 rounded-xl transition-all duration-200 group ${
              activeSection === section.id
                ? 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 shadow-md border border-slate-300 transform scale-[1.02]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`text-xl transition-transform duration-200 ${
                activeSection === section.id ? 'transform scale-110' : 'group-hover:scale-105'
              }`}>
                {section.icon}
              </div>
              <div className="text-right">
                <span className={`font-medium ${
                  activeSection === section.id ? 'text-slate-800' : ''
                }`}>
                  {section.name}
                </span>
                {activeSection === section.id && (
                  <div className="text-xs text-slate-600 mt-1">פעיל כעת</div>
                )}
              </div>
              {activeSection === section.id && (
                <div className="mr-auto">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-4">
        <div className="text-center text-xs text-slate-500">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>הגדרות מאובטחות</span>
          </div>
        </div>
      </div>
    </div>
  );
}
