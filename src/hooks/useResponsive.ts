import { useEffect, useState, useCallback } from 'react';
import { useAppStore } from '../stores/appStore';

interface ResponsiveConfig {
  autoFoldBreakpoint: number;
  mobileBreakpoint: number;
  tabletBreakpoint: number;
}

const DEFAULT_CONFIG: ResponsiveConfig = {
  autoFoldBreakpoint: 1024,
  mobileBreakpoint: 640,
  tabletBreakpoint: 768,
};

export function useResponsive(config: Partial<ResponsiveConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1920
  );

  const {
    isSidebarCollapsed,
    setSidebarCollapsed,
    userOverrideSidebar,
    setUserOverrideSidebar
  } = useAppStore();

  const isMobile = windowWidth < finalConfig.mobileBreakpoint;
  const isTablet = windowWidth >= finalConfig.mobileBreakpoint && windowWidth < finalConfig.tabletBreakpoint;
  const isDesktop = windowWidth >= finalConfig.tabletBreakpoint;
  const shouldAutoFold = windowWidth < finalConfig.autoFoldBreakpoint;

  const handleResize = useCallback(() => {
    const newWidth = window.innerWidth;
    setWindowWidth(newWidth);

    // Auto-fold logic
    if (!userOverrideSidebar) {
      const shouldCollapse = newWidth < finalConfig.autoFoldBreakpoint;
      if (shouldCollapse !== isSidebarCollapsed) {
        setSidebarCollapsed(shouldCollapse);
      }
    }
  }, [userOverrideSidebar, isSidebarCollapsed, setSidebarCollapsed, finalConfig.autoFoldBreakpoint]);

  // Reset user override after window size changes significantly
  useEffect(() => {
    let overrideTimer: NodeJS.Timeout;

    if (userOverrideSidebar) {
      overrideTimer = setTimeout(() => {
        setUserOverrideSidebar(false);
      }, 5000); // Reset after 5 seconds
    }

    return () => clearTimeout(overrideTimer);
  }, [windowWidth, userOverrideSidebar, setUserOverrideSidebar]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(!isSidebarCollapsed);
    setUserOverrideSidebar(true);
  }, [isSidebarCollapsed, setSidebarCollapsed, setUserOverrideSidebar]);

  return {
    windowWidth,
    isMobile,
    isTablet,
    isDesktop,
    shouldAutoFold,
    isSidebarCollapsed,
    toggleSidebar,
    userOverrideSidebar,
  };
}