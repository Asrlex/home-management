import { create } from 'zustand';
import { axiosRequest } from '../hooks/useAxiosRequest';
import { HttpEnum } from '@/entities/enums/http.enum';
import { ConnectionException } from '@/common/exceptions/connection.exception';
import { ConnectionExceptionMessages } from '@/common/exceptions/entities/enums/connection-exception.enum';
import { ApiEndpoints } from '@/config/apiconfig';

interface ConnectionStore {
  isConnected: boolean;
  checkConnectionInterval: NodeJS.Timeout | null;
  checkConnection: () => Promise<void>;
  startConnectionCheck: () => void;
  stopConnectionCheck: () => void;
  initializeConnectionCheck: () => void;
  cleanupConnectionCheck: () => void;
}

const useConnectionStore = create(
  (set): ConnectionStore => ({
    isConnected: true,
    checkConnectionInterval: null,

    checkConnection: async () =>
      await axiosRequest(HttpEnum.GET, ApiEndpoints.health_check_url)
        .then(() => set({ isConnected: true }))
        .catch((error) => {
          set({ isConnected: false });
          throw new ConnectionException(
            ConnectionExceptionMessages.CreateConnectionException + error
          );
        }),

    startConnectionCheck: () => {
      const intervalId = setInterval(() => {
        useConnectionStore.getState().checkConnection();
      }, 30000);
      set({ checkConnectionInterval: intervalId });
    },

    stopConnectionCheck: () => {
      const checkConnectionInterval =
        useConnectionStore.getState().checkConnectionInterval;
      if (checkConnectionInterval) {
        clearInterval(checkConnectionInterval);
        set({ checkConnectionInterval: null });
      }
    },

    initializeConnectionCheck: () => {
      useConnectionStore.getState().checkConnection();
      useConnectionStore.getState().startConnectionCheck();
    },

    cleanupConnectionCheck: () => {
      useConnectionStore.getState().stopConnectionCheck();
    },
  })
);

export default useConnectionStore;
