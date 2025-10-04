import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

export default function NavigationHeader({ 
    title = "מנהל כספים",
    subtitle = "",
    buttons = [],
    showBranding = true,
    showUserMenu = true,
    className = ""
}) {
    const navigate = useNavigate();
    const { account, profile, setAccount, setProfile, logout } = useAuth();
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
            navigate('/dashboard');
        } else if (account) {
            navigate('/profiles');
        } else {
            navigate('/');
        }
    };

    const handleLogout = async () => {
        await logout(); // This will call the server and clear cookies
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
        <>
            <nav className={`sticky top-0 z-[2000] bg-white/95 backdrop-blur-lg border-b border-slate-200/50 shadow-lg ${className}`} dir="rtl">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <div className="flex justify-between items-center h-14 sm:h-16">
                        {/* Branding */}
                        {showBranding && (
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                <button 
                                    onClick={handleLogoClick}
                                    className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity duration-200 min-w-0"
                                >
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-lg sm:text-xl font-bold text-slate-800 truncate block">{title}</span>
                                        {subtitle && (
                                            <p className="text-xs sm:text-sm text-slate-600 truncate hidden sm:block">{subtitle}</p>
                                        )}
                                    </div>
                                </button>
                            </div>
                        )}

                        {/* Right Side: Navigation Buttons + User Menu */}
                        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                            {/* Navigation Buttons */}
                            {buttons.length > 0 && (
                                <div className="hidden sm:flex gap-2 lg:gap-3">
                                    {buttons.map((button, index) => (
                                        <Button
                                            key={index}
                                            onClick={() => {
                                                if (button.onClick) button.onClick();
                                                navigate(button.path);
                                            }}
                                            style={button.style || "outline"}
                                            size="small"
                                            className={`min-w-[80px] text-sm ${button.className || ""}`}
                                        >
                                            {button.label}
                                        </Button>
                                    ))}
                                </div>
                            )}

                            {/* User Menu */}
                            {showUserMenu && (account || profile) && (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center gap-2 sm:gap-3 text-slate-700 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 rounded-lg p-1 sm:p-2 transition-colors duration-200"
                                    >
                                        {/* Welcome Message - Hidden on mobile */}
                                        <div className="text-sm hidden lg:block text-right">
                                            <div className="font-medium">{getDisplayName()}</div>
                                            {profile && (
                                                <div className="text-xs text-slate-500">פרופיל פעיל</div>
                                            )}
                                        </div>

                                        {/* User Avatar */}
                                        <div 
                                            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center text-white font-semibold border-2 border-slate-200 transition-all duration-200 overflow-hidden bg-gradient-to-r from-slate-700 to-slate-800"
                                            style={{ 
                                                backgroundColor: profile?.color || undefined
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
                                        <div className="absolute right-0 top-full mt-2 w-48 sm:w-52 bg-white rounded-xl shadow-xl py-1 z-[2100] border border-gray-200">
                                            {/* User Info Header */}
                                            <div className="px-3 sm:px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
                                                <div className="font-medium truncate">{getDisplayName()}</div>
                                                {account?.email && (
                                                    <div className="text-gray-500 text-xs truncate">{account.email}</div>
                                                )}
                                            </div>
                                            
                                            {/* Mobile Navigation Buttons - Only show on mobile */}
                                            {buttons.length > 0 && (
                                                <div className="sm:hidden border-b border-gray-200">
                                                    {buttons.map((button, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => {
                                                                if (button.onClick) button.onClick();
                                                                navigate(button.path);
                                                                setIsDropdownOpen(false);
                                                            }}
                                                            className="block w-full text-right px-3 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                                        >
                                                            {button.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                            
                                            {/* Settings Button - Only show when profile is selected */}
                                            {profile && (
                                                <button
                                                    onClick={handleSettings}
                                                    className="block w-full text-right px-3 sm:px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span>הגדרות</span>
                                                    </div>
                                                </button>
                                            )}
                                            
                                            {/* Logout Button - Always show when account exists */}
                                            <button
                                                onClick={handleLogout}
                                                className={`block w-full text-right px-3 sm:px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 ${profile ? 'border-t border-gray-200' : ''}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    <span>התנתק</span>
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Click outside to close dropdown */}
            {isDropdownOpen && (
                <div
                    className="fixed inset-0 z-[1999]"
                    onClick={() => setIsDropdownOpen(false)}
                />
            )}
        </>
    );
}
