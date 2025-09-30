// Custom hook for managing hybrid token strategy
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { setGlobalAccessToken, clearGlobalAccessToken, refreshAccessToken } from '../utils/api';
import { getRefreshToken, removeRefreshToken } from '../utils/tokenUtils';

export const useTokenManager = () => {
    const { accessToken, setTokens, clearTokens, logout } = useAuth();

    // Sync access token with API client whenever it changes
    useEffect(() => {
        if (accessToken) {
            setGlobalAccessToken(accessToken);
        } else {
            clearGlobalAccessToken();
        }
    }, [accessToken]);

    // Function to refresh token when API returns 401
    const handleTokenRefresh = async () => {
        try {
            const newAccessToken = await refreshAccessToken();
            setTokens(newAccessToken);
            return newAccessToken;
        } catch (error) {
            console.error('Failed to refresh token:', error);
            // If refresh fails, logout user
            await removeRefreshToken();
            logout();
            throw error;
        }
    };

    // Function to check if we have a refresh token available
    const hasRefreshToken = async () => {
        const refreshToken = await getRefreshToken();
        return !!refreshToken;
    };

    // Function to initialize tokens on app start
    const initializeTokens = async () => {
        try {
            // Check if we have a refresh token in cookies
            if (await hasRefreshToken()) {
                // Try to get a new access token
                const newAccessToken = await refreshAccessToken();
                setTokens(newAccessToken);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to initialize tokens:', error);
            // Clear invalid refresh token
            await removeRefreshToken();
            return false;
        }
    };

    return {
        accessToken,
        hasRefreshToken,
        handleTokenRefresh,
        initializeTokens,
        clearTokens
    };
};
