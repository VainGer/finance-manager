import { useState } from 'react';
import CreateProfileBudget from './CreateProfileBudget';
import DeleteBudget from './DeleteBudget';

export default function BudgetManagementMenu({ goBack }) {
    const [currentView, setCurrentView] = useState('main'); // 'main' | 'create' | 'delete'

    const handleBack = () => {
        if (currentView === 'main') {
            goBack();
        } else {
            setCurrentView('main');
        }
    };

    if (currentView === 'create') {
        return <CreateProfileBudget goBack={handleBack} />;
    }

    if (currentView === 'delete') {
        return <DeleteBudget goBack={handleBack} />;
    }

    return (
        <div className="p-6 bg-white/95 backdrop-blur-sm">
            <div className="space-y-6">
                <button
                    onClick={goBack}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-colors mb-4 flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    חזרה לתפריט
                </button>

                <div className="grid grid-cols-1 gap-4">
                    {/* Create Budget */}
                    <button
                        onClick={() => setCurrentView('create')}
                        className="group flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all duration-200 hover:shadow-md"
                    >
                        <div className="w-10 h-10 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center transition-colors">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <div className="text-right flex-1">
                            <h4 className="font-semibold text-slate-800">יצירת תקציב חדש</h4>
                            <p className="text-sm text-slate-600">הגדר תקציב חדש לתקופה מסוימת</p>
                        </div>
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Delete Budget */}
                    <button
                        onClick={() => setCurrentView('delete')}
                        className="group flex items-center gap-4 p-4 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-xl transition-all duration-200 hover:shadow-md"
                    >
                        <div className="w-10 h-10 bg-red-100 group-hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <div className="text-right flex-1">
                            <h4 className="font-semibold text-slate-800">מחיקת תקציב</h4>
                            <p className="text-sm text-slate-600">מחק תקציב קיים (ללא מחיקת הנתונים)</p>
                        </div>
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* Info */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl" dir="rtl">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-blue-800 text-sm text-right">
                            <p className="font-medium mb-1">הערה חשובה:</p>
                            <p>מחיקת תקציב תמחק רק את מסגרת התקציב ולא את הנתונים והעסקאות שלך. כל ההוצאות שרשמת יישארו שמורות.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}