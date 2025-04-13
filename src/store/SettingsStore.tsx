import { create } from "zustand";
import { axiosRequest } from "../common/services/AxiosRequest";
import { HttpEnum } from "@/entities/enums/http.enum";
import { SettingsExceptionMessages } from "@/common/exceptions/entities/enums/settings-exception.enum";
import { CreateSettingsDto } from "@/entities/dtos/settings.dto";
import { SettingsI, UserI } from "@/entities/types/home-management.entity";
import { UserIDRequiredException, FetchSettingsException, UpdateSettingsException } from "@/common/exceptions/settings.exception";
import useUserStore from "./UserStore";
import { ApiEndpoints, SettingsEndpoints } from "@/config/apiconfig";

interface SettingsStore {
  settings: SettingsI | null;
  loading: boolean;
  fetchSettings: () => Promise<any | null>;
  updateSettings: (settings: any) => Promise<void>;
}

const useSettingsStore = create((set): SettingsStore => ({
  settings: null,
  loading: true,

  fetchSettings: async () => {
    set({ loading: true });
    try {
      const user: UserI = useUserStore.getState().user;
      const userID: number = user?.userID;
      if (!userID) {
        set({ loading: false });
        throw new UserIDRequiredException(
          SettingsExceptionMessages.UserIDRequiredException
        );
      }

      await axiosRequest(
        HttpEnum.GET,
        `${ApiEndpoints.hm_url + SettingsEndpoints.byID}${userID}`
      )
        .then((response: SettingsI) => {
          const parsedSettings = JSON.parse(response.settings);
          set({ settings: parsedSettings, loading: false });
          return parsedSettings;
        })
        .catch((error) => {
          set({ loading: false });
          throw new FetchSettingsException(
            SettingsExceptionMessages.FetchSettingsException + error
          );
        });
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
    await axiosRequest(
      HttpEnum.PUT,
      `${ApiEndpoints.hm_url + SettingsEndpoints.base}/${userID}`,
      {},
      settingsDTO
    )
      .then((response: SettingsI) => {
        const parsedSettings = JSON.parse(response.settings);
        set({ settings: parsedSettings });
        return parsedSettings;
      })
      .catch((error) => {
        throw new UpdateSettingsException(
          SettingsExceptionMessages.UpdateSettingsException + error
        );
      });
  },
}));

export default useSettingsStore;
