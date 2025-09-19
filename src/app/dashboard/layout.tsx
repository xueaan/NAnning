'use client';

import { Sidebar } from '@/shared/components/Sidebar';
import { TitleBar } from '@/shared/components/TitleBar';
import { ThemePanel } from '@/shared/components/ThemePanel';
import { useState } from 'react';
import { Sun, Moon, SlidersHorizontal } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { useResponsive } from '@/hooks/useResponsive';
import { ANIMATION_CONFIG } from '@/config/animation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const toggleMode = () => setMode(mode === 'dark' ? 'light' : 'dark');
  const { isSidebarCollapsed, isMobile } = useResponsive();

  const sidebarWidth = isSidebarCollapsed
    ? ANIMATION_CONFIG.sidebar.collapsedWidth
    : ANIMATION_CONFIG.sidebar.expandedWidth;

  return (
    <div className="h-screen w-screen overflow-hidden relative z-10 gradient-bg theme-switch-wrapper">
      <div aria-hidden className="absolute inset-0 theme-overlay" />
      <div aria-hidden className="absolute inset-0 theme-noise-overlay" />
      <TitleBar />

      <div className="h-full pt-8 flex relative z-10">
        <Sidebar />

        <main
          className="flex-1 overflow-auto transition-all duration-300"
          style={{
            marginLeft: isMobile ? 0 : sidebarWidth,
          }}
        >
          {children}
        </main>
      </div>

      <div className="absolute bottom-6 right-6 flex items-center justify-center z-30">
        <div className="surface-base border border-border/25 rounded-full px-3 py-2 flex items-center gap-2 theme-shadow">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-full hover:bg-primary/15 transition text-foreground/80 hover:text-foreground"
            title="主题设置"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
          <button
            onClick={toggleMode}
            className="p-2 rounded-full hover:bg-primary/15 transition text-foreground/80 hover:text-foreground"
            title="切换明暗模式"
          >
            {mode === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <ThemePanel open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
