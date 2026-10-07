import React, { useRef, useState } from 'react';
import { prefersReducedMotion } from '../../utils/motion';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  enableTilt?: boolean;
  spotlightColor?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  enableTilt = false,
  spotlightColor = 'rgba(99, 102, 241, 0.12)',
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || prefersReducedMotion()) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });

    if (enableTilt) {
      // RotateX: -1.5deg to +1.5deg, RotateY: -1.5deg to +1.5deg
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((y - centerY) / centerY) * -1.5;
      const tiltY = ((x - centerX) / centerX) * 1.5;
      setTilt({ x: tiltX, y: tiltY });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `translateY(-4px) perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
          : 'translateY(0px) perspective(1000px) rotateX(0deg) rotateY(0deg)',
        transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1), border-color 200ms ease',
      }}
      className={`relative overflow-hidden rounded-3xl bg-[#0d111a]/80 backdrop-blur-xl border border-white/[0.08] shadow-card hover:border-white/[0.18] hover:shadow-card-hover group ${className}`}
      {...props}
    >
      {/* Radial Spotlight Overlay following cursor */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-200"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(320px circle at ${mousePosition.x}px ${mousePosition.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />

      {/* Subtle top inner border highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};
