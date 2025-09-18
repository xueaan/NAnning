'use client';

import { FileText, Brain, Palette, Search, Box, Settings, Home, MessageSquare } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

const menuItems = [
  { id: 'home', name: 'Home', icon: Home },
  { id: 'editor', name: 'Editor', icon: FileText },
  { id: 'knowledge', name: 'Knowledge', icon: Brain },
  { id: 'ai-chat', name: 'AI Chat', icon: MessageSquare },
  { id: 'theme', name: 'Themes', icon: Palette },
  { id: 'search', name: 'Search', icon: Search },
  { id: 'plugins', name: 'Plugins', icon: Box },
  { id: 'settings', name: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { activeModule, setActiveModule, sidebarOpen } = useAppStore();

  if (!sidebarOpen) {
    return (
      <div className="glass border-r border-white/10 w-16 h-screen flex flex-col items-center py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`
                p-3 rounded-lg mb-2 transition-all
                ${activeModule === item.id
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'hover:bg-white/10 text-gray-400 hover:text-white'
                }
              `}
              title={item.name}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="glass border-r border-white/10 w-64 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          NAnning
        </h1>
        <p className="text-xs text-gray-400 mt-1">Knowledge Management Platform</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-1
                transition-all
                ${activeModule === item.id
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'hover:bg-white/10 text-gray-300 hover:text-white'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="glass-heavy rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-300">Online</span>
            </div>
            <span className="text-xs text-gray-400">v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}