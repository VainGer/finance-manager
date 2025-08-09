import React from 'react';

export default function MessageBanner({ message }) {
  if (!message) return null;
  const isSuccess = message.includes('בהצלחה');
  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
      <div
        className={`p-4 rounded-lg shadow-lg border-2 text-center font-medium ${
          isSuccess
            ? 'bg-green-100 text-green-800 border-green-400'
            : 'bg-red-100 text-red-800 border-red-400'
        }`}
        style={{ animation: 'slideDown 0.3s ease-out' }}
      >
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl">{isSuccess ? '✅' : '❌'}</span>
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
}
