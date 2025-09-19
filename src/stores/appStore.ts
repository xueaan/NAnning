import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface AppState {
  // 应用状态
  theme: 'light' | 'dark' | 'auto';
  sidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  userOverrideSidebar: boolean;
  sidebarWidth: number;
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
  setSidebarCollapsed: (collapsed: boolean) => void;
  setUserOverrideSidebar: (override: boolean) => void;
  setSidebarWidth: (width: number) => void;
  setActiveModule: (module: string | null) => void;
  updateSettings: (settings: Partial<AppState['settings']>) => void;
}

export const useAppStore = create<AppState>()(
  immer((set) => ({
    // 初始状态
    theme: 'dark',
    sidebarOpen: true,
    isSidebarCollapsed: false,
    userOverrideSidebar: false,
    sidebarWidth: 240,
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

    setSidebarCollapsed: (collapsed) =>
      set((state) => {
        state.isSidebarCollapsed = collapsed;
      }),

    setUserOverrideSidebar: (override) =>
      set((state) => {
        state.userOverrideSidebar = override;
      }),

    setSidebarWidth: (width) =>
      set((state) => {
        state.sidebarWidth = width;
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
