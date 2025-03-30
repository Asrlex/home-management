import { create } from 'zustand';
import { axiosRequest } from '../services/AxiosRequest';
import api_config from '../config/apiconfig';

const useSettingsStore = create((set) => ({
  settings: null,
  loading: true,

  fetchSettings: async () => {
    set({ loading: true });
    try {
      const response = await axiosRequest('GET', api_config.settings.base);
      set({ settings: response, loading: false });
    } catch (error) {
      console.error('Error fetching settings:', error);
      set({ loading: false });
    }
  },

  updateSettings: async (key, value) => {
    try {
      await axiosRequest('PUT', api_config.settings.base, {}, { [key]: value });
      set((state) => ({
        settings: { ...state.settings, [key]: value },
      }));
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  },
}));

export default useSettingsStore;