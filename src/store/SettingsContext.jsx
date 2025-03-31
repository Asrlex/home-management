import { create } from "zustand";
import { axiosRequest } from "../services/AxiosRequest";
import api_config from "../config/apiconfig";
import useUserStore from "./UserContext";

const useSettingsStore = create((set) => ({
  settings: null,
  loading: true,

  fetchSettings: async () => {
    set({ loading: true });
    try {
      const user = useUserStore.getState().user;
      const userID = user?.id || user?.userID;
      if (!userID) {
        console.error("User ID is required to fetch settings.");
        set({ loading: false });
        return null;
      }

      let response = await axiosRequest(
        "GET",
        `${api_config.settings.byID}${userID}`
      );
      if (response && response.settings) {
        const parsedSettings = JSON.parse(response.settings);
        set({ settings: parsedSettings, loading: false });
        return parsedSettings;
      } else {
        set({ loading: false });
        return null;
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      set({ loading: false });
      return null;
    }
  },

  updateSettings: async (settings) => {
    try {
      const user = useUserStore.getState().user;
      const userID = user?.id || user?.userID;

      if (!userID) {
        console.error("User ID is required to update settings.");
        return;
      }

      const stringifiedSettings = JSON.stringify(settings);
      await axiosRequest(
        "PUT",
        `${api_config.settings.base}/${userID}`,
        {},
        { settings: stringifiedSettings, settingsUserID: userID }
      );
      set((state) => ({
        settings: { ...state.settings, ...settings },
        loading: false,
      }));
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  },
}));

export default useSettingsStore;
