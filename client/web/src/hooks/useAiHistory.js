import { useEffect, useState, useRef, useCallback } from 'react';
import { get } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function useAIHistory() {
    const { isTokenReady, profile } = useAuth();
    const profileId = profile?._id;

    const [history, setHistory] = useState([]);
    const [newDataReady, setNewDataReady] = useState(false);
    const pollingRef = useRef(null);
    const prevProfileId = useRef(profileId);

    const STORAGE_KEY = "aiHistory";


    const loadCache = useCallback(() => {
        try {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (err) {
            console.warn('Failed to parse AI history cache', err);
            return null;
        }
    }, [STORAGE_KEY]);

    const saveCache = useCallback((data) => {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (err) {
            console.error('Failed to save AI history to cache', err);
        }
    }, [STORAGE_KEY]);

    const clearCache = useCallback(() => {
        sessionStorage.removeItem(STORAGE_KEY);
    }, [STORAGE_KEY]);


    const fetchHistory = useCallback(async () => {
        if (!profileId) return;
        try {
            const res = await get(`ai/history/${profileId}`);
            if (res.ok) {
                const hist = res.history || [];
                setHistory(hist);
                saveCache(hist);
            } else {
                setHistory([]);
                saveCache([]);
            }
        } catch (err) {
            console.error('Error fetching AI history:', err);
        }
    }, [profileId, saveCache]);


    const stopPolling = useCallback(() => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
    }, []);


    const fetchStatus = useCallback(async () => {
        if (!profileId) return;
        try {
            const res = await get(`ai/history/status/${profileId}`);
            if (res.ok) {
                const status = res.analyzeStatus;
                if (status === 'completed' || status === 'idle') {
                    stopPolling();
                    await fetchHistory();
                    setNewDataReady(status === 'completed');
                } else if (status === 'error') {
                    stopPolling();
                }
            }
        } catch (err) {
            console.error('Error fetching AI status:', err);
        }
    }, [profileId, fetchHistory, stopPolling]);

    const startPolling = useCallback(() => {
        if (!pollingRef.current) {
            pollingRef.current = setInterval(fetchStatus, 5000);
        }
    }, [fetchStatus]);


    useEffect(() => {
        const cached = loadCache();
        if (cached) {
            setHistory(cached);
        }
    }, []);


    useEffect(() => {
        if (profileId && isTokenReady) {
            fetchHistory();
            fetchStatus();
        }
    }, [profileId, isTokenReady, fetchHistory, fetchStatus]);


    useEffect(() => {
        if (prevProfileId.current && prevProfileId.current !== profileId) {
            stopPolling();
            clearCache();
            setHistory([]);
            setNewDataReady(false);
        }
        prevProfileId.current = profileId;
    }, [profileId, stopPolling, clearCache]);

    useEffect(() => {
    }, [history])


    return {
        history,
        newDataReady,
        startPolling,
    };
}
