'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';
import { ThemeEngine } from '@/modules/theme/ThemeEngine';

export function ThemeInitializer() {
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const overlayOpacity = useThemeStore((s) => s.overlayOpacity);
  const noiseOpacity = useThemeStore((s) => s.noiseOpacity);

  useEffect(() => {
    if (typeof window !== 'undefined' && currentTheme) {
      ThemeEngine.applyTheme(currentTheme, false);
      // Apply overlay defaults
      const root = document.documentElement;
      root.style.setProperty('--bg-overlay-color', '0 0 0');
      root.style.setProperty('--bg-overlay-opacity', (overlayOpacity / 100).toString());
      root.style.setProperty('--noise-opacity', (noiseOpacity / 100).toString());
    }
  }, [currentTheme, overlayOpacity, noiseOpacity]);

  return null;
}
