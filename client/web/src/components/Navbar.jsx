
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { account, profile, setAccount, setProfile } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Close dropdown with ESC key
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isDropdownOpen]);

    const handleLogoClick = () => {
        if (profile) {
            // If profile is selected, go to dashboard
            navigate('/dashboard');
        } else if (account) {
            // If logged in but no profile selected, go to profiles page
            navigate('/profiles');
        } else {
            // If not logged in, go to home
            navigate('/');
        }
    };

    const handleLogout = () => {
        setAccount(null);
        setProfile(null);
        sessionStorage.clear();
        navigate('/');
    };

    const handleSettings = () => {
        navigate('/settings');
        setIsDropdownOpen(false);
    };

    const getDisplayName = () => {
        if (profile?.profileName) {
            return profile.profileName;
        }
        if (account?.username) {
            return account.username;
        }
        return 'משתמש';
    };

    const getDisplayInitial = () => {
        const name = getDisplayName();
        return name.charAt(0).toUpperCase();
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <button 
                                onClick={handleLogoClick}
                                className="text-white text-xl font-bold hover:text-blue-200 transition-colors duration-200"
                            >
                                💰 מנהל כספים
                            </button>
                        </div>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4 space-x-reverse">
                        {/* Welcome Message */}
                        <div className="text-white text-sm hidden sm:block">
                            ברוך הבא, <span className="font-semibold">{getDisplayName()}</span>
                        </div>

                        {/* User Avatar & Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center space-x-2 space-x-reverse text-white hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-800 rounded-lg p-2"
                            >
                                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                    {getDisplayInitial()}
                                </div>
                                <svg
                                    className={`h-4 w-4 transition-transform duration-200 ${
                                        isDropdownOpen ? 'rotate-180' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                        <div className="font-medium">{getDisplayName()}</div>
                                        {account?.email && (
                                            <div className="text-gray-500 text-xs">{account.email}</div>
                                        )}
                                    </div>
                                    
                                    <button
                                        onClick={handleSettings}
                                        className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                    >
                                        <div className="flex items-center space-x-2 space-x-reverse">
                                            <span>⚙️</span>
                                            <span>הגדרות</span>
                                        </div>
                                    </button>
                                    
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                                    >
                                        <div className="flex items-center space-x-2 space-x-reverse">
                                            <span>🚪</span>
                                            <span>התנתק</span>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Click outside to close dropdown */}
            {isDropdownOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                />
            )}
        </nav>
    );
}