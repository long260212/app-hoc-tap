import React from 'react';
import { Sparkles } from 'lucide-react';

interface AIThinkingOrbProps {
  text?: string;
  className?: string;
}

export const AIThinkingOrb: React.FC<AIThinkingOrbProps> = ({
  text = 'AI đang lắng nghe và phân tích...',
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-3 p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 backdrop-blur-md ${className}`}>
      {/* Glowing Orb */}
      <div className="relative flex items-center justify-center w-7 h-7">
        <div className="absolute inset-0 rounded-full bg-indigo-500/30 animate-ping duration-1000" />
        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-glow-indigo">
          <Sparkles className="w-3 h-3 animate-spin duration-3000" />
        </div>
      </div>

      {/* Text and Three Smooth Animated Dots */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-200">
        <span>{text}</span>
        <div className="flex items-center gap-1 ml-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" />
        </div>
      </div>
    </div>
  );
};
