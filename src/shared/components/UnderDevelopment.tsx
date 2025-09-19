'use client';

import { motion } from 'framer-motion';
import { fadeInVariants } from '@/config/animation';
import { Construction } from 'lucide-react';

interface UnderDevelopmentProps {
  moduleName?: string;
  description?: string;
}

export function UnderDevelopment({
  moduleName = '该模块',
  description = '功能正在紧张打磨中，敬请期待'
}: UnderDevelopmentProps) {
  return (
    <motion.div
      variants={fadeInVariants}
      initial="initial"
      animate="animate"
      className="h-full flex items-center justify-center p-8"
    >
      <div className="text-center surface-base border border-border/20 rounded-2xl px-8 py-10 theme-shadow max-w-2xl">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Construction className="w-12 h-12 text-primary/70" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-foreground mb-2">
          {moduleName}
        </h2>

        <p className="text-foreground/70">
          {description}
        </p>

        <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 surface-light border border-primary/25 rounded-full text-foreground/70">
          <div className="w-2 h-2 bg-primary/80 rounded-full animate-pulse" />
          <span className="text-xs">开发中</span>
        </div>
      </div>
    </motion.div>
  );
}
