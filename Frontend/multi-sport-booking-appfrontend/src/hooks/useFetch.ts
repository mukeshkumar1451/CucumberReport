import { useState, useEffect, useRef } from 'react';

// Simple in-memory cache
const cache: Record<string, { data: any, ts: number }> = {};

export function useFetch<T = any>(
  key: string,
  fetcher: () => Promise<T>,
  staleTime: number = 60000 // default 1 minute
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const now = Date.now();
    const cached = cache[key];
    if (cached && now - cached.ts < staleTime) {
      setData(cached.data);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetcher()
      .then(res => {
        cache[key] = { data: res, ts: Date.now() };
        if (mounted.current) setData(res);
      })
      .catch(err => {
        if (mounted.current) setError(err);
      })
      .finally(() => {
        if (mounted.current) setLoading(false);
      });
    return () => { mounted.current = false; };
  }, [key]);

  const mutate = (newData: T) => {
    cache[key] = { data: newData, ts: Date.now() };
    setData(newData);
  };

  return { data, loading, error, mutate };
}

// Helper to clear cache (for logout, etc)
export function clearCache() {
  Object.keys(cache).forEach(k => delete cache[k]);
}
