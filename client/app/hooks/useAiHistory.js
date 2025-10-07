import { useEffect, useState, useRef, useCallback } from 'react';
import { get } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function useAIHistory() {
    const { isTokenReady, profile } = useAuth();
    const profileId = profile?._id;
    const [history, setHistory] = useState([]);
    const [status, setStatus] = useState(null); // 'idle' | 'processing' | 'completed' | 'error'
    const [loading, setLoading] = useState(false);
    const pollingRef = useRef(null);

    const fetchHistory = useCallback(async () => {
        if (!profileId) return;
        try {
            setLoading(true);
            const res = await get(`ai/history/${profileId}`);
            if (res.ok) {
                setHistory(res.history || []);
                console.log('Fetched AI history:', res.history);
            } else {
                setHistory([]);
            }
        } catch (err) {
            console.error('Error fetching AI history:', err);
        } finally {
            setLoading(false);
        }
    }, [profileId]);

    const fetchStatus = useCallback(async () => {
        if (!profileId) return;
        try {
            const res = await get(`ai/history/status/${profileId}`);
            if (res.ok) {
                console.log('Fetched AI status:', res.analyzeStatus);
                setStatus(res.analyzeStatus);
                if (res.analyzeStatus === 'completed') {
                    await fetchHistory();
                    stopPolling();
                }
            }
        } catch (err) {
            console.error('Error fetching AI status:', err);
        }
    }, [profileId, fetchHistory]);

    const startPolling = useCallback(() => {
        console.log('Starting polling for AI status...');
        if (pollingRef.current) return;
        pollingRef.current = setInterval(fetchStatus, 5000);
    }, [fetchStatus]);

    const stopPolling = useCallback(() => {
        console.log('Stopping polling for AI status...');
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (profileId && isTokenReady) {
            fetchStatus();
        }
        return stopPolling;
    }, [profileId, isTokenReady, fetchStatus, stopPolling]);

    return {
        history,
        status,
        loading,
        fetchHistory,
        startPolling,
        stopPolling
    };
}
