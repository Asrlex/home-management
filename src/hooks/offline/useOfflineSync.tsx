import { useEffect } from 'react';
import { axiosRequest } from '@/hooks/useAxiosRequest';
import { clearRequests, getRequests } from './offlineQueue';

export function useOfflineSync() {
  useEffect(() => {
    const syncData = async () => {
      const requests = await getRequests();
      for (const request of requests) {
        try {
          await axiosRequest(
            request.method,
            request.url,
            request.headers,
            request.body
          );
        } catch (error) {
          console.error('Failed to sync request:', error);
        }
      }
      await clearRequests();
    };

    if (navigator.onLine) {
      syncData();
    }

    window.addEventListener('online', syncData);
    return () => {
      window.removeEventListener('online', syncData);
    };
  }, []);
}
