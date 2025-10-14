import { useAuth } from '../../../context/AuthContext';
import useBudgetSummary from '../../../hooks/expenses/useBudgetSummary';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorMessage from '../../common/ErrorMessage';
import BudgetPeriodSelector from './BudgetPeriodSelector';
import OverallBudgetSummary from './OverallBudgetSummary';
import CategoryBudgetDetails from './CategoryBudgetDetails';

export default function ProfileBudgetDisplay({ profile }) {
    const { profile: authProfile } = useAuth();
    const {
        loading,
        error,
        availablePeriods,
        selectedPeriod,
        setSelectedPeriod,
        currentProfileBudget,
        currentCategoryBudgets,
        relevantPeriod,
        childrenProps
    } = useBudgetSummary();

    const { children, selectedChild, setSelectedChild } = childrenProps;



    if (error) {
        return (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg overflow-hidden relative">
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-5 text-white relative z-10">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold">💰 תקציב מול הוצאות</h2>
                        <p className="text-white/80 text-sm">שגיאה בטעינת הנתונים</p>
                    </div>
                </div>
                <div className="p-6 relative z-10">
                    <ErrorMessage message={error} />
                </div>
            </div>
        );
    }


    if (loading) {
        return (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg overflow-hidden relative">
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-5 text-white relative z-10">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold">💰 תקציב מול הוצאות</h2>
                        <p className="text-white/80 text-sm">טוען נתונים...</p>
                    </div>
                </div>
                <div className="p-8 relative z-10">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }


    const Header = (
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-5 text-white relative z-10 flex justify-between">
            <div>
                <h2 className="text-xl font-bold">💰 תקציב מול הוצאות</h2>
                <p className="text-white/80 text-sm">{profile.profileName}</p>
            </div>
            {(authProfile?.parentProfile || profile?.parentProfile) && children?.length > 0 && (
                <select
                    value={selectedChild || ''}
                    onChange={(e) => setSelectedChild(e.target.value || null)}
                    className="bg-white/20 rounded-lg px-3 py-1 text-white text-sm"
                >
                    <option value="">שלי</option>
                    {children.map((child) => (
                        <option key={child.id} value={child.id} className="text-black">
                            {child.profileName || child.name}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );


    if (!currentProfileBudget) {
        return (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg overflow-hidden relative">
                {Header}
                <div className="p-8 text-center">
                    <p className="text-lg font-bold text-slate-700">
                        {selectedChild ? '📊 אין תקציבים לפרופיל זה' : '💰 בואו ניצור תקציב ראשון!'}
                    </p>
                    {!selectedChild && (
                        <div>
                            <p className="text-slate-500 mt-2 text-sm">
                                צור תקציב ראשון כדי להתחיל לעקוב אחר ההוצאות ולנהל את הכספים בחכמה
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }


    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg overflow-hidden relative">
            {Header}
            <div className="p-6 space-y-6">
                {/* Period Selector */}
                {availablePeriods?.length > 0 && (
                    <BudgetPeriodSelector
                        periods={availablePeriods}
                        selectedPeriod={selectedPeriod}
                        onSelectPeriod={setSelectedPeriod}
                    />
                )}

                {/* Not relevant period warning */}
                {!relevantPeriod && selectedPeriod && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-700 text-sm">
                        ⚠️ התקציב המוצג אינו פעיל לתקופה הנוכחית
                    </div>
                )}

                {/* Overall Budget */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <OverallBudgetSummary budget={currentProfileBudget} />
                </div>

                {/* Category Details */}
                <CategoryBudgetDetails
                    categories={currentCategoryBudgets}
                    selectedPeriod={selectedPeriod}
                />
            </div>
        </div>
    );
}
