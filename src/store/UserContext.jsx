import { create } from 'zustand';
import { axiosRequest } from '../services/AxiosRequest';
import api_config from '../config/apiconfig';

const useUserStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,

  login: async (credentials) => {
    try {
      const { token, user } = await axiosRequest(
        'POST',
        api_config.auth.login,
        {},
        credentials
      );
      localStorage.setItem('token', token);
      set({ user, token });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  signup: async (details) => {
    try {
      await axiosRequest('POST', api_config.auth.signup, {}, details);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  },

  validateToken: async () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const response = await axiosRequest('GET', api_config.auth.me, {}, {}, token);
      set({ user: response });
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn('Token expired or invalid. Logging out...');
        set({ user: null, token: null });
        localStorage.removeItem('token');
      } else {
        console.error('Token validation failed:', error);
      }
      return false;
    }
  },

  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem('token');
  },
}));

export default useUserStore;