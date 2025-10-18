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
import StatusDot from '../components/common/StatusDot';

export default function Dashboard() {
    const { profile, account } = useAuth();
    const { dataLoaded, budgetLoading, expensesLoading, newDataReady } = useProfileData();
    const [display, setDisplay] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [currentDisplayType, setCurrentDisplayType] = useState('budget');
    const [showFloatingMenu, setShowFloatingMenu] = useState(false);
    const [menuSelected, setMenuSelected] = useState('');

    // Function to handle smart budget creation (like mobile app)
    const handleCreateSmartBudget = useCallback((nextMonthPlan) => {
        // Store the AI plan in localStorage for the budget creation process
        sessionStorage.setItem('smartBudgetPlan', JSON.stringify(nextMonthPlan));
        
        // Navigate to budget management via menu selection (like regular budget creation)
        setMenuSelected('budgetManagement');
        setCurrentDisplayType('budget');
    }, []);

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
                setDisplay(<AIInsight profile={profile} onCreateSmartBudget={handleCreateSmartBudget} key={`ai-${refreshTrigger + 1}`} />);
                break;
        }
    }, [profile, refreshTrigger, currentDisplayType]);

    return (
        <>
            <PageLayout spacing={false}>
                {/* Professional Navigation */}
                <NavigationHeader
                    title="Smart Finance"

                />

                {/* Main Dashboard Container with modern gradient background */}
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 relative overflow-hidden">
                    {/* Balanced background circles - visible but elegant */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                        {/* Colorful gradient circles matching tab colors */}
                        <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-blue-100/35 to-cyan-100/25 rounded-full blur-xl"></div>
                        <div className="absolute top-1/4 -left-32 w-72 h-72 bg-gradient-to-br from-purple-100/30 to-blue-100/25 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-20 -left-16 w-76 h-76 bg-gradient-to-br from-green-100/25 to-cyan-100/20 rounded-full blur-xl"></div>

                        {/* Medium accent circles with tab colors */}
                        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-gradient-to-br from-orange-100/25 to-yellow-100/20 rounded-full blur-lg"></div>
                        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-gradient-to-br from-purple-100/30 to-pink-100/25 rounded-full blur-md"></div>
                        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-gradient-to-br from-emerald-100/25 to-teal-100/20 rounded-full blur-lg"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
                        {/* Children Budget Update Banner with enhanced styling */}
                        {profile && !profile.parentProfile && (
                            <div className="animate-slideDown">
                                <ChildrenBudgetUpdate
                                    username={account?.username}
                                    profileName={profile?.profileName}
                                />
                            </div>
                        )}

                        {/* Display Selector with hover animations */}
                        <div className="animate-fadeIn">
                            <DisplaySelector
                                setDisplay={setDisplay}
                                setCurrentDisplayType={setCurrentDisplayType}
                                profile={profile}
                                refreshTrigger={refreshTrigger}
                                onCreateSmartBudget={handleCreateSmartBudget}
                            />
                        </div>

                        {/* Main Content Grid with enhanced styling */}
                        <div className="grid grid-cols-1 xl:grid-cols-7 gap-8 animate-slideUp">
                            {/* Modern Side Menu */}
                            <div className="hidden xl:block xl:col-span-2">
                                <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl shadow-slate-100/50 p-6 sticky top-6 hover:shadow-3xl transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl flex items-center justify-center shadow-lg">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent">פעולות מהירות</h3>
                                    </div>
                                    <SideMenu 
                                        onTransactionAdded={triggerRefresh} 
                                        isFloatingMode={false}
                                        menuSelected={menuSelected}
                                        setMenuSelected={setMenuSelected}
                                    />
                                </div>
                            </div>

                            {/* Enhanced Main Display Area with glass morphism */}
                            <div className="xl:col-span-5">
                                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl shadow-slate-100/50 overflow-hidden hover:shadow-3xl transition-all duration-500 hover:border-white/60">
                                    {display || (
                                        <div className="p-12 text-center">
                                            {/* Enhanced Colorful Loading Animation */}
                                            <div className="relative mb-8">
                                                <div className="flex justify-center gap-3 mb-4">
                                                    <StatusDot color="blue" size="lg" animated className="animate-bounce" />
                                                    <StatusDot color="green" size="lg" animated className="animate-bounce delay-100" />
                                                    <StatusDot color="purple" size="lg" animated className="animate-bounce delay-200" />
                                                    <StatusDot color="orange" size="lg" animated className="animate-bounce delay-300" />
                                                    <StatusDot color="cyan" size="lg" animated className="animate-bounce delay-500" />
                                                </div>
                                                <div className="w-32 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full mx-auto animate-pulse shadow-lg"></div>
                                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-100/50 via-purple-100/50 to-cyan-100/50 rounded-2xl blur-xl animate-pulse"></div>
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-slate-700 text-lg font-medium">טוען נתונים...</p>
                                                <p className="text-slate-500 text-sm">מכין את הדשבורד שלך</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
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