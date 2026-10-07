import React, { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../utils/motion';
import { AnimatedCounter } from './AnimatedCounter';

interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  title?: string;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 130,
  strokeWidth = 9,
  title = 'Mục tiêu ngày',
  className = '',
}) => {
  const [animatedProgress, setAnimatedProgress] = useState<number>(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cappedProgress = Math.min(100, Math.max(0, progress));

  useEffect(() => {
    if (prefersReducedMotion()) {
      setAnimatedProgress(cappedProgress);
      return;
    }

    const timer = setTimeout(() => {
      setAnimatedProgress(cappedProgress);
    }, 80);

    return () => clearTimeout(timer);
  }, [cappedProgress]);

  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;
  const isComplete = cappedProgress >= 100;

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Animated active gradient ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 900ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />

          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black tracking-tight text-white flex items-baseline">
            <AnimatedCounter value={cappedProgress} duration={900} />
            <span className="text-xs font-bold text-slate-400 ml-0.5">%</span>
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            {title}
          </span>
        </div>

        {/* 100% Complete subtle glow */}
        {isComplete && (
          <div className="absolute inset-0 rounded-full border border-cyan-400/40 shadow-glow-cyan animate-pulse pointer-events-none" />
        )}
      </div>
    </div>
  );
};
