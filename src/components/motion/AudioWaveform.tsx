import React, { useEffect, useState } from 'react';

interface AudioWaveformProps {
  isActive: boolean;
  barCount?: number;
  className?: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isActive,
  barCount = 28,
  className = '',
}) => {
  const [heights, setHeights] = useState<number[]>(() => Array(barCount).fill(12));

  useEffect(() => {
    if (!isActive) {
      setHeights(Array(barCount).fill(10));
      return;
    }

    let intervalId = setInterval(() => {
      setHeights(
        Array.from({ length: barCount }, (_, i) => {
          // Center bars tend to be higher than edges
          const centerWeight = Math.sin((i / barCount) * Math.PI);
          const randomFactor = Math.random() * 0.7 + 0.3;
          return Math.max(8, Math.min(60, Math.round(50 * centerWeight * randomFactor)));
        })
      );
    }, 90);

    return () => clearInterval(intervalId);
  }, [isActive, barCount]);

  return (
    <div className={`flex items-center justify-center gap-[3px] h-14 px-4 ${className}`}>
      {heights.map((h, idx) => (
        <div
          key={idx}
          style={{
            height: `${h}px`,
            transition: 'height 100ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className={`w-[3px] rounded-full transition-colors ${
            isActive
              ? 'bg-gradient-to-t from-brand-indigo via-brand-teal to-cyan-300'
              : 'bg-slate-700/50'
          }`}
        />
      ))}
    </div>
  );
};
