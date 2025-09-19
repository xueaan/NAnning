'use client';

import { useState, useEffect } from 'react';
import { Minus, Square, X, Maximize2 } from 'lucide-react';

type ElectronWindowApi = {
  minimize?: () => void | Promise<unknown>;
  maximize?: () => boolean | Promise<boolean>;
  close?: () => void | Promise<unknown>;
  toggleFullScreen?: () => boolean | Promise<boolean>;
  isMaximized?: () => boolean | Promise<boolean>;
  isFocused?: () => boolean | Promise<boolean>;
  onMaximizedChange?: (callback: (state: boolean) => void) => (() => void) | void;
  onFocusChange?: (callback: (state: boolean) => void) => (() => void) | void;
};

function getElectronWindow(): ElectronWindowApi | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  return (window as any).electron?.window as ElectronWindowApi | undefined;
}

export function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isFocused, setIsFocused] = useState(true);

  useEffect(() => {
    const electronWindow = getElectronWindow();
    if (!electronWindow) {
      return;
    }

    let cancelled = false;

    Promise.resolve(electronWindow.isMaximized?.())
      .then((state) => {
        if (!cancelled && typeof state === 'boolean') {
          setIsMaximized(state);
        }
      })
      .catch(() => {});

    Promise.resolve(electronWindow.isFocused?.())
      .then((state) => {
        if (!cancelled && typeof state === 'boolean') {
          setIsFocused(state);
        }
      })
      .catch(() => {});

    const disposers: Array<() => void> = [];

    const unsubscribeMax = electronWindow.onMaximizedChange?.((state) => {
      setIsMaximized(Boolean(state));
    });
    if (typeof unsubscribeMax === 'function') {
      disposers.push(unsubscribeMax);
    }

    const unsubscribeFocus = electronWindow.onFocusChange?.((state) => {
      setIsFocused(Boolean(state));
    });
    if (typeof unsubscribeFocus === 'function') {
      disposers.push(unsubscribeFocus);
    }

    return () => {
      cancelled = true;
      disposers.forEach((dispose) => dispose());
    };
  }, []);

  const buttonBase = 'h-full px-3 transition-colors flex items-center justify-center group';
  const iconClass = isFocused
    ? 'text-foreground/60 group-hover:text-foreground'
    : 'text-foreground/40 group-hover:text-foreground/80';
  const containerClassName = `fixed top-0 left-0 right-0 h-8 flex items-center justify-between z-50 bg-transparent ${isFocused ? '' : 'opacity-80'}`;

  const handleMinimize = () => {
    const electronWindow = getElectronWindow();
    electronWindow?.minimize?.();
  };

  const handleMaximize = async () => {
    const electronWindow = getElectronWindow();
    if (!electronWindow?.maximize) {
      return;
    }
    try {
      const state = await Promise.resolve(electronWindow.maximize());
      if (typeof state === 'boolean') {
        setIsMaximized(state);
      }
    } catch (error) {
      console.error('Failed to toggle maximize state', error);
    }
  };

  const handleClose = () => {
    const electronWindow = getElectronWindow();
    electronWindow?.close?.();
  };

  return (
    <div
      className={containerClassName}
      style={{ WebkitAppRegion: 'drag' } as any}
      data-window-focused={isFocused}
    >
      <div className="flex-1 h-full flex items-center px-4">
        <span className="text-sm font-medium text-foreground/80 select-none">NAnning</span>
      </div>

      <div className="flex items-center h-full" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <button
          onClick={handleMinimize}
          className={`${buttonBase} hover:bg-primary/10`}
          title="Minimize"
          aria-label="Minimize window"
        >
          <Minus className={`w-3 h-3 ${iconClass}`} />
        </button>
        <button
          onClick={handleMaximize}
          className={`${buttonBase} hover:bg-primary/10`}
          title={isMaximized ? 'Restore' : 'Maximize'}
          aria-label={isMaximized ? 'Restore window size' : 'Maximize window'}
        >
          {isMaximized ? (
            <Square className={`w-2.5 h-2.5 ${iconClass}`} />
          ) : (
            <Maximize2 className={`w-2.5 h-2.5 ${iconClass}`} />
          )}
        </button>
        <button
          onClick={handleClose}
          className={`${buttonBase} hover:bg-accent/30`}
          title="Close"
          aria-label="Close window"
        >
          <X className={`w-3.5 h-3.5 ${iconClass}`} />
        </button>
      </div>
    </div>
  );
}
