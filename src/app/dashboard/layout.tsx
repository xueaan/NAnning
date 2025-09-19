'use client';

import { Sidebar } from '@/shared/components/Sidebar';
import { TitleBar } from '@/shared/components/TitleBar';
import { ThemePanel } from '@/shared/components/ThemePanel';
import { useState } from 'react';
import { Sun, Moon, SlidersHorizontal } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { useResponsive } from '@/hooks/useResponsive';
import { ANIMATION_CONFIG } from '@/config/animation';
import { motion } from 'framer-motion';

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
    <div className="h-screen w-screen overflow-hidden relative gradient-bg with-noise theme-switch-wrapper">
      {/* Decorative floating orbs - Anning style */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-white/20 to-transparent blur-3xl opacity-50"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-white/20 to-transparent blur-3xl opacity-50"
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>
      <TitleBar />

      <div className="h-full pt-8 flex relative">
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

      <motion.div
        className="absolute bottom-6 right-6 flex items-center justify-center z-30"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <div className="feather-glass-panel border border-border/25 rounded-full px-3 py-2 flex items-center gap-2 shadow-lg backdrop-blur-md">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-full hover:bg-primary/15 transition-all text-foreground/80 hover:text-foreground hover:scale-110 relative group"
            title="主题设置"
          >
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <SlidersHorizontal className="w-5 h-5 relative z-10" />
          </button>
          <button
            onClick={toggleMode}
            className="p-2 rounded-full hover:bg-primary/15 transition-all text-foreground/80 hover:text-foreground hover:scale-110 hover:rotate-180 relative group"
            title="切换明暗模式"
          >
            <div className="absolute inset-0 rounded-full bg-secondary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            {mode === 'dark' ? (
              <Sun className="w-5 h-5 relative z-10" />
            ) : (
              <Moon className="w-5 h-5 relative z-10" />
            )}
          </button>
        </div>
      </motion.div>

      <ThemePanel open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
