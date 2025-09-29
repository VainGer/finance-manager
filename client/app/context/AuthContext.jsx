import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getRefreshToken, refreshAccessToken, removeAccessToken, removeRefreshToken, getDeviceInfo, setAccessToken, setRefreshToken } from '../utils/tokenUtils';
import { post } from '../utils/api';
import { usePathname } from 'expo-router';
const AuthContext = createContext();

const safeJsonParse = (str, fallback = null) => {
    if (!str) return fallback;
    try {
        return JSON.parse(str);
    } catch (e) {
        console.error('JSON parse error:', e);
        return fallback;
    }
};

export const AuthProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [profile, setProfile] = useState(null);
    const [storeUser, setStoreUser] = useState(true);
    const [storeProfile, setStoreProfile] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [storageChecked, setStorageChecked] = useState(false);
    const [accessTokenReady, setAccessTokenReady] = useState(false);
    const [isExpiredToken, setIsExpiredToken] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const refreshTimeOut = 25 * 60 * 1000; // 25 minutes
    const restrictedPaths = ['/', '/login', '/authProfile', '/register'];
    const pathname = usePathname();

    const checkStorage = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            return keys;
        } catch (e) {
            console.error('Error checking storage:', e);
            return [];
        }
    };


    const loadStorage = async () => {
        const rawAccount = await AsyncStorage.getItem('account');
        const rawProfile = await AsyncStorage.getItem('profile');
        if (rawProfile) {
            const parsedProfile = safeJsonParse(rawProfile);
            if (parsedProfile) {
                setProfile(parsedProfile);
                setStoreProfile(true);
            }
        }
        if (rawAccount) {
            const parsedAccount = safeJsonParse(rawAccount);
            if (parsedAccount) {
                setAccount(parsedAccount);
                setStoreUser(true);
            }
        }
        if (rawAccount && rawProfile) {
            setStorageChecked(true);
        }
    };

    useEffect(() => {
        loadStorage();
    }, []);



    const autoLogin = useCallback(async () => {
        let logged = false;
        try {
            const parsedAccount = safeJsonParse(await AsyncStorage.getItem('account'));
            const parsedProfile = safeJsonParse(await AsyncStorage.getItem('profile'));
            setIsLoading(true);
            const refreshToken = await getRefreshToken();
            if (parsedAccount && parsedProfile && refreshToken) {
                const res = await rememberLogin(
                    parsedAccount.username,
                    parsedProfile._id,
                    true,
                    setAccount,
                    setProfile
                );
                if (res.ok) {
                    logged = true;
                    setIsExpiredToken(false);
                    setAccessTokenReady(true);
                } else {
                    return false;
                }
            }
        } catch (err) {
            console.error('Error loading auth data:', err);
        } finally {
            setIsLoading(false);
            setLoggedIn(logged);
            return logged;
        }
    }, []);


    const clearAllAuthData = async () => {
        try {
            await Promise.all([
                AsyncStorage.removeItem('account'),
                AsyncStorage.removeItem('profile'),
                removeAccessToken(),
                removeRefreshToken()
            ]);
            setAccount(null);
            setProfile(null);
            setAccessTokenReady(false);
        } catch (error) {
            console.error('Error clearing auth data:', error);
        }
    };

    useEffect(() => {
        const storeAccount = async () => {
            try {
                if (account && storeUser && profile) {
                    await AsyncStorage.setItem('account', JSON.stringify(account));
                }
            } catch (err) {
                console.error('Error saving account:', err);
            }
        };
        storeAccount();
    }, [account, profile, storeUser, storageChecked]);


    useEffect(() => {
        const saveProfile = async () => {
            try {
                if (profile && storeProfile) {
                    if (typeof profile === 'object' && profile !== null) {
                        const profileJson = JSON.stringify(profile);
                        await AsyncStorage.setItem('profile', profileJson);
                    }
                }
            } catch (err) {
                console.error('Error saving profile:', err);
            }
        };

        saveProfile();
    }, [profile, storeProfile, storageChecked]);


    useEffect(() => {
        const refresh = async () => {
            if (account && profile && !isExpiredToken && loggedIn) {
                try {
                    const result = await refreshAccessToken(profile.id);
                    if (!result.ok) {
                        setAccessTokenReady(false);
                        setIsExpiredToken(true);
                        setAccessTokenReady(false);
                        setLoggedIn(false);
                    } else {
                        setIsExpiredToken(false);
                        setAccessTokenReady(true);
                    }
                } catch (err) {
                    console.error('Error refreshing token:', err);
                    setIsExpiredToken(true);
                    setAccessTokenReady(false);
                    setLoggedIn(false);
                }
            }
        };

        let interval;
        if (account && profile) {
            interval = setInterval(() => {
                refresh();
            }, refreshTimeOut);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [account, profile, loggedIn]);


    const logout = useCallback(async () => {
        setIsExpiredToken(false);
        await clearAllAuthData();
    }, []);


    const clearProfile = useCallback(async () => {
        setAccessTokenReady(false);
        setProfile(null);
        setIsExpiredToken(false);
        try {
            await removeAccessToken();
        } catch (err) {
            console.error('Error clearing profile:', err);
        }
    }, []);

    async function rememberLogin(username, profileId, isAutoLogin, setAccount, setProfile) {
        const device = getDeviceInfo();
        const refreshToken = await getRefreshToken();
        const res = await post("account/validate-token", { username, profileId, refreshToken, device, isAutoLogin });
        if (res.ok) {
            setAccount(res.account);
            setProfile(res.profile);
            await setAccessToken(res.tokens.accessToken);
            await setRefreshToken(res.tokens.refreshToken);
            return { status: res.status, ok: true };
        }
        return { status: res.status, ok: false };
    }


        return (
            <AuthContext.Provider value={{
                account,
                profile,
                logout,
                clearProfile,
                autoLogin,
                isAuthenticated: !!account,
                hasActiveProfile: !!profile,
                storeUser,
                setStoreUser,
                storeProfile,
                setStoreProfile,
                setAccount,
                setProfile,
                isLoading,
                checkStorage,
                rememberMe,
                setRememberMe,
                isTokenReady: accessTokenReady,
                isExpiredToken,
                setLoggedIn,
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
