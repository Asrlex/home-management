import { create } from 'zustand';

interface NotificationStore {
  notifications: Record<string, number>;
  notificationPermissions: NotificationPermission;
  setNotification: (section: string, count: number) => void;
  clearNotification: (section: string) => void;
  requestPermission: () => Promise<void>;
}

const useNotificationStore = create(
  (set): NotificationStore => ({
    notifications: {},
    notificationPermissions: Notification.permission,

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

    requestPermission: async () => {
      const permission = await Notification.requestPermission();
      set({ notificationPermissions: permission });
    },
  })
);

export default useNotificationStore;
