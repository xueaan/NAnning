'use client';

import { FileText, Brain, Palette, Search, Box, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const modules = [
    { id: 'editor', name: 'Editor', icon: FileText, description: 'Code & Rich Text Editor', color: 'from-blue-500/20 to-cyan-500/20' },
    { id: 'knowledge', name: 'Knowledge', icon: Brain, description: 'Knowledge Management', color: 'from-purple-500/20 to-pink-500/20' },
    { id: 'theme', name: 'Theme', icon: Palette, description: 'Theme System', color: 'from-orange-500/20 to-red-500/20' },
    { id: 'search', name: 'Search', icon: Search, description: 'Smart Search', color: 'from-green-500/20 to-teal-500/20' },
    { id: 'plugins', name: 'Plugins', icon: Box, description: 'Extension System', color: 'from-indigo-500/20 to-purple-500/20' },
    { id: 'settings', name: 'Settings', icon: Settings, description: 'App Settings', color: 'from-gray-500/20 to-gray-600/20' },
  ];

  const handleModuleClick = (moduleId: string) => {
    router.push(`/dashboard/${moduleId}`);
  };

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome to NAnning
          </span>
        </h1>
        <p className="text-gray-400">
          Choose a module to get started
        </p>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => {
          const Icon = module.icon;
          return (
            <button
              key={module.id}
              onClick={() => handleModuleClick(module.id)}
              className="glass p-6 rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 text-left animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${module.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {module.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {module.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-12 glass-heavy rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Stats</h2>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <p className="text-3xl font-bold text-purple-400">0</p>
            <p className="text-sm text-gray-400">Documents</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-400">0</p>
            <p className="text-sm text-gray-400">Knowledge Bases</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-400">3</p>
            <p className="text-sm text-gray-400">Themes</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-orange-400">0</p>
            <p className="text-sm text-gray-400">Plugins</p>
          </div>
        </div>
      </div>
    </div>
  );
}