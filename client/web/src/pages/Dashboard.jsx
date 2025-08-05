import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProfileBudgetDisplay from '../components/dashboard/budget/ProfileBudgetDisplay';
import SideMenu from '../components/dashboard/menu/SideMenu';
import DisplaySelector from '../components/dashboard/DisplaySelector';
import Navbar from '../components/Navbar';

export default function Dashboard() {
    const { profile, account } = useAuth();
    const [display, setDisplay] = useState(<ProfileBudgetDisplay profile={profile} />);

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
                <DisplaySelector setDisplay={setDisplay} />

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Side Menu */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">פעולות מהירות</h3>
                            <SideMenu />
                        </div>
                    </div>

                    {/* Main Display Area */}
                    <div className="lg:col-span-3">
                        {display}
                    </div>
                </div>
            </div>
        </div>
    );
}