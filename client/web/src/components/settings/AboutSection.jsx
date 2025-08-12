import React from 'react';

export default function AboutSection() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">אודות האפליקציה</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-800">Finance Manager</h4>
            <p className="text-sm text-gray-600">מערכת ניהול כספים משפחתית</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-800">גרסה</h4>
            <p className="text-sm text-gray-600">1.0.0</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-800">מפתח</h4>
            <p className="text-sm text-gray-600">צוות Finance Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
}
