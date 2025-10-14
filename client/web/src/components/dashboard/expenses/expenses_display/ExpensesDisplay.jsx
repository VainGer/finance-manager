import { useAuth } from '../../../../context/AuthContext';
import useExpensesDisplay from '../../../../hooks/expenses/useExpensesDisplay';
import LoadingSpinner from '../../../common/LoadingSpinner';
import ExpensesTable from './ExpensesTable';
import Filters from './Filters';
import ExpensesSummary from './ExpensesSummary';


function Header({ profile, authProfile, children, selectedChild, setSelectedChild }) {
    return (
        <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 p-5 text-white relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-white/30 to-white/10 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white drop-shadow-sm">🛍️ הוצאות</h2>
                    <p className="text-white/80 text-sm">מעקב ובקרה על כל העסקאות שלך</p>
                </div>
            </div>

            {(authProfile?.parentProfile || profile?.parentProfile) && children?.length > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <span className="text-white/90 text-sm font-medium">👥 צפה בפרופיל:</span>
                    <select
                        value={selectedChild || ''}
                        onChange={(e) => setSelectedChild(e.target.value || null)}
                        className="bg-gradient-to-r from-white/25 to-white/15 border border-white/40 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/60 backdrop-blur-sm shadow-sm font-medium"
                    >
                        <option value="">שלי</option>
                        {children.map((child) => (
                            <option key={child.id} value={child.id} className="text-black">
                                {child.profileName || child.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}

function LoadingState() {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg overflow-hidden relative">
            <BackgroundDecor />
            <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 p-5 text-white relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-white/30 to-white/10 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white drop-shadow-sm">🛍️ הוצאות</h2>
                        <p className="text-white/80 text-sm">טוען נתונים...</p>
                    </div>
                </div>
            </div>
            <div className="p-8 relative z-10">
                <LoadingSpinner />
            </div>
        </div>
    );
}

function ErrorState({ message }) {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg overflow-hidden relative">
            <BackgroundDecor />
            <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 p-5 text-white relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-white/30 to-white/10 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white drop-shadow-sm">🛍️ הוצאות</h2>
                        <p className="text-white/80 text-sm">שגיאה בטעינת הנתונים</p>
                    </div>
                </div>
            </div>
            <div className="p-6 text-center relative z-10">
                <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="text-xl font-bold text-slate-700 mb-2">שגיאה בטעינת הנתונים</div>
                <div className="text-slate-500">{message}</div>
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg overflow-hidden relative">
            <BackgroundDecor />
            <div className="p-8 text-center relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-100/80 to-emerald-100/60 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <div className="text-lg font-bold text-slate-700 mb-2">🎯 בואו נתחיל לעקוב אחר ההוצאות!</div>
                <div className="text-slate-500 mb-4 text-sm max-w-sm mx-auto">הוסף את ההוצאה הראשונה שלך כדי להתחיל לנהל את התקציב בחכמה</div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100/80 to-emerald-100/60 rounded-xl text-sm text-green-700 font-medium shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    השתמש בכפתור הפעולות המהירות
                </div>
            </div>
        </div>
    );
}

function BackgroundDecor() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-green-100/30 to-emerald-100/20 rounded-full"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-teal-100/25 to-cyan-100/15 rounded-full"></div>
        </div>
    );
}


export default function ExpensesDisplay({ profile }) {
    const { profile: authProfile } = useAuth();

    const {
        expenses,
        isLoading,
        error,
        availableDates,
        availableBusinesses,
        filterByMonth,
        filterByCategory,
        filterByBusiness,
        clearFilters,
        applyFilters,
        stagedFilters,
        categories,
        businesses,
        childrenProps,
        refetchExpenses,
        sortByDate,
        sortByAmount
    } = useExpensesDisplay();

    const {
        children,
        loading: childrenLoading,
        error: childrenError,
        selectedChild,
        setSelectedChild
    } = childrenProps;

    const loading = isLoading || (selectedChild && childrenLoading);
    const finalError = error || (selectedChild && childrenError);

    if (loading) return <LoadingState />;
    if (finalError) return <ErrorState message={finalError} />;
    if (!expenses || expenses.length === 0) return <EmptyState />;

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg overflow-hidden relative">
            <Header
                profile={profile}
                authProfile={authProfile}
                children={children}
                selectedChild={selectedChild}
                setSelectedChild={setSelectedChild}
            />

            <div className="p-6 space-y-6">
                <Filters
                    availableDates={availableDates}
                    availableBusinesses={businesses}
                    stagedFilters={stagedFilters}
                    filterByMonth={filterByMonth}
                    filterByCategory={filterByCategory}
                    filterByBusiness={filterByBusiness}
                    sortByDate={sortByDate}
                    sortByAmount={sortByAmount}
                    clearFilters={clearFilters}
                    applyFilters={applyFilters}
                    categories={categories}
                />
                <ExpensesSummary filteredExpenses={expenses} />
                <ExpensesTable
                    filteredExpenses={expenses}
                    expensesId={profile.expenses}
                    onTransactionDeleted={refetchExpenses}
                    onTransactionUpdated={refetchExpenses}
                    readOnly={!!selectedChild}
                />
            </div>
        </div>
    );
}
