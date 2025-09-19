'use client';

import { motion } from 'framer-motion';
import { fadeInVariants } from '@/config/animation';
import { Construction, Clock as ClockIcon, Code2, Wrench } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="h-full p-8">
      <motion.div
        variants={fadeInVariants}
        initial="initial"
        animate="animate"
        className="h-full flex items-center justify-center"
      >
        <div className="text-center max-w-2xl">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center animate-pulse">
                <Construction className="w-16 h-16 text-primary/70" />
              </div>
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              >
                <Wrench className="w-8 h-8 text-secondary/70" />
              </motion.div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            正在施工
          </h1>

          <p className="text-lg text-foreground/70 mb-8">
            NAnning 系统正在全面升级中，敬请期待全新体验
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="feather-glass-panel p-4 rounded-lg text-foreground/80">
              <ClockIcon className="w-6 h-6 text-primary/70 mb-2 mx-auto" />
              <h3 className="text-sm font-medium text-foreground mb-1">效率时钟</h3>
              <p className="text-xs text-foreground/60">时间结构重塑中</p>
            </div>

            <div className="feather-glass-panel p-4 rounded-lg text-foreground/80">
              <Code2 className="w-6 h-6 text-secondary/70 mb-2 mx-auto" />
              <h3 className="text-sm font-medium text-foreground mb-1">模块系统</h3>
              <p className="text-xs text-foreground/60">10+ 功能模块陆续上线</p>
            </div>

            <div className="feather-glass-panel p-4 rounded-lg text-foreground/80">
              <Construction className="w-6 h-6 text-accent/70 mb-2 mx-auto" />
              <h3 className="text-sm font-medium text-foreground mb-1">体验优化</h3>
              <p className="text-xs text-foreground/60">交互与视觉全面提升</p>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs text-foreground/60 mb-2">
              <span>整体进度</span>
              <span>15%</span>
            </div>
            <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary/80 via-secondary/70 to-accent/70"
                initial={{ width: 0 }}
                animate={{ width: '15%' }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>

          <div className="mt-12 p-4 surface-light border border-border/25 rounded-lg">
            <p className="text-xs text-foreground/70">
              小提示：可以尝试切换不同模块，新的界面与主题系统正在逐步接入
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
