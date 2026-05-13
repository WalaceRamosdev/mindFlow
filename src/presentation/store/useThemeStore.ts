import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  loadTheme: () => Promise<void>;
}

const THEME_STORAGE_KEY = 'mindflow_theme_preference';

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',
  
  toggleTheme: async () => {
    const nextTheme = get().theme === 'light' ? 'dark' : 'light';
    await AsyncStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    set({ theme: nextTheme });
  },

  loadTheme: async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        set({ theme: savedTheme });
      }
    } catch (e) {
      console.warn('Erro ao carregar tema preferencial:', e);
    }
  },
}));
