import { create } from 'zustand';
import { axiosRequest } from '../hooks/axiosRequest';
import { UserI } from '@/entities/types/home-management.entity';
import { HttpEnum } from '@/entities/enums/http.enum';
import { StoreEnum } from './entities/enums/store.enum';
import { CreateUserDto } from '@/entities/dtos/user.dto';
import { ApiEndpoints, AuthEndpoints } from '@/config/apiconfig';
import { UserExceptionMessages } from '@/common/exceptions/entities/enums/user-exception.enum';
import { TokenExpiredOrInvalidException, TokenValidationException, LoginException, SignupException } from '@/common/exceptions/user-exception';
import { RegistrationResponseJSON, startAuthentication, startRegistration } from '@simplewebauthn/browser';
import { UpdateSettingsException } from '@/common/exceptions/settings.exception';
import { SettingsExceptionMessages } from '@/common/exceptions/entities/enums/settings-exception.enum';

interface UserStore {
  user: UserI | null;
  token: string | null;
  loginStatus: StoreEnum.STATUS_LOADING | StoreEnum.STATUS_AUTHENTICATED | StoreEnum.STATUS_UNAUTHENTICATED;
  login: (credentials: CreateUserDto) => Promise<void>;
  signup: (details: CreateUserDto) => Promise<void>;
  validateToken: () => Promise<boolean>;
  logout: () => void;
  pairBiometrics: () => Promise<void>;
  loginWithBiometrics: () => Promise<void>;
}

const useUserStore = create((set): UserStore => {
  const validateToken = async (): Promise<boolean> => {
    const token: string = localStorage.getItem(StoreEnum.TOKEN);
    if (!token) {
      set({
        loginStatus: StoreEnum.STATUS_UNAUTHENTICATED,
        user: null,
        token: null
      });
      return false;
    }

    set({ loginStatus: StoreEnum.STATUS_LOADING });

    try {
      const response = await axiosRequest(
        HttpEnum.GET,
        ApiEndpoints.base + AuthEndpoints.me,
        {},
        {},
        token
      );
      set({ user: response.data, loginStatus: StoreEnum.STATUS_AUTHENTICATED });
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        set({
          user: null,
          token: null,
          loginStatus: StoreEnum.STATUS_UNAUTHENTICATED
        });
        localStorage.removeItem(StoreEnum.TOKEN);
        throw new TokenExpiredOrInvalidException(UserExceptionMessages.TokenExpiredOrInvalid + error);
      } else {
        set({
          loginStatus: StoreEnum.STATUS_UNAUTHENTICATED,
          user: null,
          token: null
        });
        throw new TokenValidationException(UserExceptionMessages.TokenValidationException + error);
      }
    }
  };

  validateToken();

  return {
    user: null,
    token: localStorage.getItem(StoreEnum.TOKEN) || null,
    loginStatus: StoreEnum.STATUS_LOADING,

    login: async (credentials: CreateUserDto) =>
      await axiosRequest(
        HttpEnum.POST,
        ApiEndpoints.base + AuthEndpoints.login,
        {},
        credentials
      )
        .then((response) => {
          localStorage.setItem(StoreEnum.TOKEN, response.data.token);
          set({
            user: response.data.user,
            token: response.data.token,
            loginStatus: StoreEnum.STATUS_AUTHENTICATED
          });
        })
        .catch((error) => {
          set({ loginStatus: StoreEnum.STATUS_UNAUTHENTICATED });
          throw new LoginException(UserExceptionMessages.LoginException + error);
        }),

    signup: async (details: CreateUserDto) =>
      await axiosRequest(
        HttpEnum.POST,
        ApiEndpoints.base + AuthEndpoints.signup,
        {},
        details
      )
        .then((response) => {
          localStorage.setItem(StoreEnum.TOKEN, response.data.token);
          set({
            user: response.data.user,
            token: response.data.token,
            loginStatus: StoreEnum.STATUS_AUTHENTICATED
          });
        })
        .catch((error) => {
          set({ loginStatus: StoreEnum.STATUS_UNAUTHENTICATED });
          throw new SignupException(UserExceptionMessages.SignupException + error);
        }),

    validateToken,

    logout: () => {
      set({
        user: null,
        token: null,
        loginStatus: StoreEnum.STATUS_UNAUTHENTICATED
      });
      localStorage.removeItem(StoreEnum.TOKEN);
    },

    pairBiometrics: async () => {
      const token: string = localStorage.getItem(StoreEnum.TOKEN);
      if (!token) {
        set({
          loginStatus: StoreEnum.STATUS_UNAUTHENTICATED,
          user: null,
          token: null
        });
        return;
      }

      try {
        const optionsResponse = await axiosRequest(
          HttpEnum.POST,
          ApiEndpoints.base + AuthEndpoints.pairBiometricsOptions,
          {},
          {},
          token
        );

        const attestation: RegistrationResponseJSON = await startRegistration(optionsResponse.data);

        await axiosRequest(
          HttpEnum.POST,
          ApiEndpoints.base + AuthEndpoints.pairBiometricsRegister,
          {},
          attestation,
          token
        );
      } catch (error) {
        throw new UpdateSettingsException(SettingsExceptionMessages.UpdateSettingsException + error);
      }
    },

    loginWithBiometrics: async () => {
      try {
        const optionsResponse = await axiosRequest(
          HttpEnum.GET,
          ApiEndpoints.base + AuthEndpoints.biometricsAuthOptions,
        );
        
        const options = await optionsResponse.data;
        const assertion = await startAuthentication(options);

        await axiosRequest(
          HttpEnum.POST,
          ApiEndpoints.base + AuthEndpoints.biometricsAuth,
          {},
          assertion,
        )
          .then((response) => {
            localStorage.setItem(StoreEnum.TOKEN, response.data.token);
            set({
              user: response.data.user,
              token: response.data.token,
              loginStatus: StoreEnum.STATUS_AUTHENTICATED
            });
          })
          .catch((error) => {
            set({ loginStatus: StoreEnum.STATUS_UNAUTHENTICATED });
            throw new LoginException(UserExceptionMessages.LoginException + error);
          });
      } catch (error) {
        console.error('Error during biometrics login:', error);
      }
    },
  };
});

export default useUserStore;