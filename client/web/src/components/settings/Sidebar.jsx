import React from 'react';

export default function Sidebar({ sections, activeSection, onSelect }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <nav className="space-y-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSelect(section.id)}
            className={`w-full text-right px-4 py-3 rounded-lg transition-colors ${
              activeSection === section.id
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{section.icon}</span>
              <span>{section.name}</span>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
}
