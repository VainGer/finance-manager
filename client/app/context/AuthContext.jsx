import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useState, useRef } from 'react';
import {
    getRefreshToken,
    removeAccessToken,
    removeRefreshToken,
    getDeviceInfo,
    setAccessToken,
    setRefreshToken,
    getAccessToken,
    getExpiration
} from '../utils/tokenUtils';
import { post } from '../utils/api';
import { useRouter } from 'expo-router';
import { usePathname } from 'expo-router';

const AuthContext = createContext();

const safeJsonParse = (str, fallback = null) => {
    if (!str) return fallback;
    try {
        return JSON.parse(str);
    } catch {
        return fallback;
    }
};

export const AuthProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [profile, setProfile] = useState(null);
    const [storeUser, setStoreUser] = useState(true);
    const [storeProfile, setStoreProfile] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [storageChecked, setStorageChecked] = useState(false);
    const [accessTokenReady, setAccessTokenReady] = useState(false);
    const [isExpiredToken, setIsExpiredToken] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const router = useRouter();
    const refreshTimerRef = useRef(null);
    const REFRESH_OFFSET = 5 * 60 * 1000; // 5 minutes before expiration
    const pathname = usePathname();
    const restrictedPaths = ['/', '/login', '/authProfile', '/register'];

    const loadStorage = async () => {
        try {
            const rawAccount = await AsyncStorage.getItem('account');
            const rawProfile = await AsyncStorage.getItem('profile');

            if (rawAccount) {
                const parsedAccount = safeJsonParse(rawAccount);
                if (parsedAccount) {
                    setAccount(parsedAccount);
                    setStoreUser(true);
                }
            }

            if (rawProfile) {
                const parsedProfile = safeJsonParse(rawProfile);
                if (parsedProfile) {
                    setProfile(parsedProfile);
                }
            }

            setStorageChecked(true);
        } catch (err) {
            console.error("Error loading storage:", err);
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
                if (res.ok) logged = true;
                else return false;
            }
        } catch (err) {
            console.error('Error loading auth data:', err);
        } finally {
            setIsLoading(false);
            setLoggedIn(logged);
            return logged;
        }
    }, []);

    useEffect(() => {
        const storeAccountData = async () => {
            try {
                if (account && storeUser) {
                    await AsyncStorage.setItem('account', JSON.stringify(account));
                }
            } catch (err) {
                console.error('Error saving account:', err);
            }
        };
        storeAccountData();
    }, [account, storeUser]);

    useEffect(() => {
        const storeProfileData = async () => {
            try {
                if (profile && storeProfile) {
                    await AsyncStorage.setItem('profile', JSON.stringify(profile));
                }
            } catch (err) {
                console.error('Error saving profile:', err);
            }
        };
        storeProfileData();
    }, [profile, storeProfile]);


    const clearRefreshTimer = () => {
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
            refreshTimerRef.current = null;
        }
    };

    const scheduleTokenRefresh = async () => {
        try {
            const token = await getAccessToken();
            if (!token) return;

            const expDate = getExpiration(token);
            if (!expDate) return;

            const now = Date.now();
            const refreshAt = expDate.getTime() - REFRESH_OFFSET;
            const delay = Math.max(refreshAt - now, 0);

            clearRefreshTimer();

            refreshTimerRef.current = setTimeout(async () => {
                await handleTokenRefresh();
            }, delay);
        } catch (err) {
            console.error('Error scheduling token refresh:', err);
        }
    };

    const handleTokenRefresh = async () => {
        if (account && profile && !isExpiredToken && loggedIn) {
            try {

                const result = await post('profile/refresh-access-token', { profileId: profile._id });
                if (!result.ok) {
                    setAccessTokenReady(false);
                    setIsExpiredToken(true);
                    setLoggedIn(false);
                } else {
                    setIsExpiredToken(false);
                    setAccessTokenReady(true);
                    await setAccessToken(result.accessToken);
                    scheduleTokenRefresh();
                }
            } catch (err) {
                console.error('Error refreshing token:', err);
                setIsExpiredToken(true);
                setAccessTokenReady(false);
                setLoggedIn(false);
            }
        }
    };

    useEffect(() => {
        if (account && profile && loggedIn && accessTokenReady && !isExpiredToken) {
            scheduleTokenRefresh();
        } else {
            clearRefreshTimer();
        }
        return () => clearRefreshTimer();
    }, [account, profile, loggedIn, accessTokenReady, isExpiredToken]);


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
            setLoggedIn(false);
        } catch (error) {
            console.error('Error clearing auth data:', error);
        }
    };

    const logout = useCallback(async () => {
        setIsExpiredToken(false);
        await clearAllAuthData();
        requestIdleCallback(() => {
            router.replace('/login');
        });
    }, []);

    const clearProfile = useCallback(async () => {
        try {
            await removeAccessToken();
            setAccessTokenReady(false);
            setProfile(null);
            setIsExpiredToken(false);
            setLoggedIn(false);
            requestIdleCallback(() => {
                router.replace('/authProfile');
            });
        } catch (err) {
            console.error('Error clearing profile:', err);
        }
    }, []);

    useEffect(() => {
        if (pathname.includes(restrictedPaths)) {
            clearProfile();
        }
    }, [pathname])

    async function rememberLogin(username, profileId, isAutoLogin, setAccount, setProfile) {
        const device = getDeviceInfo();
        const refreshToken = await getRefreshToken();
        const res = await post("account/validate-token", {
            username, profileId, refreshToken, device, isAutoLogin
        });

        if (res.ok) {
            setAccount(res.account);
            setProfile(res.profile);
            await setAccessToken(res.tokens.accessToken);
            await setRefreshToken(res.tokens.refreshToken);
            setIsExpiredToken(false);
            setAccessTokenReady(true);
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
            storeUser, setStoreUser,
            storeProfile, setStoreProfile,
            setAccount, setProfile,
            isLoading,
            rememberMe: storeProfile,
            setRememberMe: setStoreProfile,
            isTokenReady: accessTokenReady,
            isExpiredToken,
            setLoggedIn,
            setIsExpiredToken,
            setAccessTokenReady,
            storageChecked
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
