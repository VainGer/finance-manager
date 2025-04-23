import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = sessionStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [profile, setProfile] = useState(() => {
        const savedProfile = sessionStorage.getItem('profile');
        return savedProfile ? JSON.parse(savedProfile) : null;
    });

    useEffect(() => {
        if (user) {
            sessionStorage.setItem('user', JSON.stringify(user));
        } else {
            sessionStorage.removeItem('user');
        }
    }, [user]);

    useEffect(() => {
        if (profile) {
            sessionStorage.setItem('profile', JSON.stringify(profile));
        } else {
            sessionStorage.removeItem('profile');
        }
    }, [profile]);

    return (
        <AuthContext.Provider value={{ user, setUser, profile, setProfile }}>
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
