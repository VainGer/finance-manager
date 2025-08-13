import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import ProfileBudgetDisplay from '../components/dashboard/budget/ProfileBudgetDisplay';
import ExpensesDisplay from '../components/dashboard/expenses/expenses_display/ExpensesDisplay';
import ExpenseSummary from '../components/dashboard/summary/ExpenseSummary';
import InteractiveCharts from '../components/dashboard/charts/InteractiveCharts';
import SideMenu from '../components/dashboard/menu/SideMenu';
import DisplaySelector from '../components/dashboard/DisplaySelector';
import Navbar from '../components/Navbar';
import Footer from '../components/common/Footer';

export default function Dashboard() {
    const { profile, account } = useAuth();
    const [display, setDisplay] = useState(<ProfileBudgetDisplay profile={profile} key="budget-initial" />);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [currentDisplayType, setCurrentDisplayType] = useState('budget');

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
        }
    }, [profile, refreshTrigger, currentDisplayType]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            
            <div className="container mx-auto px-4 py-6">
                {/* Welcome Section */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        שלום, {profile?.profileName || 'משתמש'}!
                    </h1>
                    <p className="text-gray-600">
                        ברוך הבא לדשבורד ניהול הכספים שלך
                    </p>
                </div>

                {/* Display Selector */}
                <DisplaySelector 
                    setDisplay={setDisplay} 
                    setCurrentDisplayType={setCurrentDisplayType}
                    profile={profile}
                    refreshTrigger={refreshTrigger}
                />

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Side Menu */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">פעולות מהירות</h3>
                            <SideMenu onTransactionAdded={triggerRefresh} />
                        </div>
                    </div>

                    {/* Main Display Area */}
                    <div className="lg:col-span-3">
                        {display}
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <Footer />
        </div>
    );
}