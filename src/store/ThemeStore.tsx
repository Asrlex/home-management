import { create } from 'zustand';
import { StoreEnum } from './entities/enums/store.enum';

interface ThemeStore {
  theme: StoreEnum.LIGHT | StoreEnum.DARK;
  setTheme: (theme: StoreEnum.LIGHT | StoreEnum.DARK) => void;
  toggleTheme: () => void;
}

const useThemeStore = create((set): ThemeStore => ({
  theme: (localStorage.getItem(StoreEnum.THEME) as StoreEnum.DARK | StoreEnum.LIGHT) || StoreEnum.LIGHT,
  setTheme: (theme: StoreEnum.LIGHT | StoreEnum.DARK) => {
    localStorage.setItem(StoreEnum.THEME, theme);
    document.documentElement.className = theme;
    set({ theme });
  },
  toggleTheme: () => {
    set((state: ThemeStore) => {
      const newTheme = state.theme === StoreEnum.LIGHT ? StoreEnum.DARK : StoreEnum.LIGHT;
      localStorage.setItem(StoreEnum.THEME, newTheme);
      document.documentElement.className = newTheme;
      return { theme: newTheme };
    });
  },
}));

export default useThemeStore;