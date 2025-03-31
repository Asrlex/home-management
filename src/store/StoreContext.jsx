import { create } from 'zustand';
import { axiosRequest } from '../services/AxiosRequest';
import api_config from '../config/apiconfig';

const useStoreStore = create((set) => ({
  stores: [],
  storeSelect: null,

  fetchStores: async () => {
    try {
      const response = await axiosRequest('GET', api_config.tiendas.all);
      console.log('Stores fetched:', response);
      set({ stores: response, storeSelect: response[0] });
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  },

  setStoreSelect: (store) => set({ storeSelect: store }),

  addStore: (store) => set((state) => ({ stores: [...state.stores, store] })),
}));

export default useStoreStore;