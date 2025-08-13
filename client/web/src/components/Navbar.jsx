
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

    // Get navbar color based on profile color
    const getNavbarColor = () => {
        if (profile?.color) {
            return profile.color;
        }
        return '#2563EB'; // Default blue-600
    };

    // Convert hex to RGB for gradient
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const getDarkerShade = (hex) => {
        const rgb = hexToRgb(hex);
        if (!rgb) return hex;
        
        // Make it 20% darker
        const factor = 0.8;
        const r = Math.round(rgb.r * factor);
        const g = Math.round(rgb.g * factor);
        const b = Math.round(rgb.b * factor);
        
        return `rgb(${r}, ${g}, ${b})`;
    };

    const navbarColor = getNavbarColor();
    const darkerNavbarColor = getDarkerShade(navbarColor);

    return (
        <nav 
            className="shadow-lg transition-all duration-500 ease-in-out" 
            dir="rtl"
            style={{
                background: `linear-gradient(to right, ${navbarColor}, ${darkerNavbarColor})`
            }}
        >
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
                                className="flex items-center space-x-2 space-x-reverse text-white hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 rounded-lg p-2"
                                style={{
                                    focusRingOffsetColor: navbarColor
                                }}
                            >
                                <div 
                                    className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold border-2 border-white/20 transition-all duration-500 ease-in-out overflow-hidden"
                                    style={{ 
                                        backgroundColor: profile?.color ? getDarkerShade(profile.color) : 'rgba(255, 255, 255, 0.2)'
                                    }}
                                >
                                    {profile?.avatar ? (
                                        <img 
                                            src={profile.avatar} 
                                            alt={getDisplayName()}
                                            className="h-full w-full object-cover rounded-full"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'block';
                                            }}
                                        />
                                    ) : null}
                                    <span 
                                        className={profile?.avatar ? 'hidden' : 'block'}
                                        style={{ display: profile?.avatar ? 'none' : 'block' }}
                                    >
                                        {getDisplayInitial()}
                                    </span>
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