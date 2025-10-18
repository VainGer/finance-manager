import { useEffect, useState, useRef, useCallback } from 'react';
import { get } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function useAIHistory() {
    const { isTokenReady, profile } = useAuth();
    const profileId = profile?._id;
    const [history, setHistory] = useState([]);
    const [newDataReady, setNewDataReady] = useState(false);
    const pollingRef = useRef(null);

    const fetchHistory = useCallback(async () => {
        if (!profileId) return;
        try {
            const res = await get(`ai/history/${profileId}`);
            if (res.ok) {
                const sortedData = res.history.history.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
                setHistory(sortedData || []);
            } else {
                setHistory([]);
            }
        } catch (err) {
            console.error('Error fetching AI history:', err);
        }
    }, [profileId]);

    const fetchStatus = useCallback(async () => {
        if (!profileId) return;
        try {
            const res = await get(`ai/history/status/${profileId}`);
            if (res.ok) {
                const newStatus = res.analyzeStatus;
                if (newStatus === 'completed') {
                    stopPolling();
                    await fetchHistory();
                    setNewDataReady(true);
                } else if (newStatus === 'idle') {
                    stopPolling();
                    await fetchHistory();
                } else if (newStatus === 'error') {
                    stopPolling();
                }
            }
        } catch (err) {
            console.error('Error fetching AI status:', err);
        }
    }, [profileId, fetchHistory]);

    const startPolling = useCallback(() => {
        if (pollingRef.current) return;
        pollingRef.current = setInterval(fetchStatus, 5000);
    }, [fetchStatus]);

    const stopPolling = useCallback(() => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (profileId && isTokenReady) {
            fetchHistory();
            fetchStatus();
        }
    }, [profileId, isTokenReady, fetchHistory, fetchStatus]);

    useEffect(() => {
        setHistory([]);
        setNewDataReady(false);
        stopPolling();
    }, [profileId, stopPolling]);

    return {
        history,
        newDataReady,
        startPolling,
    };
}
