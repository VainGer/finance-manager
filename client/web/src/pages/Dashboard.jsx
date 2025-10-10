import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfileData } from '../context/ProfileDataContext';
import ChildrenBudgetUpdate from '../components/dashboard/budget/ChildrenBudgetUpdate';
import ProfileBudgetDisplay from '../components/dashboard/budget/ProfileBudgetDisplay';
import ExpensesDisplay from '../components/dashboard/expenses/expenses_display/ExpensesDisplay';
import ExpenseSummary from '../components/dashboard/summary/ExpenseSummary';
import InteractiveCharts from '../components/dashboard/charts/InteractiveCharts';
import AIInsight from '../components/dashboard/ai/AIInsight';
import SimpleAINotification from '../components/dashboard/ai/SimpleAINotification';
import SideMenu from '../components/dashboard/menu/SideMenu';
import DisplaySelector from '../components/dashboard/DisplaySelector';
import NavigationHeader from '../components/layout/NavigationHeader';
import PageLayout from '../components/layout/PageLayout';
import FloatingActionButton from '../components/common/FloatingActionButton';

export default function Dashboard() {
    const { profile, account } = useAuth();
    const { dataLoaded, budgetLoading, expensesLoading } = useProfileData();
    const [display, setDisplay] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [currentDisplayType, setCurrentDisplayType] = useState('budget');
    const [showFloatingMenu, setShowFloatingMenu] = useState(false);

    // Set initial display when profile is ready
    useEffect(() => {
        if (profile) {
            setDisplay(<ProfileBudgetDisplay profile={profile} key="budget-initial" />);
        }
    }, [profile]);

    // Function to trigger refresh of current display
    const triggerRefresh = useCallback(() => {
        setRefreshTrigger(prev => prev + 1);

        // Re-render the current display with new key to force refresh
        switch (currentDisplayType) {
            case 'budget':
                setDisplay(<ProfileBudgetDisplay profile={profile} key={`budget-${refreshTrigger + 1}`} />);
                break;
            case 'expenses':
                setDisplay(<ExpensesDisplay profile={profile} key={`expenses-${refreshTrigger + 1}`} />);
                break;
            case 'summary':
                setDisplay(<ExpenseSummary profile={profile} key={`summary-${refreshTrigger + 1}`} />);
                break;
            case 'charts':
                setDisplay(<InteractiveCharts profile={profile} refreshTrigger={refreshTrigger} key={`charts-${refreshTrigger + 1}`} />);
                break;
            case 'ai':
                setDisplay(<AIInsight profile={profile} key={`ai-${refreshTrigger + 1}`} />);
                break;
        }
    }, [profile, refreshTrigger, currentDisplayType]);

    return (
        <>
            <PageLayout spacing={false}>
                {/* Professional Navigation */}
                <NavigationHeader 
                    title="מערכת ניהול כספים"
                    subtitle={`שלום ${profile?.profileName || account?.username}`}
                />

                {/* Main Dashboard Container with proper spacing */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
                    {/* Children Budget Update Banner */}
                    {profile && !profile.parentProfile && (
                        <ChildrenBudgetUpdate 
                            username={account?.username} 
                            profileName={profile?.profileName} 
                        />
                    )}

                    {/* Display Selector - Now perfectly centered with proper spacing */}
                    <DisplaySelector
                        setDisplay={setDisplay}
                        setCurrentDisplayType={setCurrentDisplayType}
                        profile={profile}
                        refreshTrigger={refreshTrigger}
                    />

                {/* Main Content Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-7 gap-8">
                        {/* Desktop Side Menu - Now wider */}
                        <div className="hidden xl:block xl:col-span-2">
                            <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6 sticky top-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800">פעולות מהירות</h3>
                                </div>
                                <SideMenu onTransactionAdded={triggerRefresh} isFloatingMode={false} />
                            </div>
                        </div>

                        {/* Enhanced Main Display Area */}
                        <div className="xl:col-span-5">
                            <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                                {display || (
                                    <div className="p-8 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-4"></div>
                                        <p className="text-slate-600">טוען נתונים...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pass floating menu state to SideMenu for modal handling */}
                <SideMenu 
                    onTransactionAdded={triggerRefresh} 
                    showFloatingMenu={showFloatingMenu} 
                    setShowFloatingMenu={setShowFloatingMenu}
                    isFloatingMode={true}
                />

                {/* Grey Floating Action Button - Always visible on mobile/tablet */}
                <div className="xl:hidden">
                    <FloatingActionButton 
                        onClick={() => setShowFloatingMenu(true)}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        }
                    />
                </div>
            </PageLayout>
            <SimpleAINotification />
        </>
    );
}