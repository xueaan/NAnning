'use client';

import { Sidebar } from '@/shared/components/Sidebar';
import { TitleBar } from '@/shared/components/TitleBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* 自定义标题栏 */}
      <TitleBar />

      {/* 主体内容区 */}
      <div className="h-full pt-8 flex">
        {/* 侧边栏 */}
        <Sidebar />

        {/* 内容区 */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}