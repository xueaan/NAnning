import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { Theme, GradientConfig, PresetTheme } from '@/modules/theme/types';
import { presetThemes } from '@/modules/theme/presets';
import { ThemeEngine } from '@/modules/theme/ThemeEngine';

interface ThemeStore {
  // State
  currentTheme: Theme;
  customThemes: Theme[];
  mode: 'light' | 'dark' | 'auto';

  // Control values
  gradientAngle: number;
  gradientStops: number;
  blendIntensity: number;
  overlayOpacity: number; // 0-100 (mapped to 0-1)
  noiseOpacity: number;   // 0-100 (mapped to 0-1)

  // Actions
  setTheme: (theme: Theme) => void;
  applyPreset: (presetKey: string) => void;
  updateGradient: (config: Partial<GradientConfig>) => void;
  updateGradientAngle: (angle: number) => void;
  updateGradientStops: (stops: number) => void;
  updateBlendIntensity: (intensity: number) => void;
  updateOverlayOpacity: (v: number) => void;
  updateNoiseOpacity: (v: number) => void;
  saveCustomTheme: (name: string) => void;
  deleteCustomTheme: (id: string) => void;
  setMode: (mode: 'light' | 'dark' | 'auto') => void;
  resetToDefault: () => void;
}

const defaultTheme: Theme = {
  id: 'default',
  name: 'Default',
  mode: 'light',
  gradient: presetThemes[0].gradient,
  colors: presetThemes[0].colors,
  glass: presetThemes[0].glass,
  isPreset: true
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    immer((set, get) => ({
      // Initial state
      currentTheme: defaultTheme,
      customThemes: [],
      mode: 'light',
      gradientAngle: 135,
      gradientStops: 24,
      blendIntensity: 100,
      overlayOpacity: 12,
      noiseOpacity: 0,

      // Set complete theme
      setTheme: (theme) => {
        set((state) => {
          state.currentTheme = theme;
          state.gradientAngle = theme.gradient.angle;
          state.gradientStops = theme.gradient.stops[1]?.position || 50;
        });

        // Apply theme to DOM
        if (typeof window !== 'undefined') {
          ThemeEngine.applyTheme(theme);
          // keep overlay variables in sync
          const root = document.documentElement;
          root.style.setProperty('--bg-overlay-color', '0 0 0');
          root.style.setProperty('--bg-overlay-opacity', (get().overlayOpacity / 100).toString());
          root.style.setProperty('--noise-opacity', (get().noiseOpacity / 100).toString());
        }
      },

      // Apply preset theme
      applyPreset: (presetKey) => {
        const preset = presetThemes.find(p => p.key === presetKey);
        if (preset) {
          const theme: Theme = {
            id: `preset-${presetKey}`,
            name: preset.name,
            mode: preset.mode,
            gradient: preset.gradient,
            colors: preset.colors,
            glass: preset.glass,
            isPreset: true
          };
          get().setTheme(theme);
        }
      },

      // Update gradient configuration
      updateGradient: (config) => {
        set((state) => {
          Object.assign(state.currentTheme.gradient, config);
        });

        const theme = get().currentTheme;
        if (typeof window !== 'undefined') {
          ThemeEngine.applyTheme(theme);
          const root = document.documentElement;
          root.style.setProperty('--bg-overlay-opacity', (get().overlayOpacity / 100).toString());
          root.style.setProperty('--noise-opacity', (get().noiseOpacity / 100).toString());
        }
      },

      // Update gradient angle
      updateGradientAngle: (angle) => {
        set((state) => {
          state.gradientAngle = angle;
          state.currentTheme.gradient.angle = angle;
        });

        const theme = get().currentTheme;
        if (typeof window !== 'undefined') {
          ThemeEngine.applyTheme(theme);
          const root = document.documentElement;
          root.style.setProperty('--bg-overlay-opacity', (get().overlayOpacity / 100).toString());
          root.style.setProperty('--noise-opacity', (get().noiseOpacity / 100).toString());
        }
      },

      // Update gradient stops position
      updateGradientStops: (stops) => {
        set((state) => {
          state.gradientStops = stops;
          // Adjust middle stops based on the slider value
          const adjustedConfig = ThemeEngine.adjustStops(
            state.currentTheme.gradient,
            stops / 50 // Normalize to factor
          );
          state.currentTheme.gradient = adjustedConfig;
        });

        const theme = get().currentTheme;
        if (typeof window !== 'undefined') {
          ThemeEngine.applyTheme(theme);
        }
      },

      // Update blend intensity
      updateBlendIntensity: (intensity) => {
        set((state) => {
          state.blendIntensity = intensity;
          // Adjust glass opacity based on intensity
          state.currentTheme.glass.opacity = 0.1 + (intensity / 100) * 0.3;
          // Also sync background overlay a bit so users see effect
          state.overlayOpacity = Math.round((intensity / 100) * 35); // up to 0.35
        });

        const theme = get().currentTheme;
        if (typeof window !== 'undefined') {
          ThemeEngine.applyTheme(theme);
          const root = document.documentElement;
          root.style.setProperty('--bg-overlay-opacity', (get().overlayOpacity / 100).toString());
        }
      },

      // Update background overlay opacity (readability)
      updateOverlayOpacity: (v) => {
        set((state) => {
          state.overlayOpacity = Math.max(0, Math.min(100, v));
        });
        if (typeof window !== 'undefined') {
          document.documentElement.style.setProperty('--bg-overlay-opacity', (get().overlayOpacity / 100).toString());
        }
      },

      // Update noise opacity
      updateNoiseOpacity: (v) => {
        set((state) => {
          state.noiseOpacity = Math.max(0, Math.min(100, v));
        });
        if (typeof window !== 'undefined') {
          document.documentElement.style.setProperty('--noise-opacity', (get().noiseOpacity / 100).toString());
        }
      },

      // Save current theme as custom
      saveCustomTheme: (name) => {
        const currentTheme = get().currentTheme;
        const customTheme: Theme = {
          ...currentTheme,
          id: `custom-${Date.now()}`,
          name,
          isPreset: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        set((state) => {
          state.customThemes.push(customTheme);
        });
      },

      // Delete custom theme
      deleteCustomTheme: (id) => {
        set((state) => {
          state.customThemes = state.customThemes.filter(t => t.id !== id);
        });
      },

      // Set mode
      setMode: (mode) => {
        set((state) => {
          state.mode = mode;
          state.currentTheme.mode = mode;
        });

        const theme = get().currentTheme;
        if (typeof window !== 'undefined') {
          ThemeEngine.applyTheme(theme);
          const root = document.documentElement;
          // default overlay color to black; can be extended later
          root.style.setProperty('--bg-overlay-color', '0 0 0');
          root.style.setProperty('--bg-overlay-opacity', (get().overlayOpacity / 100).toString());
          root.style.setProperty('--noise-opacity', (get().noiseOpacity / 100).toString());
        }
      },

      // Reset to default
      resetToDefault: () => {
        get().setTheme(defaultTheme);
        set((state) => {
          state.gradientAngle = 135;
          state.gradientStops = 24;
          state.blendIntensity = 100;
          state.overlayOpacity = 12;
          state.noiseOpacity = 0;
        });
      }
    })),
    {
      name: 'theme-storage',
      partialize: (state) => ({
        currentTheme: state.currentTheme,
        customThemes: state.customThemes,
        mode: state.mode,
        overlayOpacity: state.overlayOpacity,
        noiseOpacity: state.noiseOpacity
      })
    }
  )
);
