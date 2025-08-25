import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname, useRouter } from 'expo-router';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [profile, setProfile] = useState(null);
    const router = useRouter();
    const pathname = usePathname();

   
    useEffect(() => {
        const loadData = async () => {
            try {
                const savedAccount = await AsyncStorage.getItem('account');
                const savedProfile = await AsyncStorage.getItem('profile');
                setAccount(savedAccount ? JSON.parse(savedAccount) : null);
                setProfile(savedProfile ? JSON.parse(savedProfile) : null);
            } catch (err) {
                console.error('Error loading auth data:', err);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        const storeAccount = async () => {
            try {
                if (account) {
                    await AsyncStorage.setItem('account', JSON.stringify(account));
                } else {
                    await AsyncStorage.removeItem('account');
                }
            } catch (err) {
                console.error('Error saving account:', err);
            }
        };
        storeAccount();
    }, [account]);


    useEffect(() => {
        const storeProfile = async () => {
            try {
                if (profile) {
                    await AsyncStorage.setItem('profile', JSON.stringify(profile));
                } else {
                    await AsyncStorage.removeItem('profile');
                }
            } catch (err) {
                console.error('Error saving profile:', err);
            }
        };
        storeProfile();
    }, [profile]);

    const logout = useCallback(async () => {
        try {
            setAccount(null);
            setProfile(null);
            await AsyncStorage.multiRemove(['account', 'profile']);
        } catch (err) {
            console.error('Error clearing auth data:', err);
        }
    }, []);

    const clearProfile = useCallback(async () => {
        try {
            setProfile(null);
            await AsyncStorage.removeItem('profile');
        } catch (err) {
            console.error('Error clearing profile:', err);
        }
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
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
