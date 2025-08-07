import { createContext, useContext, useState, useEffect } from 'react';

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
        if (pagesWithAccountOnly.includes(path) && !account) {
            window.location.href = '/';
        }
        if (pagesWithProfilesAndAccount.includes(path) && !profile && !account) {
            window.location.href = '/profile-auth';
        }
        if (pagesWithProfilesAndAccount.includes(path) && !profile) {
            window.location.href = '/profiles';
        }
    };

    validateAccess(window.location.pathname);

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


    return (
        <AuthContext.Provider value={{ account, setAccount, profile, setProfile }}>
            { }
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