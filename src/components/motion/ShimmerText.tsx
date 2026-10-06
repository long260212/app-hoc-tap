import React from 'react';

interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
}

export const ShimmerText: React.FC<ShimmerTextProps> = ({ children, className = '' }) => {
  return (
    <span
      className={`inline-block font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-400 bg-[length:200%_auto] animate-shimmer ${className}`}
    >
      {children}
    </span>
  );
};
