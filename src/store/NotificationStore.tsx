import { create } from 'zustand';

interface NotificationStore {
  notifications: Record<string, number>;
  setNotification: (section: string, count: number) => void;
  clearNotification: (section: string) => void;
}

const useNotificationStore = create((set): NotificationStore => ({
  notifications: {},

  setNotification: (section, count) =>
    set((state) => ({
      notifications: {
        ...state.notifications,
        [section]: count,
      },
    })),

  clearNotification: (section) =>
    set((state) => {
      const updatedNotifications = { ...state.notifications };
      delete updatedNotifications[section];
      return { notifications: updatedNotifications };
    }),
}));

export default useNotificationStore;