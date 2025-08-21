import useExpensesDisplay from '../../../../hooks/useExpensesDisplay';
import LoadingSpinner from '../../../common/LoadingSpinner';
import ErrorMessage from '../../../common/ErrorMessage';
import ExpensesTable from './ExpensesTable';
import Filters from './Filters';
import ExpensesSummary from './ExpensesSummary';

export default function ExpensesDisplay({ profile }) {

    const { expenses, filteredExpenses, loading, error, filters,
        setFilters, categories, businesses, refetchExpenses } = useExpensesDisplay(profile);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6">
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="text-xl font-bold text-slate-700 mb-2">שגיאה בטעינת הנתונים</div>
                    <div className="text-slate-500">{error}</div>
                </div>
            </div>
        );
    }

    if (expenses && expenses.length === 0) {
        return (
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">הוצאות</h2>
                </div>
                <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <div className="text-xl font-bold text-slate-600 mb-3">עדיין אין הוצאות</div>
                    <div className="text-slate-500 mb-6">הוסף את ההוצאה הראשונה שלך כדי להתחיל</div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        השתמש בכפתור הפעולות המהירות
                    </div>
                </div>
            </div>
        );
    }



    return (
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">הוצאות</h2>
                        <p className="text-white/80 text-sm">מעקב ובקרה על כל העסקאות</p>
                    </div>
                </div>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6">
                <Filters filters={filters} setFilters={setFilters} categories={categories} businesses={businesses} />
                <ExpensesSummary filteredExpenses={filteredExpenses} />
                <ExpensesTable filteredExpenses={filteredExpenses} expensesId={profile.expenses} onTransactionDeleted={refetchExpenses} />
            </div>
        </div>
    );
}
