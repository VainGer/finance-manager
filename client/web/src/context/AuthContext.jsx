import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { post } from '../utils/api';
import { getDeviceInfo, getExpiration } from '../utils/tokenUtils';

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
    const [account, setAccount] = useState(() => {
        const saved = sessionStorage.getItem('account');
        return saved ? safeJsonParse(saved) : null;
    });

    const [profile, setProfile] = useState(() => {
        const savedLocal = localStorage.getItem('profile');
        const savedSession = sessionStorage.getItem('profile');
        return savedLocal ? safeJsonParse(savedLocal) : savedSession ? safeJsonParse(savedSession) : null;
    });

    const [rememberProfile, setRememberProfile] = useState(() => !!localStorage.getItem('profile'));
    const [isExpiredToken, setIsExpiredToken] = useState(false);
    const [isTokenReady, setIsTokenReady] = useState(false);
    const [storageChecked, setStorageChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const refreshTimerRef = useRef(null);
    const REFRESH_OFFSET = 5 * 60 * 1000; // 5 minutes before expiry

    // -------------------------------
    // 🧠 Sync account to sessionStorage
    // -------------------------------
    useEffect(() => {
        if (account) {
            sessionStorage.setItem('account', JSON.stringify(account));
        } else {
            sessionStorage.removeItem('account');
        }
    }, [account]);

    // -------------------------------
    // 🧠 Sync profile to storage
    // -------------------------------
    useEffect(() => {
        if (profile) {
            if (rememberProfile) {
                localStorage.setItem('profile', JSON.stringify(profile));
                sessionStorage.removeItem('profile');
            } else {
                sessionStorage.setItem('profile', JSON.stringify(profile));
                localStorage.removeItem('profile');
            }
        }
        // ⛔ don't remove stored data when profile === null here
        // clearing happens only in clearProfile/logout
    }, [profile, rememberProfile]);

    useEffect(() => {
        setStorageChecked(true);
    }, []);

    // -------------------------------
    // 🔄 Auto Login (silent)
    // -------------------------------
    const autoLogin = useCallback(async () => {
        let logged = false;
        try {
            setIsLoading(true);
            const storedAccount = safeJsonParse(sessionStorage.getItem('account'));
            const storedProfile = safeJsonParse(localStorage.getItem('profile')) ||
                safeJsonParse(sessionStorage.getItem('profile'));

            if (storedAccount && storedProfile) {
                const res = await rememberLogin(storedAccount.username, storedProfile._id, true);
                if (res.ok && res.tokens?.accessToken) {
                    logged = true;
                    const expDate = getExpiration(res.tokens.accessToken);
                    if (expDate) scheduleTokenRefresh(expDate);
                }
            }
        } catch (err) {
            console.error('Auto login error:', err);
        } finally {
            setIsLoading(false);
            return logged;
        }
    }, []);

    useEffect(() => {
        autoLogin();
    }, [autoLogin]);

    // -------------------------------
    // ⏱ Token Refresh Scheduling
    // -------------------------------
    const clearRefreshTimer = () => {
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
            refreshTimerRef.current = null;
        }
    };

    const scheduleTokenRefresh = useCallback((expDate) => {
        try {
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
    }, []);

    const handleTokenRefresh = useCallback(async () => {
        if (account && profile && !isExpiredToken) {
            try {
                const result = await post('profile/refresh-access-token', { profileId: profile._id });

                if (!result.ok || !result.accessToken) {
                    setIsTokenReady(false);
                    setIsExpiredToken(true);
                    // ❌ don't clear storage here — behave like mobile
                } else {
                    const expDate = getExpiration(result.accessToken);
                    if (expDate) scheduleTokenRefresh(expDate);
                    setIsTokenReady(true);
                    setIsExpiredToken(false);
                }
            } catch (err) {
                console.error('Error refreshing token:', err);
                setIsTokenReady(false);
                setIsExpiredToken(true);
            }
        }
    }, [account, profile, isExpiredToken, scheduleTokenRefresh]);

    useEffect(() => {
        return () => clearRefreshTimer();
    }, []);

    // -------------------------------
    // 👤 Remember Login
    // -------------------------------
    async function rememberLogin(username, profileId, isAutoLogin = false) {
        const device = getDeviceInfo();
        const res = await post('account/validate-token', { username, profileId, device, isAutoLogin });

        if (res.ok) {
            setAccount(res.account);
            setProfile(res.profile);
            setIsExpiredToken(false);
            setIsTokenReady(true);
            return res;
        }

        return { ok: false };
    }

    // -------------------------------
    // 🚪 Logout & Clear
    // -------------------------------
    const clearAllAuthData = useCallback(async () => {
        try {
            clearRefreshTimer();
            sessionStorage.removeItem('account');
            sessionStorage.removeItem('profile');
            localStorage.removeItem('profile');
            setAccount(null);
            setProfile(null);
            setIsTokenReady(false);
            setIsExpiredToken(false);
        } catch (error) {
            console.error('Error clearing auth data:', error);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await post('profile/logout', {});
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            await clearAllAuthData();
            window.location.href = '/login';
        }
    }, [clearAllAuthData]);

    const clearProfile = useCallback(async () => {
        clearRefreshTimer();
        sessionStorage.removeItem('profile');
        localStorage.removeItem('profile');
        setProfile(null);
        setIsTokenReady(false);
        setIsExpiredToken(false);
        window.location.href = '/profiles';
    }, []);

    // -------------------------------
    // 🧠 Context value
    // -------------------------------
    return (
        <AuthContext.Provider value={{
            account,
            profile,
            setAccount,
            setProfile,
            isAuthenticated: !!account,
            hasActiveProfile: !!profile,
            isExpiredToken,
            isTokenReady,
            isLoading,
            rememberProfile,
            setRememberProfile,
            autoLogin,
            logout,
            clearProfile,
            storageChecked,
            scheduleTokenRefresh
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
