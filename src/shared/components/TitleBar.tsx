'use client';

import { useState, useEffect } from 'react';
import { Minus, Square, X } from 'lucide-react';

export function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    // 检查初始最大化状态
    if (typeof window !== 'undefined' && (window as any).electron) {
      (window as any).electron.window.isMaximized().then(setIsMaximized);
    }
  }, []);

  const handleMinimize = () => {
    if ((window as any).electron) {
      (window as any).electron.window.minimize();
    }
  };

  const handleMaximize = () => {
    if ((window as any).electron) {
      (window as any).electron.window.maximize();
      setIsMaximized(!isMaximized);
    }
  };

  const handleClose = () => {
    if ((window as any).electron) {
      (window as any).electron.window.close();
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-8 flex items-center justify-between z-50"
         style={{ WebkitAppRegion: 'drag' } as any}>
      {/* 标题区域 - 可拖拽 */}
      <div className="flex-1 h-full flex items-center px-4">
        <span className="text-sm font-medium text-gray-700">NAnning</span>
      </div>

      {/* 窗口控制按钮 - 不可拖拽 */}
      <div className="flex items-center h-full" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <button
          onClick={handleMinimize}
          className="h-full px-4 hover:bg-black/5 transition-colors flex items-center justify-center"
          title="最小化"
        >
          <Minus className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={handleMaximize}
          className="h-full px-4 hover:bg-black/5 transition-colors flex items-center justify-center"
          title={isMaximized ? "还原" : "最大化"}
        >
          <Square className="w-3 h-3 text-gray-600" />
        </button>
        <button
          onClick={handleClose}
          className="h-full px-4 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
          title="关闭"
        >
          <X className="w-4 h-4 text-gray-600 hover:text-white" />
        </button>
      </div>
    </div>
  );
}