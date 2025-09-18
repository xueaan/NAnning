'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Plus, Github, Globe, Book, Video,
  Moon, Sun, Cloud, CloudRain
} from 'lucide-react';

// 快速链接数据
const quickLinks = [
  { name: 'GitHub', icon: Github, url: 'https://github.com' },
  { name: 'Google', icon: Globe, url: 'https://google.com' },
  { name: '知乎', text: '知', url: 'https://zhihu.com' },
  { name: 'Bilibili', text: 'B', url: 'https://bilibili.com' },
  { name: '微博', text: '微', url: 'https://weibo.com' },
  { name: 'YouTube', icon: Video, url: 'https://youtube.com' },
];

export default function HomePage() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // 设置问候语
    const hour = new Date().getHours();
    if (hour < 6) setGreeting('深夜了，注意休息');
    else if (hour < 9) setGreeting('早上好！');
    else if (hour < 12) setGreeting('上午好！');
    else if (hour < 14) setGreeting('中午好！');
    else if (hour < 17) setGreeting('下午好！');
    else if (hour < 19) setGreeting('傍晚好！');
    else if (hour < 22) setGreeting('晚上好！');
    else setGreeting('夜深了，早点休息');

    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // 可以实现搜索功能
      console.log('Searching:', searchQuery);
    }
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('zh-CN', {
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  // 模拟系统状态
  const systemStats = [
    { label: '今日', value: 75, color: 'bg-blue-400' },
    { label: '本周', value: 53, color: 'bg-green-400' },
    { label: '本年', value: 71, color: 'bg-purple-400' },
  ];

  return (
    <div className="min-h-screen gradient-bg p-8">
      <div className="max-w-7xl mx-auto">
        {/* 时间和问候 */}
        <div className="text-center mb-12">
          <div className="text-gray-600 text-sm mb-2">{formatDate()}</div>
          <div className="text-7xl font-light text-gray-800 mb-4">
            {formatTime()}
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-700">
            <Moon className="w-5 h-5" />
            <span className="text-xl">{greeting}</span>
          </div>
        </div>

        {/* 搜索栏 */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="glass rounded-full px-6 py-4 flex items-center space-x-4">
            <Search className="w-5 h-5 text-gray-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
              placeholder="搜索一下"
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500"
            />
          </div>
        </div>

        {/* 系统状态 */}
        <div className="flex justify-center space-x-12 mb-12">
          {systemStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
              <div className="relative w-20 h-32">
                <div className="absolute bottom-0 w-full bg-white/30 rounded-full"
                     style={{ height: '100%' }}>
                  <div
                    className={`absolute bottom-0 w-full ${stat.color} rounded-full transition-all duration-1000`}
                    style={{ height: `${stat.value}%` }}
                  />
                </div>
                <div className="absolute bottom-0 w-full text-center text-sm font-semibold text-gray-700">
                  {stat.value}%
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 快速链接 */}
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-6 gap-4">
            {quickLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-2xl p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform cursor-pointer group"
              >
                {link.icon ? (
                  <link.icon className="w-8 h-8 text-gray-700 group-hover:text-purple-600 transition-colors mb-2" />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center text-xl font-bold text-gray-700 group-hover:text-purple-600 transition-colors mb-2">
                    {link.text}
                  </div>
                )}
                <span className="text-sm text-gray-600">{link.name}</span>
              </a>
            ))}
          </div>

          {/* 操作按钮 */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button className="glass rounded-2xl p-4 text-gray-700 hover:scale-105 transition-transform">
              百度
            </button>
            <button className="glass rounded-2xl p-4 flex items-center justify-center space-x-2 text-gray-700 hover:scale-105 transition-transform">
              <Plus className="w-5 h-5" />
              <span>添加</span>
            </button>
          </div>
        </div>

        {/* 今日待办事项 */}
        <div className="max-w-3xl mx-auto mt-8">
          <div className="glass-light rounded-2xl p-4 text-center text-gray-600">
            今日无待办事项
          </div>
        </div>
      </div>
    </div>
  );
}