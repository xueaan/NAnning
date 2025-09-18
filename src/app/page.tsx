'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 自动跳转到 dashboard
    router.push('/dashboard');
  }, [router]);

  // 加载中显示
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            NAnning
          </span>
        </h1>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}