import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Layer 1: Dark radial gradient base */}
      <div className="absolute inset-0 bg-[#07090e]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.15),rgba(255,255,255,0))]" />

      {/* Layer 2: Subtle fine grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)',
        }}
      />

      {/* Layer 3: Ultra subtle dot noise */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Layer 4: 4 Animated Ambient Gradient Blobs (8-12s, blur 120-160px) */}
      <div className="absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full bg-indigo-600/10 blur-[140px] animate-blob-1" />
      <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[150px] animate-blob-2" />
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[160px] animate-blob-3" />
      <div className="absolute top-2/3 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/8 blur-[130px] animate-blob-1" />
    </div>
  );
};
