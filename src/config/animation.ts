import { Variants } from 'framer-motion';

export const ANIMATION_CONFIG = {
  transition: {
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1],
  },
  spring: {
    type: 'spring',
    damping: 25,
    stiffness: 300,
  },
  sidebar: {
    collapsedWidth: 80,
    expandedWidth: 240,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 200,
    },
  },
};

export const sidebarVariants: Variants = {
  expanded: {
    width: ANIMATION_CONFIG.sidebar.expandedWidth,
    transition: ANIMATION_CONFIG.sidebar.transition,
  },
  collapsed: {
    width: ANIMATION_CONFIG.sidebar.collapsedWidth,
    transition: ANIMATION_CONFIG.sidebar.transition,
  },
};

export const contentVariants: Variants = {
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  hidden: {
    opacity: 0,
    x: -10,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export const fadeInVariants: Variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const itemVariants: Variants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};