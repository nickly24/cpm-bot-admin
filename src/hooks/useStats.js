import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';
import { UPDATE_INTERVALS } from '../constants';

export const useStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const response = await apiClient.getStats();
      setStats(response.data);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    
    // Автообновление каждые 30 секунд
    const interval = setInterval(fetchStats, UPDATE_INTERVALS.DASHBOARD);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

