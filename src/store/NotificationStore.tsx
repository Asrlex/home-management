import { create } from 'zustand';

interface NotificationStore {
  notifications: Record<string, number>;
  setNotification: (section: string, count: number) => void;
  clearNotification: (section: string) => void;
  requestPermission: () => Promise<void>;
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

  requestPermission: async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    } else {
      console.error('Notification permission denied.');
    }
  },
}));

export default useNotificationStore;