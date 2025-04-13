import { create } from 'zustand';
import { axiosRequest } from '../common/services/AxiosRequest';
import { LoggedUserI, UserI } from '@/entities/types/home-management.entity';
import { HttpEnum } from '@/entities/enums/http.enum';
import { StoreEnum } from './entities/enums/store.enum';
import { CreateUserDto } from '@/entities/dtos/user.dto';
import { LoginException, SignupException, TokenExpiredOrInvalidException, TokenValidationException } from '@/common/exceptions/entities/enums/user-exception';
import { UserExceptionMessages } from '@/common/exceptions/user.exception';
import { ApiEndpoints, AuthEndpoints } from '@/config/apiconfig';

interface UserStore {
  user: UserI | null;
  token: string | null;
  loginStatus: StoreEnum.STATUS_LOADING | StoreEnum.STATUS_AUTHENTICATED | StoreEnum.STATUS_UNAUTHENTICATED;
  login: (credentials: CreateUserDto) => Promise<void>;
  signup: (details: CreateUserDto) => Promise<void>;
  validateToken: () => Promise<boolean>;
  logout: () => void;
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
      const response: UserI = await axiosRequest(
        HttpEnum.GET,
        ApiEndpoints.base + AuthEndpoints.me,
        {},
        {},
        token
      );
      set({ user: response, loginStatus: StoreEnum.STATUS_AUTHENTICATED });
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
        .then((loggedUser: LoggedUserI) => {
          localStorage.setItem(StoreEnum.TOKEN, loggedUser.token);
          set({
            user: loggedUser.user,
            token: loggedUser.token,
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
        .then((loggedUser: LoggedUserI) => {
          localStorage.setItem(StoreEnum.TOKEN, loggedUser.token);
          set({
            user: loggedUser.user,
            token: loggedUser.token,
            loginStatus: StoreEnum.STATUS_AUTHENTICATED
          });
        })
        .catch((error) => {
          set({loginStatus: StoreEnum.STATUS_UNAUTHENTICATED});
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
  };
});

export default useUserStore;