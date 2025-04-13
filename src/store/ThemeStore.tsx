import { create } from 'zustand';
import { StoreEnum } from './entities/enums/store.enum';

interface ThemeStore {
  theme: StoreEnum.LIGHT | StoreEnum.DARK;
  toggleTheme: () => void;
}

const useThemeStore = create((set): ThemeStore => ({
    theme: (localStorage.getItem(StoreEnum.THEME) === StoreEnum.DARK ? StoreEnum.DARK : StoreEnum.LIGHT),
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