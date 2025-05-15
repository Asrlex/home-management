import { create } from 'zustand';
import { axiosRequest } from '../hooks/axiosRequest';
import { HttpEnum } from '@/entities/enums/http.enum';
import { SettingsExceptionMessages } from '@/common/exceptions/entities/enums/settings-exception.enum';
import { CreateSettingsDto } from '@/entities/dtos/settings.dto';
import {
  UserIDRequiredException,
  FetchSettingsException,
  UpdateSettingsException,
} from '@/common/exceptions/settings.exception';
import useUserStore from './UserStore';
import { ApiEndpoints, SettingsEndpoints } from '@/config/apiconfig';
import {
  SettingsI,
  UserI,
  UserSettingsI,
} from '@/entities/types/home-management.entity';
import useThemeStore from './ThemeStore';
import { StoreEnum } from './entities/enums/store.enum';

interface SettingsStore {
  settings: UserSettingsI | null;
  loading: boolean;
  fetchSettings: () => Promise<UserSettingsI | null>;
  updateSettings: (settings: UserSettingsI) => Promise<void>;
}

const defaultSettings: UserSettingsI = {
  defaultPage: '',
  theme: StoreEnum.LIGHT,
  notifications: {
    email: false,
    push: false,
  },
  language: StoreEnum.LANGUAGE_ES,
  icon: StoreEnum.SUMMER,
};

const useSettingsStore = create(
  (set): SettingsStore => ({
    settings: defaultSettings,
    loading: true,

    fetchSettings: async (): Promise<UserSettingsI | null> => {
      set({ loading: true });
      try {
        const user: UserI = useUserStore.getState().user;
        const userID: number = user?.userID;
        if (!userID) {
          set({ loading: false });
          return null;
        }

        const { data: response } = (await axiosRequest<SettingsI>(
          HttpEnum.GET,
          `${ApiEndpoints.hm_url + SettingsEndpoints.byID}${userID}`
        )) as {
          data: SettingsI;
        };
        const parsedSettings: UserSettingsI = JSON.parse(response.settings);
        set({ settings: parsedSettings, loading: false });

        // Set theme
        const currentTheme = useThemeStore.getState().theme;
        const storedTheme = localStorage.getItem(StoreEnum.THEME) as
          | StoreEnum.LIGHT
          | StoreEnum.DARK;
        if (parsedSettings.theme) {
          if (parsedSettings.theme !== currentTheme) {
            useThemeStore.getState().setTheme(parsedSettings.theme);
          }
        } else if (storedTheme) {
          useThemeStore.getState().setTheme(storedTheme);
        } else {
          useThemeStore.getState().setTheme(StoreEnum.LIGHT);
        }

        return parsedSettings;
      } catch (error) {
        set({ loading: false });
        throw new FetchSettingsException(
          SettingsExceptionMessages.FetchSettingsException + error
        );
      }
    },

    updateSettings: async (settings) => {
      const user = useUserStore.getState().user;
      const userID = user?.userID;

      if (!userID) {
        throw new UserIDRequiredException(
          SettingsExceptionMessages.UserIDRequiredException
        );
      }

      const stringifiedSettings = JSON.stringify(settings);
      const settingsDTO: CreateSettingsDto = {
        settings: stringifiedSettings,
        settingsUserID: userID,
      };
      await axiosRequest<CreateSettingsDto>(
        HttpEnum.PUT,
        `${ApiEndpoints.hm_url + SettingsEndpoints.base}/${userID}`,
        {},
        settingsDTO
      )
        .then((response) => {
          const responseData = response.data as SettingsI;
          const parsedSettings: UserSettingsI = JSON.parse(
            responseData.settings
          );
          set({ settings: parsedSettings });

          if (parsedSettings.theme !== useThemeStore.getState().theme) {
            useThemeStore.getState().setTheme(parsedSettings.theme);
          }

          return parsedSettings;
        })
        .catch((error) => {
          throw new UpdateSettingsException(
            SettingsExceptionMessages.UpdateSettingsException + error
          );
        });
    },
  })
);

export default useSettingsStore;
