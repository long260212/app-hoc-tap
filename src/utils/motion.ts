// Hệ thống Motion Tokens chuẩn hóa theo phong cách Linear/Raycast/Vercel

export const motionTokens = {
  fast: 0.2,
  normal: 0.3,
  entrance: 0.6,
  modal: 0.3,
  ambient: 10,
  chart: 0.85,
  ease: [0.16, 1, 0.3, 1] as const, // Cubic-bezier chuẩn: cubic-bezier(0.16, 1, 0.3, 1)
  easeOut: [0, 0, 0.2, 1] as const,
};

// Kiểm tra prefers-reduced-motion
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Variants chuyển cảnh trang (Page Transition: opacity 0 -> 1, translateY 8px -> 0, duration 250-350ms)
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTokens.normal,
      ease: motionTokens.ease,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: motionTokens.fast,
      ease: motionTokens.ease,
    },
  },
};

// Variants cho Stagger Container
export const staggerContainerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

// Variants cho từng Card Entrance (opacity 0 -> 1, translateY 20px -> 0, scale 0.97 -> 1)
export const cardEntranceVariants = {
  initial: {
    opacity: 0,
    y: 18,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: motionTokens.ease,
    },
  },
};

// Modal Variants (opacity 0 -> 1, scale 0.96 -> 1, translateY 10px -> 0)
export const modalVariants = {
  initial: {
    opacity: 0,
    scale: 0.96,
    y: 10,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: motionTokens.modal,
      ease: motionTokens.ease,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 6,
    transition: {
      duration: 0.2,
      ease: motionTokens.ease,
    },
  },
};

export const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};
