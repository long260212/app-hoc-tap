import React, { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../utils/motion';

export const MouseGlow: React.FC = () => {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Disable on reduced motion or touch screens
    if (prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
        if (!isVisible) setIsVisible(true);
      });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-10 transition-opacity duration-300"
      style={{
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        background: `radial-gradient(550px circle at ${position.x}px ${position.y}px, rgba(99, 102, 241, 0.045), rgba(6, 182, 212, 0.02) 40%, transparent 80%)`,
      }}
    />
  );
};
