import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useRef,
} from 'react';
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

    const initialAccount =
        safeJsonParse(sessionStorage.getItem('account')) ||
        safeJsonParse(localStorage.getItem('account'));

    const initialProfile =
        safeJsonParse(localStorage.getItem('profile')) ||
        safeJsonParse(sessionStorage.getItem('profile'));

    const [account, setAccount] = useState(initialAccount);
    const [profile, setProfile] = useState(initialProfile);

    const [rememberProfile, setRememberProfile] = useState(
        !!localStorage.getItem('profile')
    );

    const [isExpiredToken, setIsExpiredToken] = useState(false);
    const [isTokenReady, setIsTokenReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    const refreshTimerRef = useRef(null);
    const REFRESH_OFFSET = 15 * 60 * 1000;


    useEffect(() => {
        if (account) {
            sessionStorage.setItem('account', JSON.stringify(account));
            if (rememberProfile) {
                localStorage.setItem('account', JSON.stringify(account));
            }
        } else {
            sessionStorage.removeItem('account');
            localStorage.removeItem('account');
        }
    }, [account, rememberProfile]);

    useEffect(() => {
        if (profile) {
            sessionStorage.setItem('profile', JSON.stringify(profile));
            if (rememberProfile) {
                localStorage.setItem('profile', JSON.stringify(profile));
            }
        } else {
            sessionStorage.removeItem('profile');
            localStorage.removeItem('profile');
        }
    }, [profile, rememberProfile]);


    const autoLogin = useCallback(async () => {
        let loggedIn = false;

        try {
            setIsLoading(true);

            const storedAccount = initialAccount;
            const storedProfile = initialProfile;

            if (storedAccount && storedProfile) {
                const res = await rememberLogin(
                    storedAccount.username,
                    storedProfile._id,
                    true
                );
                if (res.ok) {
                    loggedIn = true;
                    const expDate = getExpiration(res.tokens.accessToken);
                    if (expDate) scheduleTokenRefresh(expDate);
                    setIsTokenReady(true);
                    setIsExpiredToken(false);
                }
            }
        } catch (err) {
            console.error('Auto login error:', err);
        } finally {
            setIsLoading(false);
            setAuthChecked(true);
            return loggedIn;
        }
    }, []);


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
            refreshTimerRef.current = setTimeout(() => {
                handleTokenRefresh();
            }, delay);
        } catch (err) {
            console.error('Error scheduling token refresh:', err);
        }
    }, []);

    const handleTokenRefresh = useCallback(async () => {
        if (account && profile && !isExpiredToken) {
            try {
                const result = await post('profile/refresh-access-token', {
                    profileId: profile._id,
                });

                if (!result.ok || !result.accessToken) {
                    setIsTokenReady(false);
                    setIsExpiredToken(true);
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


    async function rememberLogin(username, profileId, isAutoLogin = false) {
        const device = getDeviceInfo();
        const res = await post('account/validate-token', {
            username,
            profileId,
            device,
            isAutoLogin,
        });

        if (res.ok) {
            setAccount(res.account);
            setProfile(res.profile);
            setIsExpiredToken(false);
            setIsTokenReady(true);
            return res;
        }

        return { ok: false };
    }


    const clearAllAuthData = useCallback(() => {
        try {
            clearRefreshTimer();
            sessionStorage.clear();
            localStorage.removeItem('profile');
            localStorage.removeItem('account');
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
            clearAllAuthData();
            window.location.href = '/login';
        }
    }, [clearAllAuthData]);

    const clearProfile = useCallback(() => {
        clearRefreshTimer();
        sessionStorage.removeItem('profile');
        localStorage.removeItem('profile');
        setProfile(null);
        setIsTokenReady(false);
        setIsExpiredToken(false);
        window.location.href = '/profiles';
    }, []);

    return (
        <AuthContext.Provider
            value={{
                account,
                profile,
                setAccount,
                setProfile,
                isAuthenticated: !!account,
                hasActiveProfile: !!profile,
                isExpiredToken,
                isTokenReady,
                isLoading,
                authChecked,
                rememberProfile,
                setRememberProfile,
                setIsTokenReady,
                setIsExpiredToken,
                autoLogin,
                logout,
                clearProfile,
                clearAllAuthData,
                scheduleTokenRefresh,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
