import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {


    const [account, setAccount] = useState(() => {
        const savedAccount = sessionStorage.getItem('account');
        return savedAccount ? JSON.parse(savedAccount) : null;
    });

    const [profile, setProfile] = useState(() => {
        const savedProfile = sessionStorage.getItem('profile');
        return savedProfile ? JSON.parse(savedProfile) : null;
    });

    const pagesWithAccountOnly = ['/profiles', '/profile-auth'];
    const pagesWithProfilesAndAccount = ['/dashboard', '/settings'];
    const validateAccess = (path) => {
        if (path === '/' || path === '/login' || path === '/register') {
            if (account || profile) {
                setAccount(null);
                setProfile(null);
                sessionStorage.removeItem('account');
                sessionStorage.removeItem('profile');
                return;
            }
        }
        
        if (path === '/profiles') {
            if (profile) {
                setProfile(null);
                sessionStorage.removeItem('profile');
            }
            if (!account) {
                window.location.href = '/login';
                return;
            }
        }

        if (pagesWithAccountOnly.some(page => path.startsWith(page)) && !account) {
            window.location.href = '/login';
            return;
        }
        
        if (pagesWithProfilesAndAccount.some(page => path.startsWith(page))) {
            if (!account) {
                window.location.href = '/login';
                return;
            }
            
            if (!profile) {
                window.location.href = '/profiles';
                return;
            }
        }
    };

    useEffect(() => {
        const handleLocationChange = () => {
            const currentPath = window.location.pathname;
            validateAccess(currentPath);
        };
        
        handleLocationChange();

        window.addEventListener('popstate', handleLocationChange);
        
        return () => {
            window.removeEventListener('popstate', handleLocationChange);
        };
    }, [account, profile]);

    useEffect(() => {
        if (account) {
            sessionStorage.setItem('account', JSON.stringify(account));
        } else {
            sessionStorage.removeItem('account');
        }
    }, [account]);

    useEffect(() => {
        if (profile) {
            sessionStorage.setItem('profile', JSON.stringify(profile));
        } else {
            sessionStorage.removeItem('profile');
        }
    }, [profile]);


    const logout = useCallback(() => {
        setAccount(null);
        setProfile(null);
        sessionStorage.removeItem('account');
        sessionStorage.removeItem('profile');
    }, []);
    
    const clearProfile = useCallback(() => {
        setProfile(null);
        sessionStorage.removeItem('profile');
    }, []);

    return (
        <AuthContext.Provider value={{ 
            account, 
            setAccount, 
            profile, 
            setProfile,
            logout,
            clearProfile,
            isAuthenticated: !!account,
            hasActiveProfile: !!profile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};