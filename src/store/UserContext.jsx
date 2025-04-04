import { create } from 'zustand';
import { axiosRequest } from '../services/AxiosRequest';
import api_config from '../config/apiconfig';

const useUserStore = create((set) => {
  const validateToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ loginStatus: 'unauthenticated', user: null, token: null });
      return false;
    }

    set({ loginStatus: 'loading' });

    try {
      const response = await axiosRequest('GET', api_config.auth.me, {}, {}, token);
      set({ user: response, loginStatus: 'authenticated' });
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn('Token expired or invalid. Logging out...');
        set({ user: null, token: null, loginStatus: 'unauthenticated' });
        localStorage.removeItem('token');
      } else {
        console.error('Token validation failed:', error);
        set({ loginStatus: 'unauthenticated' });
      }
      return false;
    }
  };

  validateToken();

  return {
    user: null,
    token: localStorage.getItem('token') || null,
    loginStatus: 'loading',

    login: async (credentials) => {
      try {
        const { token, user } = await axiosRequest(
          'POST',
          api_config.auth.login,
          {},
          credentials
        );
        localStorage.setItem('token', token);
        set({ user, token, loginStatus: 'authenticated' });
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

    validateToken,

    logout: () => {
      set({ user: null, token: null, loginStatus: 'unauthenticated' });
      localStorage.removeItem('token');
    },
  };
});

export default useUserStore;