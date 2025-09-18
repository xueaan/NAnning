import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface AppState {
  // 应用状态
  theme: 'light' | 'dark' | 'auto';
  sidebarOpen: boolean;
  activeModule: string | null;

  // 用户设置
  settings: {
    language: string;
    autoSave: boolean;
    fontSize: number;
  };

  // Actions
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  toggleSidebar: () => void;
  setActiveModule: (module: string | null) => void;
  updateSettings: (settings: Partial<AppState['settings']>) => void;
}

export const useAppStore = create<AppState>()(
  immer((set) => ({
    // 初始状态
    theme: 'dark',
    sidebarOpen: true,
    activeModule: null,
    settings: {
      language: 'en',
      autoSave: true,
      fontSize: 14,
    },

    // Actions
    setTheme: (theme) =>
      set((state) => {
        state.theme = theme;
      }),

    toggleSidebar: () =>
      set((state) => {
        state.sidebarOpen = !state.sidebarOpen;
      }),

    setActiveModule: (module) =>
      set((state) => {
        state.activeModule = module;
      }),

    updateSettings: (newSettings) =>
      set((state) => {
        Object.assign(state.settings, newSettings);
      }),
  }))
);