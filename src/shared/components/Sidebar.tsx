'use client';

import {
  Tag, Clock, BookOpen, PenTool, BookOpenCheck,
  Brain, CheckSquare, Target, Key, MessageCircle,
  Settings, Palette, MoreVertical, ChevronLeft, ChevronRight,
  Menu, PenSquare
} from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResponsive } from '@/hooks/useResponsive';
import { sidebarVariants, contentVariants, itemVariants, ANIMATION_CONFIG } from '@/config/animation';
import { useThemeStore } from '@/stores/themeStore';

const menuItems = [
  { id: 'tags', name: '标签页', icon: Tag, path: '/dashboard' },
  { id: 'editor', name: '编辑器', icon: PenSquare, path: '/dashboard/editor' },
  { id: 'timeline', name: '时间轴', icon: Clock, path: '/dashboard/timeline' },
  { id: 'knowledge', name: '知识库', icon: BookOpen, path: '/dashboard/knowledge' },
  { id: 'notes', name: '笔记盒', icon: PenTool, path: '/dashboard/notes' },
  { id: 'reading', name: '阅读志', icon: BookOpenCheck, path: '/dashboard/reading' },
  { id: 'mindmap', name: '思维图', icon: Brain, path: '/dashboard/mindmap' },
  { id: 'todo', name: '任务箱', icon: CheckSquare, path: '/dashboard/todo' },
  { id: 'habits', name: '习惯图', icon: Target, path: '/dashboard/habits' },
  { id: 'vault', name: '密码库', icon: Key, path: '/dashboard/vault' },
  { id: 'chat', name: '对话间', icon: MessageCircle, path: '/dashboard/chat' },
];

export function Sidebar() {
  const { activeModule, setActiveModule } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const { isSidebarCollapsed, toggleSidebar, isMobile } = useResponsive();
  const [isHovered, setIsHovered] = useState(false);
  const themeMode = useThemeStore((s) => s.mode);
  const setThemeMode = useThemeStore((s) => s.setMode);

  const shouldExpand = !isMobile && isSidebarCollapsed && isHovered;
  const effectiveCollapsed = isSidebarCollapsed && !shouldExpand;

  useEffect(() => {
    const found = menuItems.find((item) => pathname?.startsWith(item.path));
    if (found) {
      setActiveModule(found.id);
    }
  }, [pathname, setActiveModule]);

  const handleMenuClick = (item: typeof menuItems[number]) => {
    setActiveModule(item.id);
    router.push(item.path);
  };

  const handleSelectTheme = (mode: 'light' | 'dark' | 'auto') => {
    setThemeMode(mode);
    setShowThemeMenu(false);
  };

  return (
    <>
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg feather-glass-panel text-foreground/90 theme-shadow"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      <motion.aside
        initial={false}
        animate={effectiveCollapsed ? 'collapsed' : 'expanded'}
        variants={sidebarVariants}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          h-screen flex flex-col feather-glass-sidebar
          fixed left-0 top-0 z-40
          ${isMobile && isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}
          transition-transform duration-300
        `}
        style={{
          width: effectiveCollapsed
            ? `${ANIMATION_CONFIG.sidebar.collapsedWidth}px`
            : `${ANIMATION_CONFIG.sidebar.expandedWidth}px`
        }}
      >
        <div className="p-4 flex items-center justify-between border-b border-border/25 text-foreground/80">
          <motion.div
            className="flex items-center gap-3"
            animate={{ justifyContent: effectiveCollapsed ? 'center' : 'flex-start' }}
          >
            <div className="text-2xl font-bold bg-gradient-to-br from-primary/80 to-secondary/70 bg-clip-text text-transparent">
              N
            </div>
            <AnimatePresence>
              {!effectiveCollapsed && (
                <motion.span
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="text-foreground/95 font-medium"
                >
                  NAnning
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          {!isMobile && (
            <motion.button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors text-foreground/50 hover:text-foreground"
              animate={{ opacity: effectiveCollapsed ? 0 : 1 }}
              style={{ pointerEvents: effectiveCollapsed ? 'none' : 'auto' }}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </motion.button>
          )}
        </div>

        <nav className="flex-1 py-2 overflow-y-auto overflow-x-hidden">
          <motion.ul className="space-y-1 px-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;

              return (
                <motion.li
                  key={item.id}
                  variants={itemVariants}
                  custom={index}
                >
                  <button
                    onClick={() => handleMenuClick(item)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                      transition-all relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
                      ${isActive
                        ? 'feather-glass-active text-foreground'
                        : 'hover:bg-primary/10 text-foreground/60 hover:text-foreground'
                      }
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-r-full"
                      />
                    )}

                    <div className={`
                      flex items-center justify-center text-inherit
                      ${effectiveCollapsed ? 'w-full' : 'w-5'}
                    `}>
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>

                    <AnimatePresence>
                      {!effectiveCollapsed && (
                        <motion.span
                          variants={contentVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="flex-1 text-left text-sm whitespace-nowrap"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {effectiveCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 surface-strong text-foreground/90 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                        {item.name}
                      </div>
                    )}
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>
        </nav>

        <div className="px-3 py-3 border-t border-border/25">
          <motion.div className={effectiveCollapsed ? 'text-center' : 'px-2'}>
            <AnimatePresence mode="wait">
              {effectiveCollapsed ? (
                <motion.div
                  key="collapsed-tasks"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="flex flex-col items-center gap-1 text-foreground/60"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span className="text-foreground/50 text-xs">0</span>
                </motion.div>
              ) : (
                <motion.div
                  key="expanded-tasks"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between text-foreground/60 text-sm">
                    <span>今日任务</span>
                    <span className="font-medium text-foreground/70">0/0</span>
                  </div>
                  <div className="h-1 bg-foreground/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary/80 to-secondary/70 w-0"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className={`
          flex border-t border-border/20
          ${effectiveCollapsed ? 'flex-col' : 'flex-row'}
        `}>
          <button
            className="flex-1 p-3 text-foreground/60 hover:text-foreground hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
            title="设置"
          >
            <Settings className="w-4 h-4" strokeWidth={1.5} />
            {!effectiveCollapsed && <span className="text-xs">设置</span>}
          </button>

          <div className={`relative flex-1 ${effectiveCollapsed ? 'w-full' : ''}`}>
            <button
              className="w-full p-3 text-foreground/60 hover:text-foreground hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
              title="主题"
              onClick={() => setShowThemeMenu((prev) => !prev)}
            >
              <Palette className="w-4 h-4" strokeWidth={1.5} />
              {!effectiveCollapsed && <span className="text-xs">主题</span>}
            </button>

            <AnimatePresence>
              {showThemeMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 mb-2 surface-strong border border-border/30 rounded-lg p-3 theme-shadow"
                >
                  <div className="text-xs text-foreground/60 whitespace-nowrap mb-2">主题切换</div>
                  <div className="space-y-1">
                    <button
                      className={`block w-full text-left px-2 py-1 text-xs rounded transition-colors ${themeMode === 'light' ? 'bg-primary/15 text-foreground' : 'text-foreground/70 hover:text-foreground hover:bg-primary/10'}`}
                      onClick={() => handleSelectTheme('light')}
                    >
                      亮色模式
                    </button>
                    <button
                      className={`block w-full text-left px-2 py-1 text-xs rounded transition-colors ${themeMode === 'dark' ? 'bg-primary/15 text-foreground' : 'text-foreground/70 hover:text-foreground hover:bg-primary/10'}`}
                      onClick={() => handleSelectTheme('dark')}
                    >
                      暗色模式
                    </button>
                    <button
                      className={`block w-full text-left px-2 py-1 text-xs rounded transition-colors ${themeMode === 'auto' ? 'bg-primary/15 text-foreground' : 'text-foreground/70 hover:text-foreground hover:bg-primary/10'}`}
                      onClick={() => handleSelectTheme('auto')}
                    >
                      自动模式
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            className="flex-1 p-3 text-foreground/60 hover:text-foreground hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
            title="更多"
          >
            <MoreVertical className="w-4 h-4" strokeWidth={1.5} />
            {!effectiveCollapsed && <span className="text-xs">更多</span>}
          </button>
        </div>
      </motion.aside>

      {isMobile && !isSidebarCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleSidebar}
          className="fixed inset-0 bg-background/60 backdrop-blur-xs z-30 lg:hidden"
        />
      )}
    </>
  );
}
