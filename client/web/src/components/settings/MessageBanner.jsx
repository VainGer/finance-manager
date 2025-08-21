import React from 'react';

export default function MessageBanner({ message }) {
  if (!message) return null;
  
  const isSuccess = message.includes('בהצלחה');
  const isError = message.includes('שגיאה') || message.includes('נכשל');
  const isWarning = !isSuccess && !isError;

  const getStyles = () => {
    if (isSuccess) {
      return {
        container: 'bg-green-50/95 backdrop-blur-lg border-green-200 text-green-800',
        icon: 'bg-green-500',
        iconSvg: (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      };
    }
    if (isError) {
      return {
        container: 'bg-red-50/95 backdrop-blur-lg border-red-200 text-red-800',
        icon: 'bg-red-500',
        iconSvg: (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      };
    }
    return {
      container: 'bg-yellow-50/95 backdrop-blur-lg border-yellow-200 text-yellow-800',
      icon: 'bg-yellow-500',
      iconSvg: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    };
  };

  const styles = getStyles();

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
      <div
        className={`${styles.container} p-4 rounded-2xl shadow-xl border-2 text-center font-medium`}
        style={{ animation: 'slideDown 0.3s ease-out' }}
      >
        <div className="flex items-center justify-center gap-3">
          <div className={`${styles.icon} w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0`}>
            {styles.iconSvg}
          </div>
          <span className="text-sm font-semibold">{message}</span>
        </div>
      </div>
    </div>
  );
}
