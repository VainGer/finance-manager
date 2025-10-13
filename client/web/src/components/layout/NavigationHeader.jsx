import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/images/logo.png'
import Button from '../common/Button';

export default function NavigationHeader({
    title = "Smart Finance",
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
            <div className="sticky top-0 z-[2000]">
                <nav className={`bg-gradient-to-r from-white/95 via-slate-50/95 to-blue-50/95 backdrop-blur-xl shadow-lg shadow-slate-100/50 ${className}`} dir="rtl">
                    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <div className="flex justify-between items-center h-16 sm:h-18">
                        {/* Enhanced Branding */}
                        {showBranding && (
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                <button
                                    onClick={handleLogoClick}
                                    className="flex items-center gap-2 sm:gap-3 hover:scale-105 transition-all duration-300 min-w-0 group"
                                >
                                    <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl group-hover:bg-white transition-all duration-300">
                                        <img src={logo} alt="logo" className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain" />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent truncate block">{title}</span>
                                        {subtitle && (
                                            <p className="text-xs sm:text-sm text-slate-600 truncate hidden sm:block font-medium">{subtitle}</p>
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
                                        <button
                                            key={index}
                                            onClick={() => {
                                                if (button.onClick) button.onClick();
                                                navigate(button.path);
                                            }}
                                            className={`px-4 py-2 min-w-[80px] text-sm font-medium text-slate-700 bg-white/80 hover:bg-white hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-md ${button.className || ""}`}
                                        >
                                            {button.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* User Menu */}
                            {showUserMenu && (account || profile) && (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center gap-2 sm:gap-3 text-slate-700 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-1 sm:p-2 transition-all duration-200 hover:bg-slate-50"
                                    >
                                        {/* Welcome Message */}
                                        <div className="text-sm hidden lg:block text-right">
                                            <div className="font-bold text-slate-800">{getDisplayName()}</div>
                                            {profile && (
                                                <div className="text-xs text-blue-600 font-medium">פרופיל פעיל</div>
                                            )}
                                        </div>

                                        {/* User Avatar */}
                                        <div
                                            className="h-9 w-9 sm:h-11 sm:w-11 rounded-full flex items-center justify-center text-white font-semibold border-2 border-slate-200 shadow-lg transition-all duration-300 overflow-hidden hover:shadow-xl hover:scale-105 hover:border-slate-300"
                                            style={{
                                                background: profile?.color ? 
                                                    `linear-gradient(135deg, ${profile.color}, ${profile.color}dd)` : 
                                                    'linear-gradient(135deg, #3b82f6, #1d4ed8)'
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
                                            className={`h-4 w-4 text-slate-600 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
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

                                            {/* Enhanced Mobile Navigation Buttons */}
                                            {buttons.length > 0 && (
                                                <div className="sm:hidden border-b border-gray-200 bg-gradient-to-r from-slate-50/50 to-blue-50/50">
                                                    {buttons.map((button, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => {
                                                                if (button.onClick) button.onClick();
                                                                navigate(button.path);
                                                                setIsDropdownOpen(false);
                                                            }}
                                                            className="flex items-center justify-between w-full text-right px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white/80 hover:text-slate-900 transition-all duration-200 group border-b border-slate-100 last:border-b-0"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                                                <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </div>
                                                            <span className="flex-1 text-right">{button.label}</span>
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
                {/* Elegant Bottom Border */}
                <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-200/60 to-transparent"></div>
            </div>

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
