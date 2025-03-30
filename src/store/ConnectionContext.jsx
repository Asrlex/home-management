import api_config from '../config/apiconfig';
import { create } from 'zustand';
import { axiosRequest } from '../services/AxiosRequest';

const useConnectionStore = create((set) => ({
  isConnected: true,
  checkConnectionInterval: null,

  checkConnection: async () => {
    try {
      await axiosRequest('GET', api_config.health_check_url);
      set({ isConnected: true });
    } catch (error) {
      console.error('Connection is down:', error.message);
      set({ isConnected: false });
    }
  },

  startConnectionCheck: () => {
    const intervalId = setInterval(() => {
      useConnectionStore.getState().checkConnection();
    }, 30000);
    set({ checkConnectionInterval: intervalId });
  },

  stopConnectionCheck: () => {
    const { checkConnectionInterval } = useConnectionStore.getState();
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
}));

export default useConnectionStore;